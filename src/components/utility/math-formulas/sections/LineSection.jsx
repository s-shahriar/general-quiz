import { SectionHeader, Card, CardTitle, Tex } from '../MathFormulaHelpers'

export default function LineSection() {
  return (
    <div className="mf-section" id="line">
      <SectionHeader icon="∕" title="সরল রেখা" sub="Straight Line · Slope · Forms · Parallel & Perpendicular" />

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))',gap:12}}>
        <Card color="blue">
          <CardTitle color="var(--mf-blue)">মূল সূত্রসমূহ</CardTitle>
          {[
            { label: 'মিডপয়েন্ট',   tex: "\\left(\\tfrac{x_1+x_2}{2},\\;\\tfrac{y_1+y_2}{2}\\right)" },
            { label: 'দূরত্ব',        tex: "\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}" },
            { label: 'ঢাল (Slope)',   tex: "m = \\tan\\theta = \\tfrac{y_2-y_1}{x_2-x_1}" },
          ].map(({label, tex}) => (
            <div key={label} className="mf-f-box" style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,padding:'7px 10px',margin:'5px 0'}}>
              <span className="label" style={{fontSize:12,whiteSpace:'nowrap'}}>{label}</span>
              <span className="val" style={{textAlign:'right',width:'auto'}}><Tex>{tex}</Tex></span>
            </div>
          ))}
        </Card>

        <Card color="teal">
          <CardTitle color="var(--mf-teal)">রেখার বিভিন্ন রূপ (Forms)</CardTitle>
          {[
            { label: 'Slope-intercept', tex: "y = mx + c" },
            { label: 'Intercept form',  tex: "\\tfrac{x}{a} + \\tfrac{y}{b} = 1" },
            { label: 'Standard form',   tex: "ax + by + c = 0" },
            { label: 'দুই বিন্দু দিয়ে', tex: "\\tfrac{y-y_1}{y_2-y_1} = \\tfrac{x-x_1}{x_2-x_1}" },
          ].map(({label, tex}) => (
            <div key={label} className="mf-f-box" style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,padding:'7px 10px',margin:'5px 0'}}>
              <span className="label" style={{fontSize:12,whiteSpace:'nowrap'}}>{label}</span>
              <span className="val" style={{textAlign:'right',width:'auto'}}><Tex>{tex}</Tex></span>
            </div>
          ))}
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">সমান্তরাল রেখা (Parallel)</CardTitle>
          <p style={{fontSize:12,color:'var(--text-3)',marginBottom:10}}>
            দুই রেখা <strong>a₁x + b₁y + c₁ = 0</strong> ও <strong>a₂x + b₂y + c₂ = 0</strong> সমান্তরাল হলে:
          </p>
          <div style={{padding:'12px 14px',borderRadius:10,background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.3)'}}>
            <div style={{fontSize:15,marginBottom:8}}><Tex>{"\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\neq \\dfrac{c_1}{c_2}"}</Tex></div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',fontSize:12,color:'var(--text-3)'}}>
              <span>উদা: 3x+2ky−7=0 ∥ 2x+5y+1=0 হলে</span>
              <code style={{background:'rgba(167,139,250,.15)',padding:'2px 7px',borderRadius:5,color:'var(--mf-violet)',fontWeight:700}}>3/2 = 2k/5</code>
              <span>→ k = 15/4</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
