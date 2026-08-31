// Written » Data — handwritten note screenshots transcribed as-is (close approximations,
// not audited figures) and grouped by subject so they're easy to scan and recall.
import {
  TrendingUp, TrendingDown, Users, Percent, HandCoins,
  Globe, ShoppingBag, PiggyBank, Wallet, ShieldAlert, Receipt, GraduationCap,
} from 'lucide-react'

export const DATA_CATEGORIES = {
  'সামষ্টিক অর্থনীতি': '#0ea5e9',
  'জনসংখ্যা ও কর্মসংস্থান': '#f59e0b',
  'বৈদেশিক খাত': '#22c55e',
  'রাজস্ব ও আর্থিক খাত': '#ef4444',
  'বাজেট': '#a78bfa',
}

export const DATA_CARDS = [
  {
    id: 1, cat: 'সামষ্টিক অর্থনীতি',
    title: 'জিডিপির আকার', subtitle: 'Size of GDP', icon: TrendingUp,
    body: `১৯৭২ — <strong>$৬-৭ বিলিয়ন</strong><br>২০২২ — <strong>$৪৬৫ বিলিয়ন</strong><br>২০২৬ — <strong>$৫০১ বিলিয়ন</strong> [BBS]<br>২০৩৪ (লক্ষ্যমাত্রা) — <strong>$১ ট্রিলিয়ন</strong> (১০০০ বিলিয়ন)`,
    tip: `৭ → ৫০১ → ১০০০ — ধারাবাহিক বৃদ্ধি মনে রাখো এই তিন ধাপে`,
  },
  {
    id: 2, cat: 'সামষ্টিক অর্থনীতি',
    title: 'জিডিপি প্রবৃদ্ধির হার', subtitle: 'GDP Growth Rate', icon: Percent,
    body: `১৯৭২-৭৩ — <strong>২.৫%</strong><br>২০২৫-২৬ — <strong>৪.১৪%</strong> [BBS]`,
    tip: `৫০ বছরে প্রবৃদ্ধির হার প্রায় দ্বিগুণ (২.৫ → ৪.১৪)`,
  },
  {
    id: 3, cat: 'জনসংখ্যা ও কর্মসংস্থান',
    title: 'ডেমোগ্রাফিক ডিভিডেন্ড', subtitle: 'জনমিতিক লভ্যাংশ', icon: Users,
    body: `কর্মক্ষম বয়সসীমা (<strong>১৫-৬৪ বছর</strong>) জনগোষ্ঠীর <strong>৬৫%</strong><br>তরুণদের অংশীদারিত্ব — <strong>১১ কোটি ৪২ লক্ষ</strong><br>শুরু <strong>২০০০ সাল</strong> থেকে, স্থায়ী <strong>২০৩৩/২০৪০</strong> পর্যন্ত (জনসংখ্যার বোনাসকাল)`,
    tip: `১৫-৬৪ = কর্মক্ষম বয়স, ৬৫% জনসংখ্যা কর্মক্ষম, ২০০০ থেকে ২০৩৩/৪০ পর্যন্ত বোনাসকাল`,
  },
  {
    id: 4, cat: 'জনসংখ্যা ও কর্মসংস্থান',
    title: 'বেকারত্বের হার', subtitle: 'Unemployment Rate', icon: TrendingDown,
    body: `BBS হিসাবে — <strong>৪.৬৩%</strong><br>মোট বেকার — <strong>২৭ লক্ষ ৪০ হাজার</strong> (মূলত তরুণ)`,
    tip: `৪.৬৩% ≈ ২৭ লক্ষ ৪০ হাজার বেকার — একসাথে মনে রাখো`,
  },
  {
    id: 5, cat: 'জনসংখ্যা ও কর্মসংস্থান',
    title: 'দারিদ্র্যের হার', subtitle: 'Poverty Rate', icon: Percent,
    body: `১৯৭৩ — <strong>৮৯%</strong><br>২০২০ — <strong>২০.৫%</strong><br>২০২২ — <strong>১৮.৭%</strong><br>২০২৬ — <strong>২৭.৯৩%</strong> [BBS/PPRC]`,
    tip: `৮৯% থেকে ধারাবাহিক পতন, কিন্তু ২০২৬-এ আবার ঊর্ধ্বমুখী — শেষ সংখ্যাটাই ব্যতিক্রম`,
  },
  {
    id: 6, cat: 'বৈদেশিক খাত',
    title: 'বৈদেশিক মুদ্রার রিজার্ভ', subtitle: 'Forex Reserve', icon: PiggyBank,
    body: `১৯৭১ — <strong>$৩ কোটি</strong><br>২০২১ (আগস্ট, সর্বোচ্চ) — <strong>$৪৮.০১ বিলিয়ন</strong><br>২০২৪ — কমে <strong>$২০ বিলিয়নের নিচে</strong> নেমে যায়<br>২০২৬ — <strong>$৩৫ বিলিয়ন+</strong>`,
    tip: `৪৮ (সর্বোচ্চ, ২১) → ২০-এর নিচে (তলানি, ২৪) → ৩৫+ (ফেরত, ২৬) — ওঠানামার গল্প`,
  },
  {
    id: 7, cat: 'বৈদেশিক খাত',
    title: 'পণ্য রপ্তানি', subtitle: 'Export (RMG সহ)', icon: ShoppingBag,
    body: `১৯৭২-৭৩ — <strong>$৩৪ কোটি</strong><br>২০২৪-২৫ — <strong>$৪৮.২৮ বিলিয়ন</strong> [EPB]<br>২০২৫-২৬ — <strong>$৪৮ বিলিয়ন</strong><br>এর মধ্যে <strong>RMG (তৈরি পোশাক)</strong> রপ্তানি — <strong>$৩৮.৭০ বিলিয়ন</strong>`,
    tip: `মোট রপ্তানির প্রায় ৮০%-ই RMG (৪৮ বিলিয়নের মধ্যে ৩৮.৭)`,
  },
  {
    id: 8, cat: 'বৈদেশিক খাত',
    title: 'রেমিট্যান্স', subtitle: 'প্রবাসী আয়', icon: HandCoins,
    body: `১৯৭৬-৭৭ — <strong>$৪৯ মিলিয়ন</strong><br>২০২৪-২৫ — <strong>$৩০.৩২ বিলিয়ন</strong><br>২০২৫-২৬ — <strong>$৩৫.৫৯ বিলিয়ন</strong> [BB]`,
    tip: `মিলিয়ন থেকে বিলিয়নে উত্তরণ — ৪৯ মিলিয়ন → ৩৫.৫৯ বিলিয়ন`,
  },
  {
    id: 9, cat: 'বৈদেশিক খাত',
    title: 'বৈদেশিক বিনিয়োগ', subtitle: 'FDI', icon: Globe,
    body: `২০২৪ — <strong>$১.২৭ বিলিয়ন</strong><br>২০২৫ — <strong>$১.৭৭ বিলিয়ন</strong>`,
    tip: `১.২৭ → ১.৭৭ — এক বছরে সামান্য বৃদ্ধি`,
  },
  {
    id: 10, cat: 'রাজস্ব ও আর্থিক খাত',
    title: 'খেলাপি ঋণ', subtitle: 'Default Loan', icon: ShieldAlert,
    body: `সর্বোচ্চ — <strong>৬ লক্ষ ৭৭ হাজার কোটি টাকা</strong><br>মার্চ ২০২৬ — কমে <strong>৫ লক্ষ ৪৪ হাজার কোটি টাকা</strong> [BB]`,
    tip: `৬.৭৭ লক্ষ কোটি থেকে কমে ৫.৪৪ লক্ষ কোটি — কমছে`,
  },
  {
    id: 11, cat: 'রাজস্ব ও আর্থিক খাত',
    title: 'মানি লন্ডারিং — পাচারকৃত অর্থ', subtitle: 'টাকা ফেরত আনার প্রচেষ্টা', icon: Wallet,
    body: `White Paper কমিটির হিসাবে বিগত <strong>১৫ বছরে</strong> পাচার — <strong>$২৩৪ বিলিয়ন ডলার</strong>`,
    tip: `White Paper → ২৩৪ বিলিয়ন ডলার, ১৫ বছরের হিসাব`,
  },
  {
    id: 12, cat: 'রাজস্ব ও আর্থিক খাত',
    title: 'রাজস্ব আদায়ের হার', subtitle: 'Tax-GDP Ratio', icon: Receipt,
    body: `Tax-GDP Ratio — <strong>৭.৮%</strong> [NBR/IMF]<br>দক্ষিণ এশিয়ার মধ্যে <em class="warning">সর্বনিম্ন পর্যায়ে</em>`,
    tip: `প্রতি ১০০ টাকা আয়ে মাত্র ~৮ টাকা কর — দক্ষিণ এশিয়ায় সবার নিচে`,
  },
  {
    id: 13, cat: 'বাজেট',
    title: 'শিক্ষা খাতের বরাদ্দ', subtitle: 'Education Budget', icon: GraduationCap,
    body: `২০২৬-২৭ অর্থবছরের বাজেট বরাদ্দ — <strong>১ লক্ষ ৩৬ হাজার কোটি টাকা</strong><br>মোট GDP-র — <strong>~২%</strong> (আন্তর্জাতিক মানদণ্ড <strong>৬%</strong>)<br>গবেষণা খাতে বরাদ্দ তুলনামূলক <em class="warning">কম</em>`,
    tip: `২% বরাদ্দ, মানদণ্ড ৬% — মানদণ্ড থেকে প্রায় ৩ গুণ কম`,
  },
]
