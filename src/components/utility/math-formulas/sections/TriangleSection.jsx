import { Card, CardTitle, FBox, Mem, SectionHeader } from '../MathFormulaHelpers'

export default function TriangleSection() {
  return (
    <div className="mf-section" id="triangle">
      <SectionHeader icon="△" title="ত্রিভুজ — প্রকার, সর্বসমতা ও ক্ষেত্রফল" sub="Triangles · Congruence · Area Formulas" />

      <div className="mf-grid2" style={{marginBottom:16}}>
      <Card color="teal">
        <CardTitle color="var(--mf-teal)">ত্রিভুজের মূল ধর্মসমূহ</CardTitle>
        <ul className="mf-prop-list">
          <li>তিনটি অভ্যন্তরীণ কোণের সমষ্টি = <span className="mf-fi">180°</span></li>
          <li>বহিঃস্থ কোণ = অপর দুটি অন্তঃস্থ কোণের সমষ্টি</li>
          <li>যেকোনো দুই বাহুর যোগফল &gt; তৃতীয় বাহু</li>
          <li>পরিসীমা = <strong>তিন বাহুর সমষ্টি</strong> = <span className="mf-fi">a + b + c</span></li>
          <li>কোণের সমদ্বিখণ্ডক বিপরীত বাহুকে পার্শ্ববর্তী দুই বাহুর অনুপাতে বিভক্ত করে (BD/DC = AB/AC)</li>
          <li>একটি কোণ বাহির হলে অপর দুটি কোণের সমষ্টির সমান হয়</li>
        </ul>
      </Card>

      <Card color="violet">
        <CardTitle color="var(--mf-violet)">কোণের সম্পর্ক — সন্নিহিত, পূরক, সম্পূরক</CardTitle>
        <div style={{textAlign:'center',margin:'6px 0 10px'}}>
          <svg width="200" height="122" viewBox="0 0 200 122">
            <line x1="18" y1="88" x2="182" y2="88" stroke="var(--mf-violet)" strokeWidth="2"/>
            <line x1="100" y1="88" x2="152" y2="26" stroke="var(--mf-violet)" strokeWidth="2"/>
            <path d="M 66 88 A 34 34 0 0 1 122 62" fill="none" stroke="var(--mf-gold)" strokeWidth="1.6"/>
            <path d="M 122 88 A 22 22 0 0 0 114 71" fill="none" stroke="var(--mf-teal)" strokeWidth="1.6"/>
            <circle cx="100" cy="88" r="3.5" fill="var(--mf-gold2)"/>
            <text x="82" y="54" fill="var(--mf-gold)" fontSize="12" fontWeight="700">x°</text>
            <text x="130" y="82" fill="var(--mf-teal)" fontSize="12" fontWeight="700">y°</text>
            <text x="10" y="102" fill="var(--text-3)" fontSize="11">A</text>
            <text x="176" y="102" fill="var(--text-3)" fontSize="11">B</text>
            <text x="157" y="24" fill="var(--text-3)" fontSize="11">C</text>
            <text x="93" y="104" fill="var(--mf-gold2)" fontSize="11" fontWeight="700">O</text>
            <text x="48" y="118" fill="var(--mf-violet)" fontSize="11" fontWeight="700">x° + y° = 180°</text>
          </svg>
        </div>
        <FBox label="সন্নিহিত কোণ (সরলরেখার উপর পাশাপাশি)" val="দুইটির সমষ্টি = 180°" highlight/>
        <FBox label="পূরক কোণ (Complementary)" val="সমষ্টি = 90°"/>
        <FBox label="সম্পূরক কোণ (Supplementary)" val="সমষ্টি = 180°"/>
        <FBox label="বিপ্রতীপ কোণ (Vertically opposite)" val="পরস্পর সমান"/>
        <Mem title="💡 মনে রাখুন">
          <p>একটি সরলরেখার উপর পাশাপাশি দুই কোণ মিলে <strong>সরলকোণ</strong> তৈরি করে — তাই যোগফল সবসময় <strong>180°</strong>।</p>
          <p style={{marginTop:4}}>একটি জানা থাকলে অন্যটি = <strong>180° − জানা কোণ</strong>। যেমন এক কোণ 115° হলে পাশেরটি 65°।</p>
        </Mem>
      </Card>
      </div>

      <div className="mf-grid4" style={{marginBottom:16}}>
        <Card color="gold">
          <CardTitle badge="Equilateral">সমবাহু ত্রিভুজ</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="120" height="100" viewBox="0 0 140 115">
              <polygon points="70,10 130,110 10,110" fill="color-mix(in srgb, var(--mf-gold) 6%, transparent)" stroke="var(--mf-gold)" strokeWidth="2"/>
              <text x="100" y="68" fill="var(--mf-gold)" fontSize="12" fontFamily="sans-serif" fontWeight="700">a</text>
              <text x="25" y="68" fill="var(--mf-gold)" fontSize="12" fontFamily="sans-serif" fontWeight="700">a</text>
              <text x="65" y="108" fill="var(--mf-gold)" fontSize="12" fontFamily="sans-serif" fontWeight="700">a</text>
              <text x="60" y="28" fill="var(--mf-gold2)" fontSize="9">60°</text>
              <text x="15" y="105" fill="var(--mf-gold2)" fontSize="9">60°</text>
              <text x="108" y="105" fill="var(--mf-gold2)" fontSize="9">60°</text>
              <line x1="95" y1="57" x2="91" y2="65" stroke="var(--mf-gold2)" strokeWidth="2"/>
              <line x1="45" y1="57" x2="49" y2="65" stroke="var(--mf-gold2)" strokeWidth="2"/>
              <line x1="68" y1="110" x2="72" y2="110" stroke="var(--mf-gold2)" strokeWidth="2"/>
            </svg>
          </div>
          <FBox label="পরিসীমা" val="= 3a"/>
          <FBox label="বাহু (মধ্যমা h → a)" tex={"a = \\dfrac{2}{\\sqrt{3}}\\,h"}/>
          <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{\\sqrt{3}}{4}\\,a^2"} highlight/>
          <Mem title="💡 মনে রাখুন">
            <p>সব বাহু সমান = শুধু "a"</p>
            <p style={{marginTop:4}}><strong>কোণ:</strong> প্রতিটি কোণ = <strong>60°</strong> — তিনটিই সমান, সবসময় ধ্রুব।</p>
            <p style={{marginTop:4}}><strong>h = মধ্যমা</strong> — উচ্চতা, মধ্যমা ও কোণের সমদ্বিখণ্ডক একই রেখা।</p>
          </Mem>
        </Card>

        <Card color="blue">
          <CardTitle badge="Isosceles" badgeStyle={{background:'color-mix(in srgb, var(--mf-blue) 15%, transparent)',color:'var(--mf-blue)',borderColor:'color-mix(in srgb, var(--mf-blue) 30%, transparent)'}}>সমদ্বিবাহু ত্রিভুজ</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="120" height="100" viewBox="0 0 140 115">
              <polygon points="70,8 122,110 18,110" fill="color-mix(in srgb, var(--mf-blue) 8%, transparent)" stroke="var(--mf-blue)" strokeWidth="2"/>
              <text x="99" y="61" fill="var(--mf-blue)" fontSize="12" fontWeight="700">a</text>
              <text x="31" y="61" fill="var(--mf-blue)" fontSize="12" fontWeight="700">a</text>
              {/* single ticks on the two equal sides */}
              <line x1="43.0" y1="52.1" x2="50.2" y2="55.7" stroke="var(--mf-blue)" strokeWidth="1.6"/>
              <line x1="89.8" y1="55.7" x2="97.0" y2="52.1" stroke="var(--mf-blue)" strokeWidth="1.6"/>
              <line x1="70" y1="8" x2="70" y2="110" stroke="var(--mf-gold2)" strokeWidth="1.5" strokeDasharray="4,3"/>
              <text x="74" y="57" fill="var(--mf-gold2)" fontSize="10" fontWeight="600">h</text>
              <rect x="70" y="102" width="8" height="8" fill="none" stroke="var(--mf-gold2)" strokeWidth="1.2"/>
              <text x="55" y="108" fill="var(--mf-blue)" fontSize="12" fontWeight="700">b</text>
              {/* equal base angles: matching single arcs inside each corner */}
              <path d="M 31 110 A 13 13 0 0 0 23.9 98.4" fill="none" stroke="var(--mf-gold)" strokeWidth="1.6"/>
              <path d="M 109 110 A 13 13 0 0 1 116.1 98.4" fill="none" stroke="var(--mf-gold)" strokeWidth="1.6"/>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{b}{4}\\sqrt{4a^2-b^2}"} highlight/>
          <FBox label="উচ্চতা h" tex={"= \\sqrt{a^2 - \\dfrac{b^2}{4}}"}/>
          <FBox label="পরিসীমা" val="= 2a + b"/>
          <Mem title="💡 মনে রাখুন">
            <p><strong>b = ভূমি</strong>, <strong>a = সমান দুটি বাহু</strong></p>
            <p style={{marginTop:4}}><strong>AB = AC → ∠B = ∠C</strong> — সমান বাহুর বিপরীত কোণ দুটি সমান। উল্টোটাও সত্য: দুই কোণ সমান হলে তাদের বিপরীত বাহু দুটিও সমান।</p>
            <p style={{marginTop:4}}><strong>কোণ:</strong> ভূমি সংলগ্ন দুই কোণ <strong>সমান</strong> (সমান বাহুর বিপরীত কোণ সমান) — এক পাশে 60° হলে অন্য পাশেও 60°।</p>
            <p style={{marginTop:4}}>শীর্ষকোণ জানা থাকলে → প্রতি ভূমিকোণ = <strong>(180° − শীর্ষকোণ) ÷ 2</strong></p>
          </Mem>
        </Card>

        <Card color="rose">
          <CardTitle badge="Scalene / Heron" badgeStyle={{background:'color-mix(in srgb, var(--mf-rose) 12%, transparent)',color:'var(--mf-rose)',borderColor:'color-mix(in srgb, var(--mf-rose) 25%, transparent)'}}>বিষমবাহু ত্রিভুজ</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="120" height="100" viewBox="0 0 140 115">
              <polygon points="15,106 118,106 82,14" fill="color-mix(in srgb, var(--mf-rose) 8%, transparent)" stroke="var(--mf-rose)" strokeWidth="2"/>
              <text x="30" y="65" fill="var(--mf-rose)" fontSize="12" fontWeight="700">a</text>
              <text x="103" y="65" fill="var(--mf-rose)" fontSize="12" fontWeight="700">b</text>
              <text x="60" y="104" fill="var(--mf-rose)" fontSize="12" fontWeight="700">c</text>
              {/* three different-size angle arcs: all angles unequal; the biggest arc sits opposite the longest side */}
              <path d="M 75.5 22.9 A 11 11 0 0 0 86.0 24.2" fill="none" stroke="var(--mf-gold)" strokeWidth="1.6"/>
              <path d="M 23 106 A 8 8 0 0 0 19.7 99.5" fill="none" stroke="var(--mf-gold)" strokeWidth="1.6"/>
              <path d="M 101 106 A 17 17 0 0 1 111.8 90.2" fill="none" stroke="var(--mf-gold)" strokeWidth="1.6"/>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" tex={"= \\sqrt{s(s-a)(s-b)(s-c)}"} highlight/>
          <FBox label="s (অর্ধপরি)" tex={"= \\dfrac{a+b+c}{2}"}/>
          <Mem title="💡 কোণ ও বাহু">
            <p>তিন বাহু অসমান → তিন কোণও <strong>অসমান</strong></p>
            <p style={{marginTop:4}}>বড় বাহুর বিপরীতে <strong>বড় কোণ</strong>, ছোট বাহুর বিপরীতে ছোট কোণ।</p>
          </Mem>
          <Mem title="💡 হেরনের সূত্র"><p>"<strong>s</strong> থেকে তিনটি বাদ দাও, গুণ করো, বর্গমূল নাও"</p></Mem>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">ত্রিভুজ: ক্ষেত্রফল ও সর্বসমতার শর্ত</CardTitle>

          <div style={{borderBottom:'1px solid color-mix(in srgb, var(--mf-violet) 15%, transparent)',paddingBottom:12,marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
              <span style={{width:3,height:16,background:'var(--mf-violet)',borderRadius:2}}></span>
              <h4 style={{color:'var(--mf-violet)',fontSize:12,fontWeight:700,margin:0}}>দুই বাহু ও অন্তর্ভুক্ত কোণ দিয়ে ক্ষেত্রফল</h4>
            </div>
            <div style={{textAlign:'center',margin:'6px 0'}}>
              <svg width="120" height="85" viewBox="0 0 140 100">
                <polygon points="8,90 132,90 45,12" fill="color-mix(in srgb, var(--mf-violet) 6%, transparent)" stroke="var(--mf-violet)" strokeWidth="2"/>
                <text x="68" y="98" fill="var(--mf-violet)" fontSize="11" fontWeight="700">a</text>
                <text x="8" y="52" fill="var(--mf-violet)" fontSize="11" fontWeight="700">b</text>
                <path d="M 24 90 A 14 14 0 0 0 16 78" fill="none" stroke="var(--mf-gold)" strokeWidth="1.6"/>
                <text x="22" y="86" fill="var(--mf-gold)" fontSize="9" fontWeight="600">θ</text>
              </svg>
            </div>
            <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{1}{2}\\,ab\\sin\\theta"} highlight/>
            <p style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>যেখানে a ও b দুটি বাহু এবং θ তাদের অন্তর্ভুক্ত কোণ</p>
          </div>

          <div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
              <span style={{width:3,height:16,background:'var(--mf-violet)',borderRadius:2}}></span>
              <h4 style={{color:'var(--mf-violet)',fontSize:12,fontWeight:700,margin:0}}>সর্বসমতার শর্ত (Congruence)</h4>
            </div>
            <div className="mf-legend" style={{fontSize:10}}>
              <span><strong>SAS</strong> Side-Angle-Side</span>
              <span><strong>SSS</strong> Side-Side-Side</span>
              <span><strong>ASA</strong> Angle-Side-Angle</span>
              <span><strong>AAS</strong> Angle-Angle-Side</span>
              <span><strong>RHS</strong> Right-Hypotenuse-Side</span>
            </div>
          </div>
        </Card>
      </div>

      <Card color="gold" style={{marginTop:16}}>
        <CardTitle>সমকোণী ত্রিভুজ ও পিথাগোরাস</CardTitle>
        <div className="mf-grid2">
          <div>
            <FBox label="দুই সূক্ষ্ম কোণের সমষ্টি" val="= 90° (= অপর কোণ, অর্থাৎ সমকোণ)"/>
            <FBox label="পরিসীমা" val="= অতিভুজ + লম্ব + ভূমি"/>
            <FBox label="ক্ষেত্রফল" val="= ½ × লম্ব × ভূমি"/>
            <FBox label="সমকোণী হলে" val="AB² + BC² = AC² (অতিভুজ²)" highlight/>
            <FBox label="সূক্ষ্মকোণী হলে" val="বৃহত্তম বাহুর² < অন্য দুই বাহুর² যোগফল"/>
            <FBox label="স্থূলকোণী হলে" val="বৃহত্তম বাহুর² > অন্য দুই বাহুর² যোগফল"/>
          </div>
          <div>
            <div style={{textAlign:'center',padding:'2px 0 6px'}}>
            <svg width="160" height="132" viewBox="0 0 160 132">
              <polygon points="14,112 134,112 14,16" fill="color-mix(in srgb, var(--mf-gold) 7%, transparent)" stroke="var(--mf-gold)" strokeWidth="2"/>
              <rect x="14" y="100" width="12" height="12" fill="none" stroke="var(--mf-gold2)" strokeWidth="1.5"/>
              <text x="28" y="110" fill="var(--mf-gold2)" fontSize="10">90°</text>
              <text x="74" y="126" fill="var(--mf-teal)" fontSize="12" textAnchor="middle">a (ভূমি)</text>
              <text x="8" y="64" fill="var(--mf-teal)" fontSize="12" textAnchor="middle" transform="rotate(-90,8,64)">b (লম্ব)</text>
              <text x="82" y="55" fill="var(--mf-gold)" fontSize="11" fontWeight="700" textAnchor="middle" transform="rotate(40,82,55)">c = √(a²+b²)</text>
            </svg>
            </div>

            <div style={{padding:'8px 10px',borderRadius:9,background:'color-mix(in srgb, var(--mf-gold) 8%, transparent)',border:'1px solid color-mix(in srgb, var(--mf-gold) 25%, transparent)',marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--mf-gold2)',marginBottom:6}}>পিথাগোরিয়ান ট্রিপলেট — চিনলে হিসাব ছাড়াই উত্তর</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {['3-4-5','5-12-13','8-15-17','7-24-25','9-40-41','20-21-29'].map(t => (
                  <span key={t} style={{fontSize:11,fontWeight:700,color:'var(--mf-gold2)',background:'color-mix(in srgb, var(--mf-gold) 15%, transparent)',border:'1px solid color-mix(in srgb, var(--mf-gold) 30%, transparent)',borderRadius:20,padding:'2px 9px'}}>{t}</span>
                ))}
              </div>
              <div style={{fontSize:11,color:'var(--text-3)',marginTop:6}}>এদের <strong>গুণিতকও</strong> ট্রিপলেট: 6-8-10, 9-12-15, 10-24-26 …</div>
            </div>

            <FBox label="অতিভুজের উপর মধ্যমা" val="= ½ × অতিভুজ"/>
            <FBox label="সমকোণ থেকে অতিভুজে লম্ব" tex={"h = \\dfrac{ab}{c}"}/>

            <FBox label="45° – 45° – 90° (সমদ্বিবাহু)" val="বাহুর অনুপাত 1 : 1 : √2"/>
            <FBox label="30° – 60° – 90°" val="বাহুর অনুপাত 1 : √3 : 2"/>

            <div style={{fontSize:11,color:'var(--text-3)',padding:'8px 2px 0',lineHeight:1.6}}>
              অন্তর্বৃত্তের ব্যাসার্ধ <strong>r = (a + b − c)/2</strong> &nbsp;·&nbsp; পরিবৃত্তের ব্যাসার্ধ <strong>R = অতিভুজ ÷ 2</strong> — বিস্তারিত <strong>বৃত্ত</strong> সেকশনে
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
