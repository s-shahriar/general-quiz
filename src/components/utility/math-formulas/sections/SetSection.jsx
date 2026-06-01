import { SectionHeader, Card, CardTitle, FBox, Mem } from '../MathFormulaHelpers'

export default function SetSection() {
  return (
    <div className="mf-section" id="set">
      <SectionHeader icon="∩" title="সেট তত্ত্ব ও সম্ভাবনা" sub="Set Theory · Probability" />

      <Card color="violet" style={{marginBottom:16}}>
        <CardTitle color="var(--mf-violet)">ভেন চিত্র — অঞ্চল বোঝার সহজ উপায়</CardTitle>
        <div style={{display:'flex', flexWrap:'wrap', gap:20, alignItems:'center', justifyContent:'center', margin:'10px 0'}}>
          <svg width="220" height="150" viewBox="0 0 220 150">
            <rect x="5" y="10" width="210" height="130" rx="8" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
            <text x="205" y="24" textAnchor="end" fill="#a78bfa" fontSize="12" fontWeight="700">U</text>
            <ellipse cx="85" cy="75" rx="52" ry="45" fill="rgba(91,164,245,.12)" stroke="#5ba4f5" strokeWidth="2"/>
            <ellipse cx="135" cy="75" rx="52" ry="45" fill="rgba(15,219,168,.12)" stroke="#0fdba8" strokeWidth="2"/>
            <text x="48" y="30" fill="#5ba4f5" fontSize="13" fontWeight="700">A</text>
            <text x="166" y="30" fill="#0fdba8" fontSize="13" fontWeight="700">B</text>
            <text x="68" y="80" textAnchor="middle" fill="#5ba4f5" fontSize="16" fontWeight="800">1</text>
            <text x="110" y="80" textAnchor="middle" fill="#a78bfa" fontSize="16" fontWeight="800">2</text>
            <text x="152" y="80" textAnchor="middle" fill="#0fdba8" fontSize="16" fontWeight="800">3</text>
            <text x="195" y="120" textAnchor="middle" fill="#f0a500" fontSize="16" fontWeight="800">4</text>
            <text x="110" y="128" textAnchor="middle" fill="#a78bfa" fontSize="10">A∩B</text>
          </svg>

          <div style={{fontSize:13, lineHeight:2}}>
            <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(91,164,245,.2)',border:'1.5px solid #5ba4f5',textAlign:'center',fontWeight:700,color:'#5ba4f5',fontSize:12,lineHeight:'20px',marginRight:8}}>1</span><strong>শুধু A</strong> — A-তে আছে, B-তে নেই</div>
            <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(167,139,250,.2)',border:'1.5px solid #a78bfa',textAlign:'center',fontWeight:700,color:'#a78bfa',fontSize:12,lineHeight:'20px',marginRight:8}}>2</span><strong>A∩B (ছেদ)</strong> — উভয়তে আছে</div>
            <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(15,219,168,.2)',border:'1.5px solid #0fdba8',textAlign:'center',fontWeight:700,color:'#0fdba8',fontSize:12,lineHeight:'20px',marginRight:8}}>3</span><strong>শুধু B</strong> — B-তে আছে, A-তে নেই</div>
            <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(240,165,0,.15)',border:'1.5px solid #f0a500',textAlign:'center',fontWeight:700,color:'#f0a500',fontSize:12,lineHeight:'20px',marginRight:8}}>4</span><strong>(A∪B)' বাইরে</strong> — কোনোটিতেই নেই</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:8, marginTop:8}}>
          {[
            {label:'A∪B (যেকোনো একটি)', val:'= 1 + 2 + 3', color:'var(--mf-blue)'},
            {label:'A∩B (উভয়ই)', val:'= 2', color:'var(--mf-violet)'},
            {label:'শুধু A', val:'= 1', color:'var(--mf-blue)'},
            {label:'শুধু B', val:'= 3', color:'var(--mf-teal)'},
            {label:"(A∪B)' (বাইরে)", val:'= 4', color:'var(--mf-gold)'},
          ].map(r => (
            <div key={r.label} className="mf-set-box" style={{borderLeft:`3px solid ${r.color}`}}>
              <div className="mf-set-box-label">{r.label}</div>
              <div className="mf-set-box-val" style={{color:r.color}}>{r.val}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))',gap:12}}>
        <Card color="gold">
          <CardTitle>সেট তত্ত্ব (Set Theory)</CardTitle>
          <FBox label="n(A∪B)" val="= n(A) + n(B) − n(A∩B)"/>
          <FBox label="n(A∪B∪C)" val="= n(A)+n(B)+n(C) − n(A∩B) − n(B∩C) − n(A∩C) + n(A∩B∩C)"/>
          <FBox label="প্রকৃত উপসেট" tex={"= 2^n - 1"}/>
          <FBox label="শক্তি সেট P(A)" tex={"= 2^n"} highlight/>
          <div style={{background:'var(--elevated)',borderRadius:8,padding:10,marginTop:8}}>
            <div style={{fontSize:13,color:'var(--mf-gold)',marginBottom:6,fontWeight:700}}>De Morgan's Law</div>
            <FBox label="(A∪B)' =" val="A' ∩ B'"/>
            <FBox label="(A∩B)' =" val="A' ∪ B'" highlight/>
          </div>
          <Mem title="💡 উপসেট ও শক্তি সেট">
            <p>n সদস্যের সেটের উপসেট = <strong>2ⁿ</strong>, প্রকৃত উপসেট = <strong>2ⁿ − 1</strong></p>
            <p>{'A={a,b} → n=2 → উপসেট: {},{a},{b},{a,b} = ৪টি'}</p>
          </Mem>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">সম্ভাবনা (Probability)</CardTitle>
          <div className="mf-prob-item"><div className="cond">A ও B স্বাধীন (Independent)</div><div className="form">P(A∩B) = P(A) · P(B)</div></div>
          <div className="mf-prob-item"><div className="cond">A ও B বর্জনশীল (Mutually Exclusive)</div><div className="form">P(A∪B) = P(A) + P(B)</div></div>
          <div className="mf-prob-item"><div className="cond">A ও B সাধারণ ঘটনা</div><div className="form">P(A∪B) = P(A) + P(B) − P(A∩B)</div></div>
          <div className="mf-prob-item"><div className="cond">শর্তাধীন — A ঘটলে B এর সম্ভাবনা</div><div className="form">P(B|A) = P(A∩B) / P(A)</div></div>
          <div className="mf-prob-item"><div className="cond">A না ঘটার সম্ভাবনা</div><div className="form">P(A') = 1 − P(A)</div></div>
          <div className="mf-prob-item"><div className="cond">P(A'∩B')</div><div className="form">= P((A∪B)') = 1 − P(A∪B)</div></div>
          <div className="mf-prob-item"><div className="cond">P(A'∪B')</div><div className="form">= P((A∩B)') = 1 − P(A∩B)</div></div>
          <Mem title="💡 মনে রাখুন">
            <ul>
              <li><strong>স্বাধীন:</strong> গুণ (P·P) &nbsp;|&nbsp; <strong>বর্জনশীল:</strong> যোগ</li>
              <li>P(A) + P(A') = <strong>1</strong> সবসময়</li>
              <li>0 ≤ P(A) ≤ 1 সবসময়</li>
            </ul>
          </Mem>
        </Card>

        <Card color="rose">
          <CardTitle color="var(--mf-rose)">ব্যবহারিক সমস্যা — ভেন চিত্র দিয়ে মোট নির্ণয়</CardTitle>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <svg width="100%" height="110" viewBox="0 0 190 130">
              <rect x="4" y="4" width="182" height="122" rx="8" fill="none" stroke="#f06d7e" strokeWidth="1.5"/>
              <text x="178" y="18" textAnchor="end" fill="#f06d7e" fontSize="11" fontWeight="700">U</text>
              <ellipse cx="72" cy="65" rx="48" ry="42" fill="rgba(91,164,245,.12)" stroke="#5ba4f5" strokeWidth="2"/>
              <ellipse cx="118" cy="65" rx="48" ry="42" fill="rgba(15,219,168,.12)" stroke="#0fdba8" strokeWidth="2"/>
              <text x="48" y="22" fill="#5ba4f5" fontSize="12" fontWeight="700">A</text>
              <text x="138" y="22" fill="#0fdba8" fontSize="12" fontWeight="700">B</text>
              <text x="55" y="70" textAnchor="middle" fill="#5ba4f5" fontSize="13" fontWeight="800">A−x</text>
              <text x="95" y="70" textAnchor="middle" fill="#a78bfa" fontSize="13" fontWeight="800">x</text>
              <text x="135" y="70" textAnchor="middle" fill="#0fdba8" fontSize="13" fontWeight="800">B−x</text>
              <text x="168" y="115" textAnchor="middle" fill="#f06d7e" fontSize="13" fontWeight="800">c</text>
            </svg>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {[
                {label:'শুধু A',  val:'A − x', color:'var(--mf-blue)',   bg:'rgba(91,164,245,.08)'},
                {label:'শুধু B',  val:'B − x', color:'var(--mf-teal)',   bg:'rgba(15,219,168,.08)'},
                {label:'A∩B',    val:'x',     color:'var(--mf-violet)', bg:'rgba(167,139,250,.08)'},
                {label:'বাইরে',   val:'c',     color:'var(--mf-rose)',   bg:'rgba(240,108,126,.08)'},
              ].map(r => (
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'4px 8px',borderRadius:6,background:r.bg,borderLeft:`3px solid ${r.color}`}}>
                  <span style={{fontSize:12,color:'var(--text-2)'}}>{r.label}</span>
                  <strong style={{fontSize:12,color:r.color}}>{r.val}</strong>
                </div>
              ))}
              <div style={{marginTop:2,padding:'4px 8px',borderRadius:6,background:'rgba(240,108,126,.08)',border:'1px solid rgba(240,108,126,.25)',fontSize:12}}>
                <span style={{color:'var(--text-3)'}}>N = </span>
                <strong style={{color:'var(--mf-rose)'}}>(A−x)+x+(B−x)+c</strong>
                <span style={{color:'var(--text-3)'}}> = A+B−x+c</span>
              </div>
              <div style={{padding:'4px 8px',borderRadius:6,background:'rgba(167,139,250,.08)',border:'1px solid rgba(167,139,250,.2)',fontSize:12}}>
                <div style={{color:'var(--text-3)'}}>উদা: N=100, A=60, B=50, x=20</div>
                <strong style={{color:'var(--mf-violet)'}}>→ c = 100−60−50+20 = 10</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
