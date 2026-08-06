#!/data/data/com.termux/files/usr/bin/bash
# livefav — fetch your latest LiveMCQ favourites into Downloads/live_fav/
# Install (in Termux):
#   pkg install -y curl jq && termux-setup-storage
#   grant Termux root in KernelSU Manager (Superuser tab)
#   mkdir -p $PREFIX/bin && cp livefav.sh $PREFIX/bin/livefav && chmod +x $PREFIX/bin/livefav
# Usage:
#   livefav          newest 1 page (20)
#   livefav -p N     newest N pages (N x 20)
#   livefav -n N     newest N questions
#   livefav N        newest N questions (bare number)
set -euo pipefail
API="https://livemcq.com/api/v1/central-favorite-list/"
PREFS="/data/data/com.livemcq.livemcq/shared_prefs/FlutterSharedPreferences.xml"
OUTDIR="/sdcard/Download/live_fav"; PAGE_SIZE=20

usage(){ cat <<EOF
livefav — latest LiveMCQ favourites -> $OUTDIR
  livefav          newest 1 page (20)
  livefav -p N     newest N pages (N x 20)
  livefav -n N     newest N questions
  livefav N        newest N questions (bare number)
EOF
exit 1; }

MODE="pages"; VAL=1
if [ $# -gt 0 ]; then case "$1" in
  -p|--pages) MODE="pages"; VAL="${2:-}";;
  -n|--num)   MODE="num";   VAL="${2:-}";;
  -h|--help)  usage;;
  *) if [[ "$1" =~ ^[0-9]+$ ]]; then MODE="num"; VAL="$1"; else usage; fi;;
esac; fi
[[ "${VAL:-}" =~ ^[0-9]+$ ]] && [ "$VAL" -ge 1 ] || usage

# read token via root (self-heals after re-login)
TOKEN="$(su -c "cat $PREFS" 2>/dev/null | grep -o 'flutter.token">[^<]*' | sed 's/.*>//')" || true
if [ -z "${TOKEN:-}" ]; then
  echo "ERROR: could not read token."
  echo "  - Grant Termux root in KernelSU Manager, and be logged in to LiveMCQ."
  exit 1
fi

if [ "$MODE" = "num" ]; then PAGES=$(( (VAL + PAGE_SIZE - 1) / PAGE_SIZE )); LIMIT="$VAL"
else PAGES="$VAL"; LIMIT=$(( PAGES * PAGE_SIZE )); fi

echo "Fetching $PAGES page(s), up to $LIMIT question(s)..."
TMP="$(mktemp -d)"; FILES=()
for p in $(seq 1 "$PAGES"); do
  curl -fsS -H "Authorization: Token $TOKEN" -H "Accept: application/json" "${API}?page=${p}" -o "$TMP/p$p.json" \
    || { echo "ERROR: request failed on page $p (token expired? re-open the app, retry)."; rm -rf "$TMP"; exit 1; }
  FILES+=("$TMP/p$p.json")
done

mkdir -p "$OUTDIR"; OUT="$OUTDIR/livefav_$(date +%Y%m%d_%H%M%S).json"
jq -s --argjson lim "$LIMIT" '[ .[].question_list[] ] | .[:$lim]
  | map({favorite_id, slug, question,
      options: [.option1,.option2,.option3,.option4,.option5]|map(select(.!=null and .!="")),
      answer, explanation: .exp})' "${FILES[@]}" > "$OUT"

echo "OK  saved $(jq length "$OUT") question(s) -> $OUT"
echo "    newest favorite_id: $(jq -r '.[0].favorite_id' "$OUT")"
rm -rf "$TMP"
command -v termux-clipboard-set >/dev/null 2>&1 && printf '%s' "$OUT" | termux-clipboard-set && echo "    (path copied to clipboard)"
