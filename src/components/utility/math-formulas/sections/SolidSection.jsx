import { Card, CardTitle, FBox, Mem, SectionHeader, StatBox } from '../MathFormulaHelpers'

export default function SolidSection() {
  return (
    <div className="mf-section" id="solid">
      <SectionHeader icon="◧" title="ঘনক ও ঘনবস্তু" sub="Cube · Cuboid (আয়তাকার ঘনবস্তু) · 3D Properties" />
      <Card color="gold" style={{marginBottom:16}}>
        <CardTitle>ঘনকের (Cube) মূল তথ্য</CardTitle>
        <div className="mf-grid3" style={{marginBottom:10}}>
          <StatBox val="6" label="তল (Face)" color="var(--mf-gold)"/>
          <StatBox val="8" label="কৌণিক বিন্দু (Vertex)" color="var(--mf-teal)"/>
          <StatBox val="12" label="ধার (Edge)" color="var(--mf-blue)"/>
        </div>
        <FBox label={<strong>ঘনকের কর্ণ (মহাকর্ণ)</strong>} tex={"= \\sqrt{3}\\,a"} highlight/>
        <FBox label="একটি তলের কর্ণ" tex={"= \\sqrt{2}\\,a"}/>
        <p style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>
          Euler সূত্র: F + V − E = 2 → 6 + 8 − 12 = 2 ✓ &nbsp;|&nbsp; প্রতিটিতে সমকোণ = <span className="mf-fi">24টি</span>
        </p>
      </Card>
      <Card color="gold">
        <CardTitle>ঘনক vs ঘনবস্তু (আয়তাকার ঘনবস্তু) সূত্র তুলনা</CardTitle>
        <div className="mf-table-scroll"><table className="mf-cmp-table">
          <thead>
            <tr><th>বৈশিষ্ট্য</th><th>ঘনক (Cube) — বাহু a</th><th>ঘনবস্তু (Solid) / আয়তাকার ঘনবস্তু — a, b, c</th></tr>
          </thead>
          <tbody>
            <tr><td>আয়তন</td><td className="hl">a³</td><td className="hl">a × b × c</td></tr>
            <tr><td>একটি তলের ক্ষেত্রফল</td><td className="hl">a²</td><td className="hl">ab বা bc বা ca</td></tr>
            <tr><td>সমগ্র পৃষ্ঠতল</td><td className="hl">6a²</td><td className="hl">2(ab + bc + ca)</td></tr>
            <tr><td>একটি তলের কর্ণ</td><td className="hl">√2 · a</td><td className="hl">√(a²+b²) ইত্যাদি</td></tr>
            <tr><td>মহাকর্ণ (ঘনকের কর্ণ) / হেলান তলের উন্নতি</td><td className="hl">√3 · a</td><td className="hl">√(a² + b² + c²)</td></tr>
          </tbody>
        </table></div>
        <Mem title="💡 মনে রাখুন — ঘনক vs ঘনবস্তু" style={{marginTop:12}}>
          <ul>
            <li><strong>ঘনক:</strong> শুধু "a" → a³, 6a², √3·a</li>
            <li><strong>ঘনবস্তু:</strong> a, b, c → জোড়ায় গুণ (ab+bc+ca)</li>
            <li><strong>তলের কর্ণ:</strong> দুটি দিক → √(a²+b²)</li>
            <li><strong>মহাকর্ণ / হেলান তলের উন্নতি:</strong> তিনটি দিক → √(a²+b²+c²)</li>
          </ul>
        </Mem>
      </Card>

      <Card color="teal" style={{marginTop:16}}>
        <CardTitle color="var(--mf-teal)">চার দেয়ালের ক্ষেত্রফল (ঘর / কক্ষ)</CardTitle>
        <div className="mf-grid2">
          <div style={{textAlign:'center',padding:'6px 0'}}>
            <svg width="200" height="150" viewBox="0 0 200 150">
              <polygon points="30,60 130,60 130,128 30,128" fill="color-mix(in srgb, var(--mf-teal) 8%, transparent)" stroke="var(--mf-teal)" strokeWidth="2"/>
              <line x1="30" y1="60" x2="62" y2="32" stroke="var(--mf-teal)" strokeWidth="1.6"/>
              <line x1="130" y1="60" x2="162" y2="32" stroke="var(--mf-teal)" strokeWidth="1.6"/>
              <line x1="62" y1="32" x2="162" y2="32" stroke="var(--mf-teal)" strokeWidth="1.6"/>
              <line x1="162" y1="32" x2="162" y2="100" stroke="var(--mf-teal)" strokeWidth="1.6"/>
              <line x1="130" y1="128" x2="162" y2="100" stroke="var(--mf-teal)" strokeWidth="1.4" strokeDasharray="3,3" opacity="0.7"/>
              <line x1="22" y1="60" x2="22" y2="128" stroke="var(--mf-gold2)" strokeWidth="1.3"/>
              <text x="14" y="98" fill="var(--mf-gold2)" fontSize="11" fontWeight="700" transform="rotate(-90,14,98)">উচ্চতা h</text>
              <text x="52" y="144" fill="var(--mf-gold)" fontSize="11" fontWeight="700">দৈর্ঘ্য l</text>
              <text x="146" y="142" fill="var(--mf-gold)" fontSize="11" fontWeight="700">প্রস্থ b</text>
            </svg>
          </div>
          <div>
            <FBox label="চার দেয়ালের ক্ষেত্রফল" val="= 2(উচ্চতা × দৈর্ঘ্য) + 2(উচ্চতা × প্রস্থ)" highlight/>
            <FBox label="সংক্ষেপে" tex={"= 2h(l + b)"}/>
            <FBox label="ছাদ বা মেঝে যোগ করতে হলে" val="+ (দৈর্ঘ্য × প্রস্থ) — প্রতিটির জন্য একবার"/>
            <FBox label="চার দেয়াল + ছাদ + মেঝে" val="= সমগ্র পৃষ্ঠতল = 2(lb + bh + hl)"/>
          </div>
        </div>
        <Mem title="💡 উদাহরণ — দৈর্ঘ্য ৮ মি, প্রস্থ ৬ মি, উচ্চতা ৩ মি" style={{marginTop:12}}>
          <p>চার দেয়াল = 2(3 × 8) + 2(3 × 6) = 48 + 36 = <strong>84 বর্গমিটার</strong><br/>
          অথবা সরাসরি: 2h(l + b) = 2 × 3 × (8 + 6) = <strong>84 বর্গমিটার</strong></p>
          <p style={{marginTop:4}}>রং করা বা কাগজ লাগানোর হিসাবে <strong>দরজা-জানালার ক্ষেত্রফল বাদ</strong> দিতে হয়। মেঝের কথা না বললে শুধু চার দেয়ালই ধরবে।</p>
        </Mem>
      </Card>
    </div>
  )
}
