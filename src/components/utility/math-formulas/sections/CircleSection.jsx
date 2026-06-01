import { SectionHeader, Card, CardTitle, FBox, Mem } from '../MathFormulaHelpers'

export default function CircleSection() {
  return (
    <div className="mf-section" id="circle">
      <SectionHeader icon="○" title="বৃত্ত ও বহুভুজ" sub="Circle · Polygon" />
      <div className="mf-grid2">
        <Card color="blue">
          <CardTitle color="var(--mf-blue)">বৃত্ত (Circle)</CardTitle>
          <div style={{textAlign:'center',margin:'10px 0'}}>
            <svg width="160" height="150" viewBox="0 0 160 150">
              <circle cx="80" cy="75" r="62" fill="rgba(91,164,245,.06)" stroke="#5ba4f5" strokeWidth="2"/>
              <line x1="80" y1="75" x2="142" y2="75" stroke="#f0a500" strokeWidth="1.5"/>
              <text x="105" y="70" fill="#f0a500" fontSize="13" fontWeight="700">r</text>
              <circle cx="80" cy="75" r="4" fill="#f0a500"/>
              <line x1="80" y1="75" x2="80" y2="13" stroke="#0fdba8" strokeWidth="1.5" strokeDasharray="3,2"/>
              <line x1="80" y1="75" x2="129" y2="37" stroke="#0fdba8" strokeWidth="1.5" strokeDasharray="3,2"/>
              <path d="M 80 57 A 18 18 0 0 1 94 64" fill="none" stroke="#0fdba8" strokeWidth="1.5"/>
              <text x="86" y="57" fill="#0fdba8" fontSize="11">2θ</text>
              <line x1="40" y1="122" x2="80" y2="13" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="2,2" opacity=".7"/>
              <line x1="40" y1="122" x2="129" y2="37" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="2,2" opacity=".7"/>
              <path d="M 45 109 A 14 14 0 0 0 50 112" fill="none" stroke="#a78bfa" strokeWidth="1.3"/>
              <text x="26" y="118" fill="#a78bfa" fontSize="11">θ</text>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" tex={"= \\pi r^2"}/>
          <FBox label="পরিধি" tex={"= 2\\pi r"}/>
          <FBox label="চাপের দৈর্ঘ্য (Arc)" tex={"s = r\\theta"} highlight/>
          <div style={{fontSize:11,color:'var(--text-3)',padding:'4px 10px',marginBottom:4}}>
            ⚠ θ অবশ্যই <strong>radian</strong>-এ দিতে হবে। ডিগ্রি থাকলে: <strong>θ(rad) = θ° × π/180</strong>
          </div>
          <FBox label="কেন্দ্রীয় কোণ" val="= 2 × বৃত্তস্থ কোণ"/>
          <ul className="mf-prop-list" style={{marginTop:8}}>
            <li>একই চাপের উপর দাঁড়ানো সকল বৃত্তস্থ কোণ সমান</li>
            <li>অর্ধবৃত্তস্থ কোণ = এক সমকোণ (90°)</li>
            <li>১ মাইল = ১.৬ কিলোমিটার</li>
          </ul>
          <Mem title="💡 কেন্দ্রীয় ও বৃত্তস্থ কোণ"><p>কেন্দ্রীয় কোণ = বৃত্তস্থ কোণের <strong>দ্বিগুণ</strong>। চাপের সূত্রে θ অবশ্যই <strong>radian</strong>-এ।</p></Mem>
        </Card>

        <Card color="gold">
          <CardTitle>বহুভুজ (Polygon)</CardTitle>
          <div style={{textAlign:'center',margin:'10px 0'}}>
            <svg width="160" height="150" viewBox="0 0 160 150">
              <polygon points="80,10 148,62 122,138 38,138 12,62" fill="rgba(240,165,0,.07)" stroke="#f0a500" strokeWidth="2"/>
              <path d="M 132 50 A 20 20 0 0 0 142 81" fill="none" stroke="#ffd166" strokeWidth="1.5"/>
              <text x="119" y="70" fill="#ffd166" fontSize="11">θ</text>
              <text x="62" y="82" fill="#f0a500" fontSize="12" fontWeight="700">n=5</text>
              <text x="12" y="148" fill="#8899aa" fontSize="11">(5−2)×180 = 540°</text>
            </svg>
          </div>
          <FBox label="অভ্যন্তরীণ কোণের সমষ্টি" tex={"= (n-2)\\times 180^\\circ"}/>
          <FBox label="প্রতিটি বহিঃকোণ (সুষম)" tex={"= \\dfrac{360^\\circ}{n}"} highlight/>
          <FBox label="n বাহুর কর্ণ সংখ্যা" tex={"= \\dfrac{n(n-3)}{2}"}/>
          <Mem title="💡 দ্রুত মনে রাখুন">
            <p>ত্রিভুজ (n=3): 180° ✓ | চতুর্ভুজ (n=4): 360° ✓<br/>
            পঞ্চভুজ (n=5): 540° | ষড়ভুজ (n=6): 720°</p>
          </Mem>
        </Card>
      </div>
    </div>
  )
}
