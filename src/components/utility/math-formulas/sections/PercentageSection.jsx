import { Card, CardTitle, SectionHeader, Tex } from '../MathFormulaHelpers'

export default function PercentageSection() {
  return (
    <div className="mf-section" id="percentage">
      <SectionHeader icon="%" title="শতকরা" sub="Percentage · Successive Change · Comparative" />

      <div className="mf-grid2">

        <Card color="blue">
          <CardTitle color="var(--mf-blue)">দুটি ক্রমিক পরিবর্তন (Successive %)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0 12px'}}>
            <Tex>{"\\left(a + b + \\dfrac{ab}{100}\\right)\\%"}</Tex>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:5,fontSize:12}}>
            {[
              { shape:'ত্রিভুজ — ভূমি a%, উচ্চতা b% পরিবর্তন',  formula:'ক্ষেত্রফল → (a+b+ab/100)%',    color:'var(--mf-blue)',   bg:'rgba(91,164,245,.08)',   border:'rgba(91,164,245,.25)' },
              { shape:'আয়তক্ষেত্র — দৈর্ঘ্য a%, প্রস্থ b% পরিবর্তন', formula:'ক্ষেত্রফল → (a+b+ab/100)%', color:'var(--mf-teal)',  bg:'rgba(15,219,168,.08)',   border:'rgba(15,219,168,.25)' },
              { shape:'বর্গ — বাহু r% পরিবর্তন',                  formula:'ক্ষেত্রফল → (2r+r²/100)%  [a=b=r]', color:'var(--mf-violet)', bg:'rgba(167,139,250,.08)', border:'rgba(167,139,250,.25)' },
              { shape:'বৃত্ত — ব্যাসার্ধ r% পরিবর্তন',            formula:'ক্ষেত্রফল → (2r+r²/100)%  [a=b=r]', color:'var(--mf-gold2)',  bg:'rgba(240,165,0,.08)',    border:'rgba(240,165,0,.25)'  },
              { shape:'দাম/বেতন/আয় — পরপর দুটো পরিবর্তন',        formula:'নতুন মান → (a+b+ab/100)%',  color:'var(--text-2)',    bg:'rgba(167,139,250,.05)', border:'rgba(167,139,250,.15)' },
            ].map(r => (
              <div key={r.shape} style={{padding:'6px 10px',borderRadius:7,background:r.bg,border:`1px solid ${r.border}`}}>
                <div style={{color:r.color,fontWeight:700,marginBottom:2}}>{r.shape}</div>
                <div style={{color:'var(--text-3)',fontSize:11}}>{r.formula}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card color="teal">
          <CardTitle color="var(--mf-teal)">দাম/আয় পরিবর্তন সূত্র</CardTitle>
          <p style={{fontSize:12,color:'var(--text-3)',marginBottom:10}}>
            দাম বাড়লে কম কিনতে হয়, বা ক বেশি হলে খ তুলনায় কম — একই সূত্র, context ভিন্ন
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(240,108,126,.08)',border:'1px solid rgba(240,108,126,.25)'}}>
              <div style={{fontSize:12,color:'var(--mf-rose)',fontWeight:700,marginBottom:6}}>
                r% <strong>বাড়লে</strong> → কত% <strong>কম</strong> হবে?
              </div>
              <div style={{textAlign:'center',margin:'4px 0'}}><Tex>{"\\dfrac{100r}{100+r}\\%"}</Tex></div>
              <div style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>উদা: দাম 25% বাড়লে কিনতে হবে 100×25/125 = <strong>20% কম</strong></div>
            </div>
            <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(15,219,168,.08)',border:'1px solid rgba(15,219,168,.25)'}}>
              <div style={{fontSize:12,color:'var(--mf-teal)',fontWeight:700,marginBottom:6}}>
                r% <strong>কমলে</strong> → কত% <strong>বেশি</strong> হবে?
              </div>
              <div style={{textAlign:'center',margin:'4px 0'}}><Tex>{"\\dfrac{100r}{100-r}\\%"}</Tex></div>
              <div style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>উদা: দাম 20% কমলে কিনতে পারবে 100×20/80 = <strong>25% বেশি</strong></div>
            </div>
            <div style={{fontSize:11,color:'var(--text-3)',padding:'5px 8px',background:'rgba(167,139,250,.06)',border:'1px solid rgba(167,139,250,.15)',borderRadius:6}}>
              💡 বাড়লে → (100+r) হর-এ &nbsp;|&nbsp; কমলে → (100−r) হর-এ
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
