import { Card, CardTitle, FBox, Mem, SectionHeader, Tex } from '../MathFormulaHelpers'

export default function ProfitSection() {
  return (
    <div className="mf-section" id="profit">
      <SectionHeader icon="৳" title="সরল ও চক্রবৃদ্ধি মুনাফা" sub="Simple Interest · Compound Interest · Difference" />
      <div className="mf-grid2">
        <Card color="teal">
          <CardTitle color="var(--mf-teal)">সরল মুনাফা (Simple Interest)</CardTitle>
          <FBox label="সরল মুনাফা (I)" tex={"= \\dfrac{Pnr}{100}"}/>
          <FBox label="মোট পরিমাণ (A)" tex={"= P + I = P\\left(1 + \\dfrac{nr}{100}\\right)"} highlight/>
          <p style={{fontSize:12, color:'var(--text-3)', marginTop:6}}>
            P = মূলধন, n = বছর, r = বার্ষিক হার (%)
          </p>
        </Card>

        <Card color="gold">
          <CardTitle color="var(--mf-gold)">চক্রবৃদ্ধি মুনাফা (Compound Interest)</CardTitle>
          <FBox label="মোট পরিমাণ (A)" tex={"= P\\left(1 + \\dfrac{r}{100}\\right)^n"} highlight/>
          <FBox label="চক্রবৃদ্ধি মুনাফা" tex={"= A - P"}/>
          <p style={{fontSize:12, color:'var(--text-3)', marginTop:6}}>
            P = মূলধন, n = বছর, r = বার্ষিক হার (%)
          </p>
        </Card>
      </div>

      <Card color="violet" style={{marginTop:14}}>
        <CardTitle color="var(--mf-violet)">বিশেষ সূত্র</CardTitle>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(167,139,250,.08)',border:'1px solid rgba(167,139,250,.25)'}}>
            <div style={{fontSize:12,color:'var(--mf-violet)',fontWeight:700,marginBottom:6}}>সুদে-আসলে n গুণ হলে সুদের হার</div>
            <div style={{textAlign:'center',marginBottom:6}}><Tex>{"r = \\dfrac{n-1}{\\text{time}} \\times 100\\%"}</Tex></div>
            <div style={{fontSize:11,color:'var(--text-3)'}}>উদা: 5 বছরে 3 গুণ হলে → r = (3−1)/5 × 100 = <strong>40%</strong></div>
          </div>
          <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(15,219,168,.08)',border:'1px solid rgba(15,219,168,.25)'}}>
            <div style={{fontSize:12,color:'var(--mf-teal)',fontWeight:700,marginBottom:4}}>n বছরে দ্বিগুণ হলে, তিন গুণ হতে লাগবে</div>
            <div style={{fontSize:15,fontWeight:700,color:'var(--mf-teal)',marginBottom:4,textAlign:'center'}}>2n বছর</div>
            <div style={{fontSize:11,color:'var(--text-3)'}}>উদা: 4 বছরে দ্বিগুণ → তিন গুণ হতে 8 বছর</div>
          </div>
          <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(240,165,0,.08)',border:'1px solid rgba(240,165,0,.25)'}}>
            <div style={{fontSize:12,color:'var(--mf-gold2)',fontWeight:700,marginBottom:6}}>চক্রবৃদ্ধি — ধাপে ধাপে গুণ</div>
            <div style={{textAlign:'center',marginBottom:6}}><Tex>{"C = P\\left(1+\\dfrac{r}{100}\\right)^t"}</Tex></div>
            <div style={{fontSize:11,color:'var(--text-3)'}}>উদা: P=100, r=5%, t=2 → 100 × <strong>105/100 × 105/100</strong> = 110.25</div>
          </div>
        </div>
      </Card>

      <Card color="rose" style={{marginTop:14}}>
        <CardTitle color="var(--mf-rose)">সরল ও চক্রবৃদ্ধি মুনাফার পার্থক্য</CardTitle>
        <div className="mf-legend" style={{marginBottom:12}}>
          <span><strong>P</strong> = মূলধন</span>
          <span><strong>r</strong> = হার ÷ 100 (দশমিকে)</span>
          <span><strong>n</strong> = বছর</span>
        </div>
        <div className="mf-grid2">
          <div>
            <FBox label="2 বছরের পার্থক্য" tex={"= Pr^2"} highlight/>
            <p style={{fontSize:12, color:'var(--text-3)', marginTop:4, textAlign:'center'}}>
              যেমন: P=3000, r=10%=0.1 → 3000×0.01 = 30
            </p>
          </div>
          <div>
            <FBox label="3 বছরের পার্থক্য" tex={"= 3Pr^2 + Pr^3"} highlight/>
            <p style={{fontSize:12, color:'var(--text-3)', marginTop:4, textAlign:'center'}}>
              যেমন: P=100, r=5%=0.05 → 3×100×0.0025 + 100×0.000125
            </p>
          </div>
        </div>
        <Mem title="💡 মনে রাখুন">
          <ul>
            <li>r সবসময় <strong>দশমিকে</strong> দাও — হার ÷ 100 (যেমন 5% → 0.05)</li>
            <li>2 বছর → শুধু <strong>Pr²</strong> (একটি পদ)</li>
            <li>3 বছর → <strong>3Pr² + Pr³</strong> (দুটি পদ)</li>
            <li>পার্থক্য = চক্রবৃদ্ধি − সরল মুনাফা</li>
          </ul>
        </Mem>
      </Card>
    </div>
  )
}
