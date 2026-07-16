import { Card, CardTitle, Mem, SectionHeader } from '../MathFormulaHelpers'

export default function TrigSection() {
  return (
    <div className="mf-section" id="trig">
      <SectionHeader icon="√" title="ত্রিকোণমিতি — √ কৌশল" sub="sin · cos — √0…√4 ভাগ করো 2 দিয়ে · tan — √n ভাগ করো √3 দিয়ে (n = 0, 1, 3, 9)" />

      <Card color="teal" style={{marginBottom:16}}>
        <CardTitle color="var(--mf-teal)">কৌশল: মাত্র একটি সিকোয়েন্স মনে রাখো</CardTitle>
        <div style={{display:'flex', flexWrap:'wrap', gap:12, margin:'12px 0'}}>
          <div style={{flex:1, minWidth:140, background:'rgba(15,219,168,.08)', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-teal)'}}>
            <div style={{fontWeight:700, color:'var(--mf-teal)', marginBottom:10, fontSize:13}}>sin — বাড়তি ক্রম ↑</div>
            <div style={{display:'flex', alignItems:'flex-end', gap:10, marginBottom:8}}>
              {['√0','√1','√2','√3','√4'].map((v,i) => (
                <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
                  <span style={{fontWeight:800, color:'var(--mf-teal)', fontSize:16, fontFamily:"'Space Grotesk',sans-serif"}}>{v}</span>
                  <span style={{width:'100%', height:1, background:'var(--text-dim)'}} />
                  <span style={{fontSize:12, color:'var(--text-3)', fontWeight:600}}>2</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:12, color:'var(--text-3)'}}>n = 0 → 4 &nbsp;→&nbsp; <strong style={{color:'var(--mf-teal)'}}>sin = √n / 2</strong></div>
          </div>
          <div style={{flex:1, minWidth:140, background:'rgba(91,164,245,.08)', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-blue)'}}>
            <div style={{fontWeight:700, color:'var(--mf-blue)', marginBottom:10, fontSize:13}}>cos — কমতি ক্রম ↓</div>
            <div style={{display:'flex', alignItems:'flex-end', gap:10, marginBottom:8}}>
              {['√4','√3','√2','√1','√0'].map((v,i) => (
                <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
                  <span style={{fontWeight:800, color:'var(--mf-blue)', fontSize:16, fontFamily:"'Space Grotesk',sans-serif"}}>{v}</span>
                  <span style={{width:'100%', height:1, background:'var(--text-dim)'}} />
                  <span style={{fontSize:12, color:'var(--text-3)', fontWeight:600}}>2</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:12, color:'var(--text-3)'}}>n = 4 → 0 &nbsp;→&nbsp; <strong style={{color:'var(--mf-blue)'}}>cos = √n / 2</strong></div>
          </div>
          <div style={{flex:1, minWidth:140, background:'rgba(240,108,126,.08)', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-rose)'}}>
            <div style={{fontWeight:700, color:'var(--mf-rose)', marginBottom:10, fontSize:13}}>tan — ৩ গুণ ক্রম ×3</div>
            {/* flex-start so 90°'s ∞ (no denominator) sits on the value row, not the √3 row */}
            <div style={{display:'flex', alignItems:'flex-start', gap:10, marginBottom:8}}>
              {[['0°','√0'],['30°','√1'],['45°','√3'],['60°','√9']].map(([ang,v],i) => (
                <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
                  <span style={{fontSize:10, color:'var(--text-dim)', fontWeight:600}}>{ang}</span>
                  <span style={{fontWeight:800, color:'var(--mf-rose)', fontSize:16, fontFamily:"'Space Grotesk',sans-serif"}}>{v}</span>
                  <span style={{width:'100%', height:1, background:'var(--text-dim)'}} />
                  <span style={{fontSize:12, color:'var(--text-3)', fontWeight:600}}>√3</span>
                </div>
              ))}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
                <span style={{fontSize:10, color:'var(--text-dim)', fontWeight:600}}>90°</span>
                <span style={{fontWeight:800, color:'var(--mf-rose)', fontSize:16, fontFamily:"'Space Grotesk',sans-serif"}}>∞</span>
              </div>
            </div>
            <div style={{fontSize:12, color:'var(--text-3)'}}>n = 0, 1, 3, 9 &nbsp;→&nbsp; <strong style={{color:'var(--mf-rose)'}}>tan = √n / √3</strong></div>
          </div>
        </div>
        <Mem title="💡 মনে রাখার সহজ উপায়">
          <p><strong>sin:</strong> কোণ বাড়লে n বাড়ে (0→4) → sin = √n ÷ 2</p>
          <p style={{marginTop:4}}><strong>cos:</strong> sin-এর ঠিক উল্টো ক্রম (4→0) → cos = √n ÷ 2</p>
          <p style={{marginTop:4}}><strong>tan:</strong> শর্টকাট — <strong style={{color:'var(--mf-rose)'}}>tan = √n / √3</strong>, এখানে n = 0, 1, 3, 9 (১ থেকে ৩ গুণ করে যাও: 1 → 3 → 9), আর 90° = ∞</p>
          <p style={{marginTop:4, fontSize:12, color:'var(--text-3)'}}>⚠️ tan-এর n (0, 1, 3, 9) আর sin/cos-এর n (0 → 4) — <strong>দুটো আলাদা</strong>, মিলিয়ে ফেলো না। ভুলে গেলে tan = sin θ ÷ cos θ দিয়েই বের হবে।</p>
        </Mem>
      </Card>

      <Card color="violet">
        <CardTitle color="var(--mf-violet)">দ্রুত রেফারেন্স — সম্পূর্ণ ছক</CardTitle>
        <div className="mf-table-scroll">
          <table className="mf-cmp-table" style={{minWidth:320}}>
            <thead>
              <tr><th>কোণ</th><th style={{color:'#0fdba8'}}>sin</th><th style={{color:'#5ba4f5'}}>cos</th><th style={{color:'#f06d7e'}}>tan</th></tr>
            </thead>
            <tbody>
              {[
                ['0°',  '0',    '1',      '0'],
                ['30°', '½',    '√3/2',   '1/√3'],
                ['45°', '1/√2', '1/√2',   '1'],
                ['60°', '√3/2', '½',      '√3'],
                ['90°', '1',    '0',      '∞'],
              ].map(([a,s,c,t]) => (
                <tr key={a}>
                  <td><strong style={{color:'var(--mf-gold)'}}>{a}</strong></td>
                  <td className="hl">{s}</td>
                  <td className="hl">{c}</td>
                  <td style={{color:'var(--mf-rose)', fontWeight:600}}>{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Mem title="💡 গুরুত্বপূর্ণ সম্পর্ক">
          <ul>
            <li>sin ↑ বাড়ে (0→1), cos ↓ কমে (1→0) — সবসময় উল্টো দিকে</li>
            <li>sin² θ + cos² θ = <strong>1</strong> সবসময়</li>
            <li>tan θ = sin θ ÷ cos θ</li>
            <li>tan 90° অসংজ্ঞায়িত — cos 90° = 0, শূন্য দিয়ে ভাগ হয় না</li>
          </ul>
        </Mem>
      </Card>
    </div>
  )
}
