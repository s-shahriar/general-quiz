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
              <circle cx="80" cy="75" r="62" fill="color-mix(in srgb, var(--mf-blue) 6%, transparent)" stroke="var(--mf-blue)" strokeWidth="2"/>
              <line x1="80" y1="75" x2="142" y2="75" stroke="var(--mf-gold)" strokeWidth="1.5"/>
              <text x="105" y="70" fill="var(--mf-gold)" fontSize="13" fontWeight="700">r</text>
              <circle cx="80" cy="75" r="4" fill="var(--mf-gold)"/>
              <line x1="80" y1="75" x2="80" y2="13" stroke="var(--mf-teal)" strokeWidth="1.5" strokeDasharray="3,2"/>
              <line x1="80" y1="75" x2="129" y2="37" stroke="var(--mf-teal)" strokeWidth="1.5" strokeDasharray="3,2"/>
              <path d="M 80 57 A 18 18 0 0 1 94 64" fill="none" stroke="var(--mf-teal)" strokeWidth="1.5"/>
              <text x="86" y="57" fill="var(--mf-teal)" fontSize="11">2θ</text>
              <line x1="40" y1="122" x2="80" y2="13" stroke="var(--mf-violet)" strokeWidth="1.2" strokeDasharray="2,2" opacity=".7"/>
              <line x1="40" y1="122" x2="129" y2="37" stroke="var(--mf-violet)" strokeWidth="1.2" strokeDasharray="2,2" opacity=".7"/>
              <path d="M 45 109 A 14 14 0 0 0 50 112" fill="none" stroke="var(--mf-violet)" strokeWidth="1.3"/>
              <text x="26" y="118" fill="var(--mf-violet)" fontSize="11">θ</text>
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
              <polygon points="80,10 148,62 122,138 38,138 12,62" fill="color-mix(in srgb, var(--mf-gold) 7%, transparent)" stroke="var(--mf-gold)" strokeWidth="2"/>
              <path d="M 132 50 A 20 20 0 0 0 142 81" fill="none" stroke="var(--mf-gold2)" strokeWidth="1.5"/>
              <text x="119" y="70" fill="var(--mf-gold2)" fontSize="11">θ</text>
              <text x="62" y="82" fill="var(--mf-gold)" fontSize="12" fontWeight="700">n=5</text>
              <text x="12" y="148" fill="var(--text-3)" fontSize="11">(5−2)×180 = 540°</text>
            </svg>
          </div>
          <FBox label="অভ্যন্তরীণ কোণের সমষ্টি" tex={"= (n-2)\\times 180^\\circ"}/>
          <FBox label="প্রতিটি বহিঃকোণ (সুষম)" tex={"= \\dfrac{360^\\circ}{n}"} highlight/>
          <div style={{fontSize:11,color:'var(--text-3)',padding:'2px 10px 4px',marginBottom:4}}>
            অন্তঃস্থ কোণ + বহিঃস্থ কোণ = <strong>180°</strong>
          </div>
          <FBox label="n বাহুর কর্ণ সংখ্যা" tex={"= \\dfrac{n(n-3)}{2}"}/>
          <Mem title="💡 দ্রুত মনে রাখুন">
            <p>ত্রিভুজ (n=3): 180° ✓ | চতুর্ভুজ (n=4): 360° ✓<br/>
            পঞ্চভুজ (n=5): 540° | ষড়ভুজ (n=6): 720°</p>
          </Mem>
        </Card>

        <Card color="teal">
          <CardTitle color="var(--mf-teal)">বর্গের অন্তর্বৃত্ত (Circle in Square)</CardTitle>
          <div style={{textAlign:'center',margin:'10px 0'}}>
            <svg width="160" height="150" viewBox="0 0 160 150">
              <rect x="27" y="20" width="106" height="106" fill="color-mix(in srgb, var(--mf-teal) 5%, transparent)" stroke="var(--mf-teal)" strokeWidth="2"/>
              <line x1="27" y1="20" x2="133" y2="126" stroke="var(--mf-violet)" strokeWidth="1.2" strokeDasharray="2,2" opacity=".6"/>
              <line x1="133" y1="20" x2="27" y2="126" stroke="var(--mf-violet)" strokeWidth="1.2" strokeDasharray="2,2" opacity=".6"/>
              <circle cx="80" cy="73" r="53" fill="color-mix(in srgb, var(--mf-blue) 7%, transparent)" stroke="var(--mf-blue)" strokeWidth="2"/>
              <line x1="27" y1="73" x2="133" y2="73" stroke="var(--mf-gold)" strokeWidth="1.6"/>
              <circle cx="80" cy="73" r="3.5" fill="var(--mf-gold)"/>
              <text x="84" y="70" fill="var(--mf-gold)" fontSize="11" fontWeight="700">O</text>
              <text x="16" y="16" fill="var(--text-3)" fontSize="11">D</text>
              <text x="137" y="16" fill="var(--text-3)" fontSize="11">C</text>
              <text x="137" y="138" fill="var(--text-3)" fontSize="11">B</text>
              <text x="16" y="138" fill="var(--text-3)" fontSize="11">A</text>
              <text x="40" y="145" fill="var(--mf-teal)" fontSize="10" fontWeight="700">বাহু = ব্যাস (d)</text>
            </svg>
          </div>
          <FBox label="বর্গের একবাহু = বৃত্তের ব্যাস" tex={"a = d = 2r"} highlight/>
          <FBox label="বৃত্তের ব্যাসার্ধ" tex={"r = \\dfrac{a}{2}"}/>
          <FBox label="বৃত্তের ক্ষেত্রফল" tex={"= \\pi r^2 = \\dfrac{\\pi a^2}{4}"}/>
          <FBox label="ফাঁকা অংশ (বর্গ − বৃত্ত)" tex={"= a^2\\left(1-\\tfrac{\\pi}{4}\\right)\\approx 0.215\\,a^2"}/>
          <Mem title="💡 উল্টোটা গুলিয়ো না">
            <p><strong>বর্গের ভেতরে বৃত্ত</strong> (অন্তর্বৃত্ত): বাহু = ব্যাস → <strong>a = 2r</strong>।<br/>
            <strong>বৃত্তের ভেতরে বর্গ</strong> (অন্তর্লিখিত বর্গ): বর্গের <strong>কর্ণ</strong> = ব্যাস → <strong>a√2 = 2r</strong>।</p>
          </Mem>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">বৃত্তের ভেতরে আয়তক্ষেত্র (Rectangle in Circle)</CardTitle>
          <div style={{textAlign:'center',margin:'10px 0'}}>
            <svg width="160" height="150" viewBox="0 0 160 150">
              <circle cx="80" cy="75" r="62" fill="color-mix(in srgb, var(--mf-blue) 6%, transparent)" stroke="var(--mf-blue)" strokeWidth="2"/>
              <rect x="30" y="38" width="100" height="74" fill="color-mix(in srgb, var(--mf-violet) 6%, transparent)" stroke="var(--mf-violet)" strokeWidth="2"/>
              <line x1="30" y1="38" x2="130" y2="112" stroke="var(--mf-gold)" strokeWidth="1.8"/>
              <line x1="130" y1="38" x2="30" y2="112" stroke="var(--mf-teal)" strokeWidth="1.2" strokeDasharray="3,2" opacity=".6"/>
              <circle cx="80" cy="75" r="3.5" fill="var(--mf-gold)"/>
              <text x="84" y="72" fill="var(--mf-gold)" fontSize="11" fontWeight="700">O</text>
              <text x="76" y="33" fill="var(--mf-violet)" fontSize="11" fontWeight="700">l</text>
              <text x="133" y="78" fill="var(--mf-violet)" fontSize="11" fontWeight="700">b</text>
              <text x="20" y="35" fill="var(--text-3)" fontSize="11">D</text>
              <text x="133" y="35" fill="var(--text-3)" fontSize="11">C</text>
              <text x="133" y="122" fill="var(--text-3)" fontSize="11">B</text>
              <text x="20" y="122" fill="var(--text-3)" fontSize="11">A</text>
              <text x="34" y="146" fill="var(--mf-gold)" fontSize="10" fontWeight="700">কর্ণ = ব্যাস (d)</text>
            </svg>
          </div>
          <FBox label="বৃত্তের ব্যাস = আয়তের কর্ণ" tex={"d = \\sqrt{l^2 + b^2}"} highlight/>
          <FBox label="বৃত্তের ব্যাসার্ধ" tex={"r = \\dfrac{\\sqrt{l^2 + b^2}}{2}"}/>
          <FBox label="ক্ষুদ্রতম বৃত্তের ক্ষেত্রফল" tex={"= \\pi r^2 = \\dfrac{\\pi(l^2 + b^2)}{4}"}/>
          <div style={{fontSize:11,color:'var(--text-3)',padding:'4px 10px',marginBottom:4}}>
            আয়তকে পুরো ঢাকা <strong>ক্ষুদ্রতম বৃত্ত</strong> চার কোণা ছুঁয়ে যায় → ব্যাস = <strong>কর্ণ</strong>।
          </div>
          <Mem title="💡 উদাহরণ: ১৬ × ১২ আয়তক্ষেত্র">
            <p>সবচেয়ে ছোট বৃত্ত যা আয়তটিকে পুরো ঢাকে → ব্যাস = কর্ণ।<br/>
            d = √(16² + 12²) = √400 = <strong>20</strong> → r = <strong>10</strong><br/>
            ক্ষেত্রফল = π × 10² = <strong>100π</strong> বর্গফুট</p>
          </Mem>
        </Card>

        <Card color="rose">
          <CardTitle color="var(--mf-rose)">সমকোণী ত্রিভুজের অন্তর্বৃত্ত (Incircle of Right Triangle)</CardTitle>
          <div style={{textAlign:'center',margin:'10px 0'}}>
            <svg width="160" height="150" viewBox="0 0 160 150">
              <polygon points="25,30 25,120 145,120" fill="color-mix(in srgb, var(--mf-rose) 6%, transparent)" stroke="var(--mf-rose)" strokeWidth="2"/>
              <circle cx="55" cy="90" r="30" fill="color-mix(in srgb, var(--mf-blue) 7%, transparent)" stroke="var(--mf-blue)" strokeWidth="2"/>
              <path d="M 25 110 L 35 110 L 35 120" fill="none" stroke="var(--text-3)" strokeWidth="1.2"/>
              <line x1="55" y1="90" x2="55" y2="120" stroke="var(--mf-gold)" strokeWidth="1.6"/>
              <line x1="55" y1="90" x2="25" y2="90" stroke="var(--mf-teal)" strokeWidth="1.2" strokeDasharray="3,2"/>
              <line x1="55" y1="90" x2="79" y2="72" stroke="var(--mf-teal)" strokeWidth="1.2" strokeDasharray="3,2"/>
              <circle cx="55" cy="90" r="3.5" fill="var(--mf-gold)"/>
              <text x="58" y="87" fill="var(--mf-gold)" fontSize="11" fontWeight="700">I</text>
              <text x="58" y="110" fill="var(--mf-gold)" fontSize="11" fontWeight="700">r</text>
              <text x="8" y="80" fill="var(--mf-rose)" fontSize="12" fontWeight="700">b</text>
              <text x="95" y="134" fill="var(--mf-rose)" fontSize="12" fontWeight="700">a</text>
              <text x="92" y="66" fill="var(--mf-rose)" fontSize="12" fontWeight="700">c</text>
              <text x="14" y="28" fill="var(--text-3)" fontSize="11">A</text>
              <text x="12" y="134" fill="var(--text-3)" fontSize="11">C</text>
              <text x="146" y="134" fill="var(--text-3)" fontSize="11">B</text>
              <text x="40" y="148" fill="var(--mf-rose)" fontSize="10" fontWeight="700">c = অতিভুজ, ∠C = 90°</text>
            </svg>
          </div>
          <FBox label="অন্তর্বৃত্তের ব্যাসার্ধ" tex={"r = \\dfrac{a + b - c}{2}"} highlight/>
          <FBox label="বিকল্প (ক্ষেত্রফল ÷ অর্ধপরিসীমা)" tex={"r = \\dfrac{ab}{a + b + c}"}/>
          <FBox label="পরিবৃত্তের ব্যাসার্ধ (অতিভুজ = ব্যাস)" tex={"R = \\dfrac{c}{2}"}/>
          <Mem title="💡 কেন a + b − c?">
            <p>সমকোণী শীর্ষ C থেকে বৃত্তের দুই স্পর্শক-দৈর্ঘ্যই = <strong>r</strong>।<br/>
            তাই অতিভুজ c = (a − r) + (b − r) → <strong>r = (a + b − c)/2</strong><br/>
            উদাহরণ: 3-4-5 ত্রিভুজ → r = (3 + 4 − 5)/2 = <strong>1</strong></p>
          </Mem>
        </Card>

        <Card color="blue">
          <CardTitle color="var(--mf-blue)">সমবাহু ত্রিভুজের পরিবৃত্ত (Equilateral Triangle in Circle)</CardTitle>
          <div style={{textAlign:'center',margin:'10px 0'}}>
            <svg width="160" height="150" viewBox="0 0 160 150">
              <circle cx="80" cy="78" r="58" fill="color-mix(in srgb, var(--mf-blue) 6%, transparent)" stroke="var(--mf-blue)" strokeWidth="2"/>
              <polygon points="80,20 29.8,107 130.2,107" fill="color-mix(in srgb, var(--mf-gold) 6%, transparent)" stroke="var(--mf-gold)" strokeWidth="2"/>
              <line x1="80" y1="78" x2="80" y2="20" stroke="var(--mf-rose)" strokeWidth="1.8"/>
              <line x1="80" y1="78" x2="80" y2="107" stroke="var(--mf-teal)" strokeWidth="1.2" strokeDasharray="3,2"/>
              <line x1="80" y1="78" x2="29.8" y2="107" stroke="var(--mf-rose)" strokeWidth="1.2" strokeDasharray="2,2" opacity=".6"/>
              <line x1="80" y1="78" x2="130.2" y2="107" stroke="var(--mf-rose)" strokeWidth="1.2" strokeDasharray="2,2" opacity=".6"/>
              <circle cx="80" cy="78" r="3.5" fill="var(--mf-rose)"/>
              <text x="85" y="82" fill="var(--mf-rose)" fontSize="11" fontWeight="700">O</text>
              <text x="84" y="52" fill="var(--mf-rose)" fontSize="12" fontWeight="700">R</text>
              <text x="84" y="100" fill="var(--mf-teal)" fontSize="10" fontWeight="700">r</text>
              <text x="76" y="121" fill="var(--mf-gold)" fontSize="12" fontWeight="700">a</text>
              <text x="76" y="14" fill="var(--text-3)" fontSize="11">A</text>
              <text x="14" y="116" fill="var(--text-3)" fontSize="11">B</text>
              <text x="138" y="116" fill="var(--text-3)" fontSize="11">C</text>
              <text x="38" y="148" fill="var(--mf-blue)" fontSize="10" fontWeight="700">শীর্ষ তিনটি বৃত্তের উপর</text>
            </svg>
          </div>
          <FBox label="পরিবৃত্তের ব্যাসার্ধ" tex={"R = \\dfrac{a}{\\sqrt{3}}"} highlight/>
          <FBox label="ত্রিভুজের উচ্চতা" tex={"h = \\dfrac{\\sqrt{3}}{2}a"}/>
          <FBox label="কেন্দ্র O উচ্চতাকে 2 : 1 এ ভাগ করে" tex={"R = \\tfrac{2}{3}h,\\; r = \\tfrac{1}{3}h = \\dfrac{a}{2\\sqrt{3}}"}/>
          <FBox label="পরিবৃত্তের ক্ষেত্রফল" tex={"= \\pi R^2 = \\dfrac{\\pi a^2}{3}"}/>
          <Mem title="💡 মনে রাখুন: R = 2r">
            <p>সমবাহু ত্রিভুজে পরিকেন্দ্র = অন্তঃকেন্দ্র = ভরকেন্দ্র (একই বিন্দু O)।<br/>
            <strong>পরিবৃত্ত</strong> R = a/√3, <strong>অন্তর্বৃত্ত</strong> r = a/(2√3) → <strong>R = 2r</strong><br/>
            উদাহরণ: a = 6 → R = 6/√3 = <strong>2√3</strong></p>
          </Mem>
        </Card>
      </div>
    </div>
  )
}
