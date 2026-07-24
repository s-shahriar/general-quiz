import { SectionHeader, Card, CardTitle, FBox, Mem } from '../MathFormulaHelpers'

export default function CurvedSection() {
  return (
    <div className="mf-section" id="curved">
      <SectionHeader icon="⬡" title="সিলিন্ডার · Cone · গোলক · অর্ধগোলক" sub="Cylinder · Cone · Sphere · Hemisphere" />
      <div className="mf-legend">
        <span><strong>CSA</strong> Curved Surface Area (শুধু বাঁকা অংশ)</span>
        <span><strong>TSA</strong> Total Surface Area (সমগ্র পৃষ্ঠ)</span>
      </div>
      <Card color="teal" style={{marginBottom:16}}>
        <CardTitle color="var(--mf-teal)">সমস্ত সূত্রের তুলনামূলক তালিকা</CardTitle>
        <div className="mf-table-scroll"><table className="mf-cmp-table">
          <thead>
            <tr><th>আকৃতি</th><th>আয়তন</th><th>বক্রপৃষ্ঠ (CSA)</th><th>সমগ্র পৃষ্ঠতল (TSA)</th><th>বিশেষ</th></tr>
          </thead>
          <tbody>
            <tr><td><strong style={{color:'var(--mf-blue)'}}>সিলিন্ডার</strong></td><td className="hl">πr²h</td><td className="hl">2πrh</td><td className="hl">2πr(r+h)</td><td>−</td></tr>
            <tr><td><strong style={{color:'var(--mf-rose)'}}>Cone</strong></td><td className="hl">⅓πr²h</td><td className="hl">πrl</td><td className="hl">πr(r+l)</td><td className="hl">l = √(h²+r²)</td></tr>
            <tr><td><strong style={{color:'var(--mf-gold)'}}>গোলক</strong></td><td className="hl">⁴⁄₃πr³</td><td>−</td><td className="hl">4πr²</td><td>−</td></tr>
            <tr><td><strong style={{color:'var(--mf-violet)'}}>অর্ধগোলক</strong></td><td className="hl">⅔πr³</td><td className="hl">2πr²</td><td className="hl">3πr²</td><td className="hl">সমগ্র = বক্র + ভূমি</td></tr>
          </tbody>
        </table></div>
      </Card>

      <div className="mf-grid3">
        <Card color="blue">
          <CardTitle color="var(--mf-blue)">সিলিন্ডার (Cylinder)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="120" height="130" viewBox="0 0 120 130">
              <ellipse cx="60" cy="28" rx="45" ry="14" fill="rgba(91,164,245,.1)" stroke="#5ba4f5" strokeWidth="2"/>
              <line x1="15" y1="28" x2="15" y2="102" stroke="#5ba4f5" strokeWidth="2"/>
              <line x1="105" y1="28" x2="105" y2="102" stroke="#5ba4f5" strokeWidth="2"/>
              <ellipse cx="60" cy="102" rx="45" ry="14" fill="rgba(91,164,245,.1)" stroke="#5ba4f5" strokeWidth="2"/>
              <line x1="60" y1="28" x2="105" y2="28" stroke="#f0a500" strokeWidth="1.5"/>
              <text x="78" y="24" fill="#f0a500" fontSize="12" fontWeight="700">r</text>
              <line x1="8" y1="28" x2="8" y2="102" stroke="#ffd166" strokeWidth="1.5"/>
              <text x="1" y="68" fill="#ffd166" fontSize="12" fontWeight="700">h</text>
            </svg>
          </div>
          <FBox label="আয়তন" tex={"= \\pi r^2 h"}/>
          <FBox label="বক্রপৃষ্ঠ (CSA)" tex={"= 2\\pi rh"}/>
          <FBox label="সমগ্র পৃষ্ঠ (TSA)" tex={"= 2\\pi r(r+h)"} highlight/>
        </Card>

        <Card color="rose">
          <CardTitle>Cone</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="120" height="130" viewBox="0 0 120 130">
              <line x1="60" y1="10" x2="15" y2="110" stroke="#f06d7e" strokeWidth="2"/>
              <line x1="60" y1="10" x2="105" y2="110" stroke="#f06d7e" strokeWidth="2"/>
              <ellipse cx="60" cy="110" rx="45" ry="13" fill="rgba(240,108,126,.08)" stroke="#f06d7e" strokeWidth="2"/>
              <line x1="60" y1="10" x2="60" y2="110" stroke="#f0a500" strokeWidth="1.5" strokeDasharray="4,2"/>
              <rect x="55" y="100" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <text x="83" y="62" fill="#0fdba8" fontSize="12" fontWeight="700">l</text>
              <text x="63" y="60" fill="#f0a500" fontSize="12" fontWeight="700">h</text>
              <text x="78" y="108" fill="#f06d7e" fontSize="12" fontWeight="700">r</text>
            </svg>
          </div>
          <FBox label="আয়তন" tex={"= \\dfrac{1}{3}\\pi r^2 h"}/>
          <FBox label="তির্যক উচ্চতা l" tex={"= \\sqrt{h^2+r^2}"}/>
          <FBox label="বক্রপৃষ্ঠ (CSA)" tex={"= \\pi rl"}/>
          <FBox label="সমগ্র পৃষ্ঠ (TSA)" tex={"= \\pi r(r+l)"} highlight/>
          <Mem title="💡"><p>Cone = সিলিন্ডারের <strong>⅓</strong> আয়তন (একই r, h হলে)</p></Mem>
        </Card>

        <Card color="gold">
          <CardTitle>গোলক ও অর্ধগোলক (Sphere & Hemisphere)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="140" height="130" viewBox="0 0 140 130">
              <circle cx="38" cy="60" r="32" fill="rgba(240,165,0,.07)" stroke="#f0a500" strokeWidth="2"/>
              <ellipse cx="38" cy="60" rx="32" ry="10" fill="none" stroke="#f0a500" strokeWidth="1" strokeDasharray="3,2" opacity=".5"/>
              <line x1="38" y1="60" x2="70" y2="60" stroke="#ffd166" strokeWidth="1.5"/>
              <text x="50" y="57" fill="#ffd166" fontSize="12" fontWeight="700">r</text>
              <text x="18" y="105" fill="#f0a500" fontSize="11">গোলক</text>
              <path d="M 95 65 A 35 35 0 0 1 130 65" fill="rgba(167,139,250,.07)" stroke="#a78bfa" strokeWidth="2"/>
              <line x1="95" y1="65" x2="130" y2="65" stroke="#a78bfa" strokeWidth="2"/>
              <ellipse cx="112.5" cy="65" rx="17.5" ry="6" fill="rgba(167,139,250,.1)" stroke="#a78bfa" strokeWidth="1.5"/>
              <line x1="112.5" y1="65" x2="130" y2="65" stroke="#ffd166" strokeWidth="1.5"/>
              <text x="119" y="60" fill="#ffd166" fontSize="12" fontWeight="700">r</text>
              <text x="95" y="85" fill="#a78bfa" fontSize="11">অর্ধগোলক</text>
            </svg>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:13,marginTop:5}}>
            <div style={{background:'var(--elevated)',borderRadius:8,padding:10,borderLeft:'3px solid #f0a500'}}>
              <div style={{color:'var(--mf-gold)',fontWeight:700,marginBottom:6}}>গোলক</div>
              <div style={{color:'var(--text-2)',marginBottom:3}}>আয়তন = <span className="mf-fi">⁴⁄₃πr³</span></div>
              <div style={{color:'var(--text-2)'}}>পৃষ্ঠতল = <span className="mf-fi">4πr²</span></div>
            </div>
            <div style={{background:'var(--elevated)',borderRadius:8,padding:10,borderLeft:'3px solid #a78bfa'}}>
              <div style={{color:'var(--mf-violet)',fontWeight:700,marginBottom:6}}>অর্ধগোলক</div>
              <div style={{color:'var(--text-2)',marginBottom:3}}>আয়তন = <span className="mf-fi">⅔πr³</span></div>
              <div style={{color:'var(--text-2)',marginBottom:3}}>বক্রপৃষ্ঠ = <span className="mf-fi">2πr²</span></div>
              <div style={{color:'var(--text-2)'}}>সমগ্র = <span className="mf-fi">3πr²</span></div>
            </div>
          </div>
          <Mem title="💡 সহজ সম্পর্ক" style={{marginTop:10}}>
            <ul>
              <li>অর্ধগোলকের আয়তন = গোলকের <strong>অর্ধেক</strong></li>
              <li>অর্ধগোলকের বক্রপৃষ্ঠ = গোলকের পৃষ্ঠতলের <strong>অর্ধেক</strong></li>
              <li>সমগ্র পৃষ্ঠ = 2πr² + πr² = <strong>3πr²</strong></li>
            </ul>
          </Mem>
        </Card>
      </div>

      <Card color="gold" style={{marginTop:16}}>
        <CardTitle>একক রূপান্তর</CardTitle>
        <div className="mf-grid3">
          <FBox label="1 m³" val="= 1000 লিটার"/>
          <FBox label="1 লিটার" val="= 1000 cm³"/>
          <FBox label="1 হেক্টর" val="= 10,000 m²"/>
        </div>
      </Card>
      <Mem title="💡 আয়তন মনে রাখার ট্রিক" style={{marginTop:12}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, margin:'10px 0'}}>
          <div style={{background:'linear-gradient(135deg,#f0a500 0%,#ffd166 100%)', borderRadius:10, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px rgba(240,165,0,.35)'}}>
            <div style={{fontSize:10, fontWeight:600, color:'#7a4800', marginBottom:4, letterSpacing:.5}}>সিলিন্ডার</div>
            <div style={{fontSize:17, fontWeight:800, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,.2)'}}>πr²h</div>
            <div style={{fontSize:10, color:'rgba(255,255,255,.85)', marginTop:4, fontWeight:600}}>× 1 (পূর্ণ)</div>
          </div>
          <div style={{background:'linear-gradient(135deg,#f06d7e 0%,#ff9eb5 100%)', borderRadius:10, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px rgba(240,108,126,.35)'}}>
            <div style={{fontSize:10, fontWeight:600, color:'#7a1a2a', marginBottom:4, letterSpacing:.5}}>Cone</div>
            <div style={{fontSize:17, fontWeight:800, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,.2)'}}>⅓πr²h</div>
            <div style={{fontSize:10, color:'rgba(255,255,255,.85)', marginTop:4, fontWeight:600}}>× ⅓</div>
          </div>
          <div style={{background:'linear-gradient(135deg,#0fdba8 0%,#6ef7d8 100%)', borderRadius:10, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px rgba(15,219,168,.35)'}}>
            <div style={{fontSize:10, fontWeight:600, color:'#005c47', marginBottom:4, letterSpacing:.5}}>গোলক</div>
            <div style={{fontSize:17, fontWeight:800, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,.2)'}}>⁴⁄₃πr³</div>
            <div style={{fontSize:10, color:'rgba(255,255,255,.85)', marginTop:4, fontWeight:600}}>r³ ভিত্তিক</div>
          </div>
          <div style={{background:'linear-gradient(135deg,#a78bfa 0%,#c4b5fd 100%)', borderRadius:10, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px rgba(167,139,250,.35)'}}>
            <div style={{fontSize:10, fontWeight:600, color:'#3b1a8a', marginBottom:4, letterSpacing:.5}}>অর্ধগোলক</div>
            <div style={{fontSize:17, fontWeight:800, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,.2)'}}>⅔πr³</div>
            <div style={{fontSize:10, color:'rgba(255,255,255,.85)', marginTop:4, fontWeight:600}}>গোলকের ½</div>
          </div>
        </div>
        <p style={{fontSize:11, color:'var(--text-3)', marginTop:6, fontStyle:'italic', textAlign:'center'}}>"সিলিন্ডার পূর্ণ → Cone তার ⅓ → গোলকে ৪/৩ → অর্ধে ২/৩"</p>
      </Mem>
    </div>
  )
}
