import { Card, CardTitle, IdItem, Mem, SectionHeader, Tex, Warn } from '../MathFormulaHelpers'

export default function AlgebraSection() {
  return (
    <div className="mf-section" id="algebra">
      <SectionHeader icon="≡" title="বীজগণিতীয় সূত্রাবলি" sub="Algebraic Identities" />
      <div className="mf-grid2">
        <Card color="rose">
          <CardTitle>বর্গ সংক্রান্ত সূত্র (Square Identities)</CardTitle>
          <div className="mf-id-list">
            <IdItem n="1"><Tex>{"(a+b)^2 = (a-b)^2 + 4ab"}</Tex></IdItem>
            <IdItem n="2"><Tex>{"(a-b)^2 = (a+b)^2 - 4ab"}</Tex></IdItem>
            <IdItem n="3"><Tex>{"a^2 + b^2 = (a+b)^2 - 2ab = (a-b)^2 + 2ab"}</Tex></IdItem>
            <IdItem n="4"><Tex>{"2(a^2+b^2) = (a+b)^2 + (a-b)^2"}</Tex></IdItem>
            <IdItem n="5"><Tex>{"4ab = (a+b)^2 - (a-b)^2"}</Tex></IdItem>
            <IdItem n="6"><Tex>{"ab = \\left[\\dfrac{a+b}{2}\\right]^2 - \\left[\\dfrac{a-b}{2}\\right]^2"}</Tex></IdItem>
          </div>
          <Mem title="💡 মনে রাখুন">
            <ul>
              <li>(a+b)² আর (a−b)²-এর পার্থক্য সবসময় <strong>4ab</strong></li>
              <li>ওদের যোগফল <strong>2(a²+b²)</strong> — মাঝের পদ কেটে যায়</li>
              <li>a²+b² চাইলে বর্গ থেকে <strong>2ab</strong> বিয়োগ করো</li>
            </ul>
          </Mem>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">তিন পদ ও ঘন সংক্রান্ত সূত্র</CardTitle>
          <div className="mf-id-list">
            <IdItem n="7"><Tex>{"(a+b+c)^2 = a^2+b^2+c^2+2(ab+bc+ca)"}</Tex></IdItem>
            <IdItem n="8"><Tex>{"(x+a)(x+b) = x^2+(a+b)x+ab"}</Tex></IdItem>
            <IdItem n="9" star><Tex>{"(a+b)^3 = a^3+3a^2b+3ab^2+b^3"}</Tex></IdItem>
            <IdItem n="10"><Tex>{"(a+b)^3 = a^3+b^3+3ab(a+b)"}</Tex></IdItem>
            <IdItem n="11"><Tex>{"(a-b)^3 = a^3-3a^2b+3ab^2-b^3"}</Tex></IdItem>
            <IdItem n="12"><Tex>{"(a-b)^3 = a^3-b^3-3ab(a-b)"}</Tex></IdItem>
            <IdItem n="13"><Tex>{"a^3+b^3 = (a+b)(a^2-ab+b^2)"}</Tex></IdItem>
            <IdItem n="14"><Tex>{"a^3-b^3 = (a-b)(a^2+ab+b^2)"}</Tex></IdItem>
            <IdItem n="15"><Tex>{"a^3+b^3 = (a+b)^3-3ab(a+b)"}</Tex></IdItem>
            <IdItem n="16"><Tex>{"a^3-b^3 = (a-b)^3+3ab(a-b)"}</Tex></IdItem>
          </div>
          <Mem title="💡 ঘন সূত্র মনে রাখুন">
            <ul>
              <li>(a+b)³: a³, <strong>+</strong>3a²b, <strong>+</strong>3ab², <strong>+</strong>b³</li>
              <li>(a−b)³: a³, <strong>−</strong>3a²b, <strong>+</strong>3ab², <strong>−</strong>b³ (চিহ্ন পাল্টায়)</li>
              <li>সংক্ষিপ্ত রূপ: (a±b)³ = a³ ± b³ <strong>± 3ab(a±b)</strong> — পরীক্ষায় দ্রুত কাজে লাগে</li>
              <li>উল্টো করে: a³+b³ = (a+b)³ <strong>−</strong> 3ab(a+b) &nbsp;|&nbsp; a³−b³ = (a−b)³ <strong>+</strong> 3ab(a−b) — চিহ্ন উল্টো!</li>
              <li>a³+b³ → মাঝে <strong>−ab</strong> → (a²−ab+b²) &nbsp;|&nbsp; a³−b³ → মাঝে <strong>+ab</strong> → (a²+ab+b²)</li>
            </ul>
          </Mem>
        </Card>
      </div>
      <Warn title="⚠️ সবচেয়ে বেশি ভুল হয় এই সূত্রগুলোতে" style={{marginTop:10}}>
        <p>(a+b)³ ≠ a³ + b³ (3ab(a+b) ভুলে যাবেন না!) &nbsp;|&nbsp; a³+b³ ≠ (a+b)³ &nbsp;|&nbsp; সংক্ষিপ্ত রূপে 3ab পদটি বাদ দেবেন না</p>
      </Warn>
    </div>
  )
}
