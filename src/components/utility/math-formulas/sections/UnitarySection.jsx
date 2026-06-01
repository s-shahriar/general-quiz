import { Card, CardTitle, Mem, SectionHeader, Tex } from '../MathFormulaHelpers'

export default function UnitarySection() {
  return (
    <div className="mf-section" id="unitary">
      <SectionHeader icon="⚖" title="ঐকিক নিয়ম" sub="Unitary Method · Work-Time · Average Speed" />

      <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
        <Card color="rose" style={{flex:1,minWidth:280}}>
          <CardTitle color="var(--mf-rose)">কাজ-সময় সূত্র (Work-Time Formula)</CardTitle>
          <div style={{textAlign:'center',margin:'12px 0'}}>
            <Tex>{"\\dfrac{M_1 D_1 H_1}{W_1} = \\dfrac{M_2 D_2 H_2}{W_2}"}</Tex>
          </div>
          <div style={{fontSize:13,color:'var(--text-3)',lineHeight:1.7}}>
            <p>যেখানে:</p>
            <ul style={{marginTop:6,marginLeft:18}}>
              <li><strong style={{color:'var(--mf-rose)'}}>M</strong> = মানুষ (Man/People)</li>
              <li><strong style={{color:'var(--mf-rose)'}}>D</strong> = দিন (Day)</li>
              <li><strong style={{color:'var(--mf-rose)'}}>H</strong> = সময় (Time/Hours)</li>
              <li><strong style={{color:'var(--mf-rose)'}}>W</strong> = কাজ (Work)</li>
            </ul>
          </div>
          <Mem title="💡 মনে রাখুন" style={{marginTop:12}}>
            <p>মানুষ, দিন ও সময় বেশি হলে কাজ বেশি হয় — সব গুণফল কাজের সমানুপাতিক।</p>
          </Mem>
        </Card>

        <Card color="teal" style={{flex:1,minWidth:280}}>
          <CardTitle color="var(--mf-teal)">গড় বেগ (Average Speed)</CardTitle>
          <div style={{textAlign:'center',margin:'10px 0 14px'}}>
            <Tex>{"V_{avg} = \\dfrac{2xy}{x+y}"}</Tex>
          </div>
          <div style={{fontSize:13,color:'var(--text-3)',lineHeight:1.7}}>
            <p>যেখানে <strong style={{color:'var(--mf-teal)'}}>x</strong> ও <strong style={{color:'var(--mf-teal)'}}>y</strong> হলো দুটি বেগ (একই দূরত্ব দুটি ভিন্ন বেগে অতিক্রম করলে)</p>
            <p style={{marginTop:6}}>উদা: যাওয়া 40 km/h, আসা 60 km/h → গড় বেগ = <strong>2×40×60 / (40+60) = 48 km/h</strong></p>
          </div>
        </Card>

        <Card color="violet" style={{flex:1,minWidth:280}}>
          <CardTitle color="var(--mf-violet)">নল ও চৌবাচ্চা (Pipes and Cisterns)</CardTitle>
          <div style={{fontSize:13,color:'var(--text-3)',lineHeight:1.7,marginBottom:12}}>
            <p>যদি দুটি নল দ্বারা একটি চৌবাচ্চা যথাক্রমে <strong style={{color:'var(--mf-violet)'}}>t₁</strong> ও <strong style={{color:'var(--mf-violet)'}}>t₂</strong> সময়ে পূর্ণ হয়, তবে নল দুটি একসাথে খোলা থাকলে চৌবাচ্চাটি পূর্ণ হতে সময় লাগবে:</p>
            <div style={{textAlign:'center',margin:'10px 0 14px'}}>
              <Tex>{"\\dfrac{t_1 t_2}{t_1 + t_2}"}</Tex>
            </div>
            <p>যদি একটি নল দ্বারা একটি চৌবাচ্চা <strong style={{color:'var(--mf-violet)'}}>t₁</strong> সময়ে পূর্ণ হয় এবং অন্য একটি নল দ্বারা <strong style={{color:'var(--mf-violet)'}}>t₂</strong> সময়ে খালি হয়, তবে নল দুটি একসাথে খোলা থাকলে চৌবাচ্চাটি পূর্ণ হতে সময় লাগবে:</p>
            <div style={{textAlign:'center',margin:'10px 0 14px'}}>
              <Tex>{"\\dfrac{t_1 t_2}{t_1 - t_2}"}</Tex>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
