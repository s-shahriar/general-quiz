import { SectionHeader, Card, CardTitle, FBox, Mem, Warn } from '../MathFormulaHelpers'

export default function QuadSection() {
  return (
    <div className="mf-section" id="quad">
      <SectionHeader icon="▭" title="চতুর্ভুজ সমূহ" sub="Square · Rectangle · Rhombus · Parallelogram · Trapezium" />
      <Card color="gold" style={{marginBottom:16}}>
        <CardTitle>সকল চতুর্ভুজের তুলনামূলক সূত্র</CardTitle>
        <div className="mf-table-scroll"><table className="mf-cmp-table">
          <thead>
            <tr><th>আকৃতি</th><th>ক্ষেত্রফল</th><th>পরিসীমা</th><th>কর্ণ</th><th>বিশেষ ধর্ম</th></tr>
          </thead>
          <tbody>
            <tr><td><strong style={{color:'var(--mf-gold)'}}>বর্গক্ষেত্র</strong></td><td className="hl">a²</td><td className="hl">4a</td><td className="hl">√2·a</td><td>৪ বাহু সমান, ৪ কোণ = 90°</td></tr>
            <tr><td><strong style={{color:'var(--mf-teal)'}}>রম্বস</strong></td><td className="hl">½ × d₁ × d₂</td><td className="hl">4a</td><td className="hl">d₁, d₂</td><td>৪ বাহু সমান, কর্ণ লম্বদ্বিখণ্ডক</td></tr>
            <tr><td><strong style={{color:'var(--mf-blue)'}}>আয়তক্ষেত্র</strong></td><td className="hl">a × b</td><td className="hl">2(a+b)</td><td className="hl">√(a²+b²)</td><td>বিপরীত বাহু সমান, ৪ কোণ = 90°</td></tr>
            <tr><td><strong style={{color:'var(--mf-violet)'}}>সামান্তরিক</strong></td><td className="hl">ভূমি × উচ্চতা</td><td className="hl">2(a+b)</td><td>−</td><td>বিপরীত বাহু সমান ও সমান্তরাল</td></tr>
            <tr><td><strong style={{color:'var(--mf-rose)'}}>ট্রাপিজিয়াম</strong></td><td className="hl">½(a+b)×h</td><td>a+b+c+d</td><td>−</td><td>এক জোড়া সমান্তরাল বাহু</td></tr>
          </tbody>
        </table></div>
      </Card>

      <div className="mf-grid3">
        <Card color="gold">
          <CardTitle>বর্গক্ষেত্র (Square)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="120" height="110" viewBox="0 0 120 110">
              <rect x="15" y="8" width="90" height="90" fill="rgba(240,165,0,.07)" stroke="#f0a500" strokeWidth="2"/>
              <rect x="15" y="8" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <rect x="95" y="8" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <rect x="15" y="88" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <rect x="95" y="88" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <line x1="15" y1="8" x2="105" y2="98" stroke="#f0a500" strokeWidth="1.2" strokeDasharray="4,3" opacity=".5"/>
              <text x="54" y="108" fill="#f0a500" fontSize="13" fontWeight="700">a</text>
              <text x="2" y="58" fill="#f0a500" fontSize="13" fontWeight="700">a</text>
              <text x="55" y="56" fill="#ffd166" fontSize="11">√2·a</text>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" tex={"= a^2"}/>
          <FBox label="পরিসীমা" val="= 4a"/>
          <FBox label="কর্ণ" tex={"= \\sqrt{2}\\,a"} highlight/>
          <ul className="mf-prop-list" style={{marginTop:8}}>
            <li><strong>কোণ:</strong> চারটি কোণই <strong>90°</strong></li>
            <li>কর্ণ কোণকে সমদ্বিখণ্ডিত করে → প্রতিটি অর্ধেক <strong>45°</strong></li>
          </ul>
          <p style={{fontSize:12,color:'var(--text-3)',marginTop:6}}>১ হেক্টর = ১০,০০০ বর্গমিটার</p>
        </Card>

        <Card color="blue">
          <CardTitle color="var(--mf-blue)">আয়তক্ষেত্র (Rectangle)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="140" height="100" viewBox="0 0 140 100">
              <rect x="10" y="12" width="120" height="72" fill="rgba(91,164,245,.07)" stroke="#5ba4f5" strokeWidth="2"/>
              <rect x="10" y="12" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <rect x="120" y="12" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <rect x="10" y="74" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <rect x="120" y="74" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <line x1="10" y1="12" x2="130" y2="84" stroke="#5ba4f5" strokeWidth="1" strokeDasharray="4,3" opacity=".5"/>
              <text x="56" y="95" fill="#5ba4f5" fontSize="13" fontWeight="700">a (দৈর্ঘ্য)</text>
              <text x="131" y="55" fill="#5ba4f5" fontSize="12" fontWeight="700">b</text>
              <text x="55" y="52" fill="#ffd166" fontSize="11">√(a²+b²)</text>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" val="= a × b"/>
          <FBox label="পরিসীমা" val="= 2(a + b)"/>
          <FBox label="কর্ণ" tex={"= \\sqrt{a^2+b^2}"} highlight/>
          <ul className="mf-prop-list" style={{marginTop:8}}>
            <li><strong>কোণ:</strong> চারটি কোণই <strong>90°</strong></li>
            <li>তবে বর্গ/রম্বসের মত কর্ণ কোণকে সমদ্বিখণ্ডিত করে <strong>না</strong></li>
          </ul>
          <Mem title="💡"><p>কর্ণদ্বয় সমান এবং পরস্পরকে <strong>সমদ্বিখণ্ডিত</strong> করে।</p></Mem>
        </Card>

        <Card color="teal">
          <CardTitle color="var(--mf-teal)">রম্বস (Rhombus)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="130" height="110" viewBox="0 0 130 110">
              <polygon points="65,5 120,55 65,105 10,55" fill="rgba(15,219,168,.06)" stroke="#0fdba8" strokeWidth="2"/>
              <line x1="65" y1="5" x2="65" y2="105" stroke="#f0a500" strokeWidth="1.5" strokeDasharray="4,2"/>
              <line x1="10" y1="55" x2="120" y2="55" stroke="#f0a500" strokeWidth="1.5" strokeDasharray="4,2"/>
              <rect x="60" y="50" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <text x="65" y="45" fill="#f0a500" fontSize="11">d₁</text>
              <text x="115" y="52" fill="#f0a500" fontSize="11">d₂</text>
              <text x="66" y="25" fill="#0fdba8" fontSize="12">a</text>
              <text x="66" y="88" fill="#0fdba8" fontSize="12">a</text>
              {/* opposite angles equal: single arc (top & bottom), double arc (left & right) */}
              <path d="M 54.64 14.42 A 14 14 0 0 0 75.36 14.42" fill="none" stroke="#0a9d78" strokeWidth="1.6"/>
              <path d="M 54.64 95.58 A 14 14 0 0 1 75.36 95.58" fill="none" stroke="#0a9d78" strokeWidth="1.6"/>
              <path d="M 18.14 47.60 A 11 11 0 0 1 18.14 62.40" fill="none" stroke="#0a9d78" strokeWidth="1.6"/>
              <path d="M 21.10 44.91 A 15 15 0 0 1 21.10 65.09" fill="none" stroke="#0a9d78" strokeWidth="1.6"/>
              <path d="M 111.86 47.60 A 11 11 0 0 0 111.86 62.40" fill="none" stroke="#0a9d78" strokeWidth="1.6"/>
              <path d="M 108.90 44.91 A 15 15 0 0 0 108.90 65.09" fill="none" stroke="#0a9d78" strokeWidth="1.6"/>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{1}{2}\\,d_1 d_2"} highlight/>
          <FBox label="পরিসীমা" val="= 4a"/>
          <ul className="mf-prop-list" style={{marginTop:8}}>
            <li>চার বাহু সমান, কিন্তু কোণ ≠ 90°</li>
            <li><strong>বিপরীত কোণ সমান</strong>; সন্নিহিত দুই কোণের যোগ = <strong>180°</strong></li>
            <li>কর্ণদ্বয় পরস্পরকে <strong>সমকোণে সমদ্বিখণ্ডিত</strong> করে</li>
            <li>প্রতিটি কর্ণ কোণকেও সমদ্বিখণ্ডিত করে</li>
          </ul>
          <Warn title="⚠️ মিলিয়ে ফেলবেন না"><p>রম্বস ≠ বর্গ। রম্বুসে কোণ ৯০° নয়।</p></Warn>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">সামান্তরিক (Parallelogram)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="150" height="100" viewBox="0 0 150 100">
              <polygon points="25,88 140,88 125,12 10,12" fill="rgba(167,139,250,.06)" stroke="#a78bfa" strokeWidth="2"/>
              <line x1="82.5" y1="12" x2="82.5" y2="88" stroke="#f0a500" strokeWidth="1.5" strokeDasharray="4,2"/>
              <rect x="77.5" y="78" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <text x="70" y="97" fill="#a78bfa" fontSize="12">a (ভূমি)</text>
              <text x="127" y="55" fill="#a78bfa" fontSize="12">b</text>
              <text x="86" y="52" fill="#f0a500" fontSize="11">h</text>
              {/* opposite angles equal: single arc (BL & TR), double arc (BR & TL) */}
              <path d="M 39 88 A 14 14 0 0 0 22.29 74.26" fill="none" stroke="#7c3aed" strokeWidth="1.6"/>
              <path d="M 111 12 A 14 14 0 0 0 127.71 25.74" fill="none" stroke="#7c3aed" strokeWidth="1.6"/>
              <path d="M 129 88 A 11 11 0 0 1 137.87 77.21" fill="none" stroke="#7c3aed" strokeWidth="1.6"/>
              <path d="M 125 88 A 15 15 0 0 1 137.10 73.28" fill="none" stroke="#7c3aed" strokeWidth="1.6"/>
              <path d="M 21 12 A 11 11 0 0 1 12.13 22.79" fill="none" stroke="#7c3aed" strokeWidth="1.6"/>
              <path d="M 25 12 A 15 15 0 0 1 12.90 26.72" fill="none" stroke="#7c3aed" strokeWidth="1.6"/>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" val="= ভূমি × উচ্চতা (a × h)" highlight/>
          <FBox label="পরিসীমা" val="= 2(a + b)"/>
          <ul className="mf-prop-list" style={{marginTop:8}}>
            <li>বিপরীত বাহু সমান ও সমান্তরাল</li>
            <li><strong>বিপরীত কোণ সমান</strong>; সন্নিহিত দুই কোণ <strong>সম্পূরক (যোগ = 180°)</strong></li>
            <li>কর্ণদ্বয় পরস্পরকে সমদ্বিখণ্ডিত করে</li>
          </ul>
        </Card>

        <Card color="rose">
          <CardTitle>ট্রাপিজিয়াম (Trapezium)</CardTitle>
          <div style={{textAlign:'center',margin:'8px 0'}}>
            <svg width="150" height="100" viewBox="0 0 150 100">
              <polygon points="30,88 120,88 100,15 50,15" fill="rgba(240,108,126,.06)" stroke="#f06d7e" strokeWidth="2"/>
              <line x1="75" y1="15" x2="75" y2="88" stroke="#f0a500" strokeWidth="1.5" strokeDasharray="4,2"/>
              <rect x="70" y="78" width="10" height="10" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
              <text x="52" y="11" fill="#f06d7e" fontSize="12">a (ছোট সমান্তরাল)</text>
              <text x="52" y="98" fill="#f06d7e" fontSize="12">b (বড় সমান্তরাল)</text>
              <text x="78" y="56" fill="#f0a500" fontSize="12">h</text>
            </svg>
          </div>
          <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{1}{2}(a+b)h"} highlight/>
          <ul className="mf-prop-list" style={{marginTop:8}}>
            <li>এক জোড়া বাহু সমান্তরাল (a ও b)</li>
            <li>দুই সমান্তরাল বাহু সমান হলে সামান্তরিক</li>
            <li>সমদ্বিবাহু ট্রাপিজিয়াম: অসমান্তরাল বাহু দুটি সমান</li>
          </ul>
        </Card>
      </div>

      <Card color="teal" style={{marginTop:16}}>
        <CardTitle color="var(--mf-teal)">কোন প্রশ্নে কী বের করবে? — ক্ষেত্রফল / পরিসীমা / আয়তন</CardTitle>
        <p style={{fontSize:13, color:'var(--text-3)', margin:'2px 0 10px'}}>শব্দ-সমস্যায় (word problem) সঠিক জিনিসটা বের করা সবচেয়ে জরুরি — সূত্র জানার আগেই বুঝতে হবে কোনটা লাগবে।</p>
        <div className="mf-table-scroll"><table className="mf-cmp-table">
          <thead>
            <tr><th>প্রশ্নে যা চাওয়া হয়</th><th>যা বের করবে</th><th>কীভাবে</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>জায়গা ঢাকতে কতগুলো <strong>ইট / টাইলস / পাথর / ঘাস</strong> লাগবে (প্রতিটির মাপ দেওয়া)</td>
              <td><strong style={{color:'var(--mf-gold)'}}>ক্ষেত্রফল</strong> <span style={{color:'var(--text-dim)'}}>(Area)</span></td>
              <td className="hl">মোট ক্ষেত্রফল ÷ প্রতিটির ক্ষেত্রফল</td>
            </tr>
            <tr>
              <td>চারপাশে <strong>বেড়া / তার / কাঁটা</strong> দিতে কতটুকু লাগবে, বা মাঠ একবার ঘুরতে কত পথ</td>
              <td><strong style={{color:'var(--mf-blue)'}}>পরিসীমা</strong> <span style={{color:'var(--text-dim)'}}>(Perimeter)</span></td>
              <td className="hl">সব বাহুর যোগফল <strong>(ক্ষেত্রফল নয়)</strong></td>
            </tr>
            <tr>
              <td>পাত্র / ট্যাংক / ঘর ভরতে কতটুকু <strong>পানি / গ্যাস / বালি</strong> লাগবে — মোট শূন্যস্থান</td>
              <td><strong style={{color:'var(--mf-rose)'}}>আয়তন</strong> <span style={{color:'var(--text-dim)'}}>(Volume)</span></td>
              <td className="hl">দৈর্ঘ্য × প্রস্থ × উচ্চতা</td>
            </tr>
          </tbody>
        </table></div>
        <Warn title="⚠️ সবচেয়ে বড় ফাঁদ" style={{marginTop:10}}>
          <p>“চারপাশে বেড়া দিতে কতটুকু লাগবে” শুনলে অনেকে ক্ষেত্রফল করে ফেলে — আসলে <strong>পরিসীমা</strong>। মনে রাখো: <strong>ঢাকতে/মুড়তে → ক্ষেত্রফল</strong>, <strong>চারপাশ ঘিরতে → পরিসীমা</strong>, <strong>ভরতে → আয়তন</strong>।</p>
        </Warn>
      </Card>
    </div>
  )
}
