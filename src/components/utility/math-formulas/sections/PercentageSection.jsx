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
              { shape:'ত্রিভুজ — ভূমি a%, উচ্চতা b% পরিবর্তন',  formula:'ক্ষেত্রফল → (a+b+ab/100)%',    color:'var(--mf-blue)',   bg:'color-mix(in srgb, var(--mf-blue) 8%, transparent)',   border:'color-mix(in srgb, var(--mf-blue) 25%, transparent)' },
              { shape:'আয়তক্ষেত্র — দৈর্ঘ্য a%, প্রস্থ b% পরিবর্তন', formula:'ক্ষেত্রফল → (a+b+ab/100)%', color:'var(--mf-teal)',  bg:'color-mix(in srgb, var(--mf-teal) 8%, transparent)',   border:'color-mix(in srgb, var(--mf-teal) 25%, transparent)' },
              { shape:'বর্গ — বাহু r% পরিবর্তন',                  formula:'ক্ষেত্রফল → (2r+r²/100)%  [a=b=r]', color:'var(--mf-violet)', bg:'color-mix(in srgb, var(--mf-violet) 8%, transparent)', border:'color-mix(in srgb, var(--mf-violet) 25%, transparent)' },
              { shape:'বৃত্ত — ব্যাসার্ধ r% পরিবর্তন',            formula:'ক্ষেত্রফল → (2r+r²/100)%  [a=b=r]', color:'var(--mf-gold2)',  bg:'color-mix(in srgb, var(--mf-gold) 8%, transparent)',    border:'color-mix(in srgb, var(--mf-gold) 25%, transparent)'  },
              { shape:'দাম/বেতন/আয় — পরপর দুটো পরিবর্তন',        formula:'নতুন মান → (a+b+ab/100)%',  color:'var(--text-2)',    bg:'color-mix(in srgb, var(--mf-violet) 5%, transparent)', border:'color-mix(in srgb, var(--mf-violet) 15%, transparent)' },
            ].map(r => (
              <div key={r.shape} style={{padding:'6px 10px',borderRadius:7,background:r.bg,border:`1px solid ${r.border}`}}>
                <div style={{color:r.color,fontWeight:700,marginBottom:2}}>{r.shape}</div>
                <div className="mf-cv" style={{color:'var(--text-3)',fontSize:11}}>{r.formula}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,padding:'10px 12px',borderRadius:9,background:'color-mix(in srgb, var(--mf-gold) 9%, transparent)',border:'1px solid color-mix(in srgb, var(--mf-gold) 28%, transparent)'}}>
            <div style={{fontSize:12,color:'var(--mf-gold2)',fontWeight:700,marginBottom:6}}>
              উদা: বৃত্তের ব্যাসার্ধ (বা পরিধি) <strong>২০% কমলে</strong> ক্ষেত্রফল কত কমবে?
            </div>
            <div style={{textAlign:'center',margin:'4px 0'}}><Tex>{"-20 - 20 + \\dfrac{(-20)\\times(-20)}{100} = -40 + 4 = -36\\%"}</Tex></div>
            <div style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>
              অর্থাৎ ক্ষেত্রফল <strong>৩৬% কমবে</strong>। কমার ক্ষেত্রে a ও b দুটোই <strong>ঋণাত্মক</strong> বসাতে হয় — ব্যাসার্ধ, ব্যাস বা পরিধি যেটাই কমুক, ক্ষেত্রফলে একই হিসাব।
            </div>
          </div>
        </Card>

        <Card color="teal">
          <CardTitle color="var(--mf-teal)">দাম/আয় পরিবর্তন সূত্র</CardTitle>
          <p style={{fontSize:12,color:'var(--text-3)',marginBottom:10}}>
            দাম বাড়লে কম কিনতে হয়, বা ক বেশি হলে খ তুলনায় কম — একই সূত্র, context ভিন্ন
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <div style={{padding:'10px 12px',borderRadius:9,background:'color-mix(in srgb, var(--mf-rose) 8%, transparent)',border:'1px solid color-mix(in srgb, var(--mf-rose) 25%, transparent)'}}>
              <div style={{fontSize:12,color:'var(--mf-rose)',fontWeight:700,marginBottom:6}}>
                r% <strong>বাড়লে</strong> → কত% <strong>কম</strong> হবে?
              </div>
              <div style={{textAlign:'center',margin:'4px 0'}}><Tex>{"\\dfrac{100r}{100+r}\\%"}</Tex></div>
              <div style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>উদা: দাম 25% বাড়লে কিনতে হবে 100×25/125 = <strong>20% কম</strong></div>
            </div>
            <div style={{padding:'10px 12px',borderRadius:9,background:'color-mix(in srgb, var(--mf-teal) 8%, transparent)',border:'1px solid color-mix(in srgb, var(--mf-teal) 25%, transparent)'}}>
              <div style={{fontSize:12,color:'var(--mf-teal)',fontWeight:700,marginBottom:6}}>
                r% <strong>কমলে</strong> → কত% <strong>বেশি</strong> হবে?
              </div>
              <div style={{textAlign:'center',margin:'4px 0'}}><Tex>{"\\dfrac{100r}{100-r}\\%"}</Tex></div>
              <div style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>উদা: দাম 20% কমলে কিনতে পারবে 100×20/80 = <strong>25% বেশি</strong></div>
            </div>
            <div style={{fontSize:11,color:'var(--text-3)',padding:'5px 8px',background:'color-mix(in srgb, var(--mf-violet) 6%, transparent)',border:'1px solid color-mix(in srgb, var(--mf-violet) 15%, transparent)',borderRadius:6}}>
              💡 বাড়লে → (100+r) হর-এ &nbsp;|&nbsp; কমলে → (100−r) হর-এ
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
