import { SectionHeader, Card, CardTitle, FBox, Mem } from '../MathFormulaHelpers'

// One "question type" panel: what the question looks like, the steps, the answer.
function TypeBlock({ accent, title, question, steps, children, span }) {
  return (
    <div style={{
      background:'var(--elevated)', border:'1px solid var(--border)', borderLeft:`3px solid ${accent}`,
      borderRadius:10, padding:'12px 14px', gridColumn: span ? '1 / -1' : undefined,
    }}>
      <div style={{fontSize:13,fontWeight:700,color:'var(--text-2)',marginBottom:4}}>{title}</div>
      <div style={{fontSize:12,color:'var(--text-3)',marginBottom:8,lineHeight:1.6}}>{question}</div>
      <div style={{fontSize:12.5,color:'var(--text-2)',lineHeight:1.9,marginBottom:6}}>
        {steps.map((st, i) => (
          <div key={i}><strong style={{color:accent}}>{['১','২','৩'][i]}.</strong> {st}</div>
        ))}
      </div>
      {children}
    </div>
  )
}

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
          <CardTitle color="var(--mf-violet)">কখন বিন্যাস? (সাজানো)</CardTitle>
          <ul className="mf-prop-list">
            <li><strong>সাজানোর</strong> সংখ্যা নির্ণয়</li>
            <li><strong>শব্দ</strong> গঠন</li>
            <li><strong>সংখ্যা</strong> গঠন</li>
            <li>বিন্যাস সংখ্যা নির্ণয়</li>
            <li><strong>ক্রমানুসারে</strong> কোন কিছু</li>
          </ul>
        </Card>

        <Card color="teal">
          <CardTitle color="var(--mf-teal)">কখন সমাবেশ? (বাছাই)</CardTitle>
          <ul className="mf-prop-list">
            <li><strong>বাছাই</strong> সংখ্যা নির্ণয়</li>
            <li><strong>দল, কমিটি, টিম</strong> গঠন</li>
            <li><strong>ত্রিভুজ, বাহু, কর্ণ, রেখা</strong> ইত্যাদি</li>
            <li>সমাবেশ সংখ্যা নির্ণয়</li>
          </ul>
        </Card>
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
          <div style={{background:'var(--elevated)',borderRadius:8,padding:12,marginTop:10,borderLeft:'3px solid var(--mf-gold)'}}>
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

      <Card color="gold" style={{marginTop:16}}>
        <CardTitle>প্রশ্নের ধরন ও সমাধানের কৌশল</CardTitle>
        <p style={{fontSize:12.5,color:'var(--text-3)',margin:'2px 0 12px',lineHeight:1.7}}>
          বিন্যাসের প্রশ্ন ঘুরেফিরে এই পাঁচ ধরনেই আসে। ধরনটা চিনতে পারলে সূত্র বসানোই বাকি —
          <strong> “পাশাপাশি নয়” মানে মোট থেকে “পাশাপাশি” বাদ</strong>।
        </p>
        <div className="mf-grid2">

          <TypeBlock
            accent="var(--mf-violet)"
            title="Type 1 — নির্দিষ্ট অক্ষরগুলো পাশাপাশি নয়"
            question={<>উদা: <strong>TRIANGLE</strong> শব্দের অক্ষরগুলো কত ভাবে সাজানো যায়, যাতে স্বরবর্ণ (A, I, E) কখনো পাশাপাশি না থাকে?</>}
            steps={[
              <>মোট বিন্যাস = <strong>8!</strong> (৮টি ভিন্ন অক্ষর)</>,
              <>তিন স্বরবর্ণকে <strong>একসাথে</strong> ধরলে একক দাঁড়ায় ৬টি → <strong>6!</strong></>,
              <>ঐ তিন স্বরবর্ণ নিজেদের মধ্যে সাজে <strong>3!</strong> ভাবে</>,
            ]}
          >
            <FBox label="উত্তর = মোট − (একসাথে)" tex={"= 8! - (6! \\times 3!) = 36000"} highlight/>
          </TypeBlock>

          <TypeBlock
            accent="var(--mf-teal)"
            title="Type 2 — একই অক্ষর একাধিকবার, তবু পাশাপাশি নয়"
            question={<>উদা: <strong>ARRANGE</strong> শব্দটি কত ভাবে সাজানো যায়, যাতে দুটি <strong>R</strong> পাশাপাশি না থাকে? (A দুবার, R দুবার)</>}
            steps={[
              <>মোট বিন্যাস = <strong>7! ÷ (2! × 2!)</strong> = 1260</>,
              <>দুই R একসাথে ধরলে একক ৬টি, তাতে A দুবার → <strong>6! ÷ 2!</strong> = 360</>,
              <>R দুটি অভিন্ন, তাই নিজেদের মধ্যে <strong>2! ÷ 2! = 1</strong></>,
            ]}
          >
            <FBox label="উত্তর" tex={"= \\dfrac{7!}{2!\\,2!} - \\dfrac{6!}{2!} = 1260 - 360 = 900"} highlight/>
            <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:6,lineHeight:1.6}}>
              সদৃশ প্রশ্ন: ৭টি <strong>ভিন্ন</strong> বই সাজাতে হবে, দুটি নির্দিষ্ট বই পাশাপাশি নয় → 7! − (6! × 2!) = <strong>3600</strong>
            </div>
          </TypeBlock>

          <TypeBlock
            accent="var(--mf-blue)"
            title="Type 3 — স্বরবর্ণ নির্দিষ্ট স্থানে বসবে"
            question={<>উদা: <strong>ARTICLE</strong> শব্দের স্বরবর্ণগুলো <strong>বিজোড় স্থানে</strong> রেখে কত ভাবে সাজানো যায়?</>}
            steps={[
              <>স্বরবর্ণ A, I, E = ৩টি; ব্যঞ্জনবর্ণ R, T, C, L = ৪টি</>,
              <>বিজোড় স্থান ১, ৩, ৫, ৭ = ৪টি → ৪ স্থানে ৩ স্বরবর্ণ = <strong>⁴P₃</strong></>,
              <>বাকি ৪ স্থানে ৪ ব্যঞ্জনবর্ণ = <strong>⁴P₄</strong></>,
            ]}
          >
            <FBox label="উত্তর" tex={"= {}^4P_3 \\times {}^4P_4 = 24 \\times 24 = 576"} highlight/>
            <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:6,lineHeight:1.6}}>
              স্বরবর্ণ ৩টি হলেও বিজোড় স্থান ৪টি — তাই একটি বিজোড় স্থান খালি থেকে যায়, সেটি ব্যঞ্জনবর্ণই পায়।
            </div>
          </TypeBlock>

          <TypeBlock
            accent="var(--mf-rose)"
            title="Type 4 — অঙ্ক দিয়ে সংখ্যা গঠন (শর্তসহ)"
            question={<>প্রথম অঙ্কে সব অঙ্ক বসে না — ০ বসতে পারে না, বা সংখ্যাটিকে নির্দিষ্ট মানের চেয়ে বড় হতে হয়।</>}
            steps={[
              <>আগে ধরে নাও সব অঙ্কই প্রথমে বসতে পারে → <strong>মোট বিন্যাস</strong></>,
              <>প্রথম স্থানে <strong>শর্ত পূরণ করে</strong> এমন কয়টি অঙ্ক বসে — সেই ভগ্নাংশ দিয়ে গুণ করো</>,
              <>সংখ্যার অঙ্কসংখ্যা একাধিক হলে প্রতিটির জন্য আলাদা হিসাব করে <strong>যোগ</strong> করো</>,
            ]}
            span
          >
            <FBox label="মূল কৌশল" val="= মোট বিন্যাস × (শর্ত পূরণ করে এমন অঙ্ক সংখ্যা ÷ মোট অঙ্ক সংখ্যা)" highlight/>
            <div className="mf-grid2" style={{marginTop:8,gap:8}}>
              <FBox label="0,3,4,5,6 দিয়ে ৩ অঙ্কের সংখ্যা (০ প্রথমে নয়)" tex={"= {}^5P_3 \\times \\tfrac{4}{5} = 48"}/>
              <FBox label="3,5,7,8,9 দিয়ে ৭০০০-এর বড় ৪ অঙ্কের সংখ্যা" tex={"= {}^5P_4 \\times \\tfrac{3}{5} = 72"}/>
              <div style={{gridColumn:'1 / -1',border:'1px solid var(--border)',borderRadius:10,padding:'10px 12px'}}>
                <div style={{fontSize:12.5,fontWeight:700,color:'var(--text-2)',marginBottom:2}}>
                  0,3,5,6,8 দিয়ে ৫০০০-এর বড় কতগুলো সংখ্যা গঠন করা যায়?
                </div>
                <div style={{fontSize:11.5,color:'var(--text-3)',marginBottom:7,lineHeight:1.6}}>
                  এক প্রশ্ন, দুই অংশ — ৫০০০-এর বড় হতে পারে ৪ অঙ্কেরও, আবার ৫ অঙ্কেরও। দুটো আলাদা হিসাব করে <strong>যোগ</strong>।
                </div>
                <div className="mf-grid3" style={{gap:8}}>
                  <FBox label="৪ অঙ্কের (প্রথমে 5, 6, 8)" tex={"= {}^5P_4 \\times \\tfrac{3}{5} = 72"}/>
                  <FBox label="৫ অঙ্কের (প্রথমে ০ নয়)" tex={"= {}^5P_5 \\times \\tfrac{4}{5} = 96"}/>
                  <FBox label="মোট" val="= 72 + 96 = 168" highlight/>
                </div>
              </div>
            </div>
            <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:6,lineHeight:1.6}}>
              ৭০০০-এর বড় হতে প্রথমে বসতে পারে 7, 8, 9 → ৫টি অঙ্কের মধ্যে ৩টি শর্ত পূরণ করে, তাই <strong>3/5</strong>।
            </div>
          </TypeBlock>

          <TypeBlock
            accent="var(--mf-gold)"
            title="Type 5 — সমান ভাগে ভাগ করা"
            question={<>উদা: <strong>৯ জন</strong> লোককে <strong>৩ জনের ৩ দলে</strong> ভাগ করা যায় কত ভাবে?</>}
            steps={[
              <>প্রথমে ভাগ করো: <strong>9! ÷ (3! × 3! × 3!)</strong> = 1680</>,
              <>দলগুলোর আলাদা নাম/পরিচয় <strong>না থাকলে</strong> দলের ক্রম গোনা যাবে না → <strong>÷ 3!</strong></>,
              <>দল আলাদা করে চিহ্নিত (দল ক, খ, গ) হলে ভাগ করার দরকার নেই</>,
            ]}
            span
          >
            <div className="mf-grid2" style={{gap:8}}>
              <FBox label="দল অভিন্ন (নাম নেই)" tex={"= \\dfrac{9!}{3!\\,3!\\,3!} \\div 3! = 280"} highlight/>
              <FBox label="দল আলাদা করে চিহ্নিত" tex={"= \\dfrac{9!}{3!\\,3!\\,3!} = 1680"}/>
            </div>
            <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:6,lineHeight:1.6}}>
              সাধারণ নিয়ম: n জনকে <strong>সমান r দলে</strong> ভাগ করলে শেষে <strong>÷ r!</strong> করতে হয় — দল বদলালেও ভাগটা একই থাকে বলে।
            </div>
          </TypeBlock>

        </div>
      </Card>
    </div>
  )
}
