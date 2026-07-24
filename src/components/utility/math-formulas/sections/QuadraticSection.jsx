import { SectionHeader, Card, CardTitle, CoverEq, FBox } from '../MathFormulaHelpers'

export default function QuadraticSection() {
  return (
    <div className="mf-section" id="quadratic">
      <SectionHeader icon="x²" title="দ্বিঘাত সমীকরণ" sub="Quadratic Equation · Roots · Discriminant" />

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))',gap:12}}>
        <Card color="blue">
          <CardTitle color="var(--mf-blue)">মানক রূপ: ax² + bx + c = 0 <span style={{fontWeight:400,fontSize:12,color:'var(--text-3)'}}>(α, β = দুটি মূল)</span></CardTitle>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:10}}>
            {[
              "\\alpha+\\beta = -\\tfrac{b}{a}",
              "\\alpha\\beta = \\tfrac{c}{a}",
              "D = b^2-4ac",
            ].map(tex => (
              <div key={tex} className="mf-f-box highlight" style={{flex:'1 1 auto',alignItems:'center',justifyContent:'center',padding:'8px 12px',margin:0,textAlign:'center',minWidth:0}}>
                <span className="val"><CoverEq>{tex}</CoverEq></span>
              </div>
            ))}
          </div>
          <div className="mf-f-box highlight" style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,padding:'10px 14px',margin:0}}>
            <span className="val"><CoverEq>{"x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"}</CoverEq></span>
          </div>
        </Card>

        <Card color="gold">
          <CardTitle>④ D ও মূলের প্রকৃতি</CardTitle>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {[
              {cond:'D > 0',          desc:'বাস্তব ও অসমান',   bg:'rgba(15,219,168,.12)',  border:'var(--mf-teal)',   tc:'var(--mf-teal)'  },
              {cond:'D = 0',          desc:'বাস্তব ও সমান',    bg:'rgba(240,165,0,.12)',   border:'var(--mf-gold)',   tc:'var(--mf-gold2)' },
              {cond:'D < 0',          desc:'জটিল (কাল্পনিক)', bg:'rgba(240,108,126,.12)', border:'var(--mf-rose)',   tc:'var(--mf-rose)'  },
              {cond:'D > 0, পূর্ণবর্গ',desc:'মূলদ (Rational)', bg:'rgba(167,139,250,.12)', border:'var(--mf-violet)', tc:'var(--mf-violet)'},
            ].map(r => (
              <div key={r.cond} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:9,background:r.bg,border:`1px solid ${r.border}`}}>
                <code style={{fontWeight:800,fontSize:13,color:r.tc,minWidth:100,whiteSpace:'nowrap'}}>{r.cond}</code>
                <span style={{color:'var(--text-1)',fontSize:13,fontWeight:600}}>→ {r.desc}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">⑤ মূল থেকে সমীকরণ</CardTitle>
          <FBox label="" tex={"x^2 - (\\alpha+\\beta)\\,x + \\alpha\\beta = 0"} highlight/>
          <p style={{fontSize:12,color:'var(--text-3)',marginTop:8}}><strong>x² − (সমষ্টি)x + (গুণফল) = 0</strong></p>
          <p style={{fontSize:12,color:'var(--text-3)',marginTop:4}}>মূল ৩ ও ৪ হলে: x² − 7x + 12 = 0</p>
        </Card>
      </div>
    </div>
  )
}
