import { Card, CardTitle, Mem, SectionHeader, StatBox } from '../MathFormulaHelpers'

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
            <tr><td>মহাকর্ণ / হেলান তলের উন্নতি</td><td className="hl">√3 · a</td><td className="hl">√(a² + b² + c²)</td></tr>
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
    </div>
  )
}
