import { SectionHeader, Card, CardTitle, Tex, Mem } from '../MathFormulaHelpers'

export default function RealNumberSection() {
  return (
    <div className="mf-section" id="real-number">
      <SectionHeader icon="ℝ" title="বাস্তব সংখ্যা" sub="Real Numbers · সংখ্যা তত্ত্ব" />
      <div className="mf-grid2">
        <Card color="blue">
          <CardTitle color="var(--mf-blue)">গুণনীয়ক / উৎপাদকের সংখ্যা নির্ণয়</CardTitle>
          <p style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>
            সংখ্যাটিকে <strong>মৌলিক উৎপাদকে</strong> ভাঙো, প্রতিটি ঘাতের সাথে <strong>১ যোগ</strong> করে সব <strong>গুণ</strong> করো।
          </p>
          <div className="mf-series-card">
            <div className="step">সূত্র — সংখ্যা N = pᵃ × qᵇ × rᶜ … হলে</div>
            <div className="formula"><Tex>{"\\text{মোট গুণনীয়ক} = (a+1)(b+1)(c+1)\\cdots"}</Tex></div>
          </div>
          <div className="mf-series-card" style={{borderLeft:'3px solid #0fdba8'}}>
            <div className="step">উদাহরণ</div>
            <div className="formula"><Tex>{"72 = 2^3 \\times 3^2 \\Rightarrow (3+1)(2+1) = 4 \\times 3 = 12"}</Tex></div>
            <div style={{fontSize:12,color:'var(--text-3)',marginTop:6}}>অর্থাৎ <strong>৭২</strong>-এর মোট <strong>১২টি</strong> গুণনীয়ক আছে।</div>
          </div>
          <Mem title="💡 মনে রাখুন">
            <ul>
              <li>আগে <strong>মৌলিক উৎপাদকে</strong> ভাঙো (যেমন ৭২ = ২³ × ৩²)</li>
              <li>প্রতিটি <strong>ঘাত + ১</strong> করে সবগুলো <strong>গুণ</strong> করো</li>
            </ul>
          </Mem>
        </Card>

        <Card color="gold">
          <CardTitle>গুরুত্বপূর্ণ সংখ্যা-ধর্ম</CardTitle>

          <div className="mf-series-card" style={{borderLeft:'3px solid #f0a500'}}>
            <div className="step">পরপর দুটি পূর্ণ সংখ্যার বর্গের পার্থক্য = x হলে</div>
            <div className="formula"><Tex>{"\\text{বড় সংখ্যা} = \\dfrac{x+1}{2}, \\quad \\text{ছোট সংখ্যা} = \\dfrac{x-1}{2}"}</Tex></div>
            <div style={{fontSize:12,color:'var(--text-3)',marginTop:6}}>
              যেমন: <strong>8² − 7² = 15</strong> → বড় = (15+1)/2 = <strong>8</strong>, ছোট = (15−1)/2 = <strong>7</strong>
            </div>
          </div>

          <div className="mf-series-card" style={{borderLeft:'3px solid #a78bfa'}}>
            <div className="step">পরপর ৩টি ক্রমিক সংখ্যার ধর্ম</div>
            <ul className="mf-prop-list" style={{marginTop:4}}>
              <li><strong>যোগফল</strong> → সর্বদা <strong>৩ দ্বারা বিভাজ্য</strong></li>
              <li><strong>গুণফল</strong> → সর্বদা <strong>২ দ্বারা বিভাজ্য</strong></li>
            </ul>
          </div>

          <div className="mf-series-card" style={{borderLeft:'3px solid #0fdba8'}}>
            <div className="step">২ অঙ্কের সংখ্যা Reverse (উল্টানো) করলে</div>
            <div className="formula"><Tex>{"\\text{অঙ্কদ্বয়ের পার্থক্য} = \\dfrac{\\text{দুই সংখ্যার পার্থক্য}}{9}"}</Tex></div>
            <div style={{fontSize:12,color:'var(--text-3)',marginTop:6}}>
              মূল ও উল্টানো সংখ্যার পার্থক্য সর্বদা <strong>৯ দ্বারা বিভাজ্য</strong>। যেমন: <strong>72 − 27 = 45</strong> → 45 ÷ 9 = <strong>5</strong> (7−2)।
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
