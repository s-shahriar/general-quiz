import { SectionHeader, Card, CardTitle, FBox, Mem } from '../MathFormulaHelpers'

export default function PncSection() {
  return (
    <div className="mf-section" id="pnc">
      <SectionHeader icon="nPr" title="বিন্যাস ও সমাবেশ" sub="Permutation · Combination · Graph Theory" />
      <div className="mf-legend">
        <span><strong>nPr</strong> n জিনিস থেকে r নিয়ে সাজানো (Order matters)</span>
        <span><strong>nCr</strong> n জিনিস থেকে r নিয়ে বাছাই (Order doesn't matter)</span>
      </div>
      <div className="mf-grid2">
        <Card color="violet">
          <CardTitle color="var(--mf-violet)">বিন্যাস — Permutation (সাজানো)</CardTitle>
          <FBox label="nPr" tex={"= \\dfrac{n!}{(n-r)!}"}/>
          <FBox label="n বস্তু বৃত্তাকারে" val="= (n−1)!" highlight/>
          <FBox label="n ভিন্ন বস্তু গলায় (Necklace)" tex={"= \\dfrac{(n-1)!}{2}"}/>
          <Mem title="💡 বৃত্তাকার বিন্যাস">
            <p>বৃত্তে একটি ধরে রাখা যায় → বাকি (n-1)টি সাজানো হয় → (n-1)!</p>
          </Mem>
        </Card>

        <Card color="teal">
          <CardTitle color="var(--mf-teal)">সমাবেশ — Combination (বাছাই)</CardTitle>
          <FBox label="nCr" tex={"= \\dfrac{n!}{r!\\,(n-r)!}"}/>
          <FBox label="nC0 = nCn" val="= 1"/>
          <FBox label="nCr + nC(r-1)" val="= (n+1)Cr" highlight/>
          <div style={{background:'var(--elevated)',borderRadius:8,padding:12,marginTop:10,borderLeft:'3px solid #f0a500'}}>
            <div style={{color:'var(--mf-gold)',fontSize:13,fontWeight:700,marginBottom:8}}>Handshake ও Graph সমস্যা</div>
            <FBox label="n জনের Handshake" tex={"= \\dfrac{n(n-1)}{2}"}/>
            <FBox label="n জনের চিঠি (দু-দিকে)" val="= n(n−1)"/>
            <FBox label="n বাহুর বহুভুজের কর্ণ" tex={"= \\dfrac{n(n-3)}{2}"}/>
          </div>
          <Mem title="💡 Handshake vs চিঠি">
            <p>Handshake = <strong>÷2</strong> (A-B ও B-A একই)<br/>
            চিঠি = <strong>÷2 নয়</strong> (A→B ও B→A আলাদা)</p>
          </Mem>
        </Card>
      </div>
    </div>
  )
}
