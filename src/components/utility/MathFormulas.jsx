import { useEffect, useRef } from 'react'
import { ChevronLeft, Lightbulb, AlertTriangle } from 'lucide-react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './MathFormulas.css'

const SECTIONS = [
  { id: 'triangle', label: 'ত্রিভুজ' },
  { id: 'trig',     label: 'ত্রিকোণমিতি' },
  { id: 'tri-center',label: 'ত্রিভুজ কেন্দ্র' },
  { id: 'quad',     label: 'চতুর্ভুজ' },
  { id: 'circle',   label: 'বৃত্ত ও বহুভুজ' },
  { id: 'solid',    label: 'ঘনবস্তু' },
  { id: 'curved',   label: 'সিলিন্ডার/Cone/গোলক' },
  { id: 'algebra',   label: 'বীজগণিত' },
  { id: 'quadratic', label: 'দ্বিঘাত সমী.' },
  { id: 'logarithm', label: 'লগারিদম' },
  { id: 'series',    label: 'ধারা' },
  { id: 'pnc',      label: 'বিন্যাস-সমাবেশ' },
  { id: 'set',      label: 'সেট ও সম্ভাবনা' },
  { id: 'lcm',      label: 'ল.সা.গু-গ.সা.গু' },
  { id: 'profit',   label: 'মুনাফা' },
]

export default function MathFormulas({ onBack }) {
  const activeRef = useRef(null)

  useEffect(() => {
    const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)
    const navBtns    = document.querySelectorAll('.mf-nav-btn')

    const navInner = document.querySelector('.mf-nav-inner')

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        navBtns.forEach(b => b.classList.remove('active'))
        const btn = document.querySelector(`.mf-nav-btn[data-id="${e.target.id}"]`)
        if (btn && navInner) {
          btn.classList.add('active')
          // Scroll only horizontally within the nav bar — never use scrollIntoView
          // which can cause block-axis page jumps on sticky elements
          navInner.scrollLeft = btn.offsetLeft - navInner.offsetWidth / 2 + btn.offsetWidth / 2
        }
      })
    }, { rootMargin: '-20% 0px -65% 0px' })

    sectionEls.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mf-root">
      {/* Top bar */}
      <div className="mf-topbar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={15} /> হোম
        </button>
        <span className="mf-topbar-title">গণিত সূত্র সংকলন</span>
      </div>

      {/* Section nav */}
      <nav className="mf-nav">
        <div className="mf-nav-inner">
          {SECTIONS.map(s => (
            <button key={s.id} className="mf-nav-btn" data-id={s.id} onClick={() => scrollTo(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="mf-hero">
        <h1>গণিত সূত্র সংকলন</h1>
        <p>জ্যামিতি · বীজগণিত · পরিসংখ্যান · সম্ভাবনা — সম্পূর্ণ সূত্র + মনে রাখার কৌশল</p>
      </div>

      <div className="mf-wrap">

        {/* ══ S2: TRIANGLE ══════════════════════════════════════ */}
        <div className="mf-section" id="triangle">
          <SectionHeader icon="△" title="ত্রিভুজ — প্রকার, সর্বসমতা ও ক্ষেত্রফল" sub="Triangles · Congruence · Area Formulas" />

          <Card color="teal" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-teal)">ত্রিভুজের মূল ধর্মসমূহ</CardTitle>
            <ul className="mf-prop-list">
              <li>তিনটি অভ্যন্তরীণ কোণের সমষ্টি = <span className="mf-fi">180°</span></li>
              <li>বহিঃস্থ কোণ = অপর দুটি অন্তঃস্থ কোণের সমষ্টি</li>
              <li>যেকোনো দুই বাহুর যোগফল &gt; তৃতীয় বাহু</li>
              <li>কোণের সমদ্বিখণ্ডক বিপরীত বাহুকে পার্শ্ববর্তী দুই বাহুর অনুপাতে বিভক্ত করে (BD/DC = AB/AC)</li>
              <li>একটি কোণ বাহির হলে অপর দুটি কোণের সমষ্টির সমান হয়</li>
            </ul>
          </Card>

          <div className="mf-grid3" style={{marginBottom:16}}>
            <Card color="gold">
              <CardTitle badge="Equilateral">সমবাহু ত্রিভুজ</CardTitle>
              <div style={{textAlign:'center',margin:'10px 0'}}>
                <svg width="140" height="115" viewBox="0 0 140 115">
                  <polygon points="70,10 130,110 10,110" fill="rgba(240,165,0,.06)" stroke="#f0a500" strokeWidth="2"/>
                  <text x="100" y="68" fill="#f0a500" fontSize="13" fontFamily="sans-serif" fontWeight="700">a</text>
                  <text x="25" y="68" fill="#f0a500" fontSize="13" fontFamily="sans-serif" fontWeight="700">a</text>
                  <text x="65" y="108" fill="#f0a500" fontSize="13" fontFamily="sans-serif" fontWeight="700">a</text>
                  <text x="60" y="28" fill="#ffd166" fontSize="10">60°</text>
                  <text x="15" y="105" fill="#ffd166" fontSize="10">60°</text>
                  <text x="108" y="105" fill="#ffd166" fontSize="10">60°</text>
                  <line x1="95" y1="57" x2="91" y2="65" stroke="#ffd166" strokeWidth="2"/>
                  <line x1="45" y1="57" x2="49" y2="65" stroke="#ffd166" strokeWidth="2"/>
                  <line x1="68" y1="110" x2="72" y2="110" stroke="#ffd166" strokeWidth="2"/>
                </svg>
              </div>
              <FBox label="পরিসীমা" val="= 3a"/>
              <FBox label="বাহু (মধ্যমা h → a)" tex={"a = \\dfrac{2}{\\sqrt{3}}\\,h"}/>
              <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{\\sqrt{3}}{4}\\,a^2"} highlight/>
              <Mem title="💡 মনে রাখুন">
                <p>সব বাহু সমান = শুধু "a" — সূত্রে অন্য কোনো অক্ষর নেই।</p>
                <p style={{marginTop:6}}><strong>h = মধ্যমা</strong> — সমবাহু ত্রিভুজে উচ্চতা, মধ্যমা ও কোণের সমদ্বিখণ্ডক একই রেখা।</p>
              </Mem>
            </Card>

            <Card color="blue">
              <CardTitle badge="Isosceles" badgeStyle={{background:'rgba(91,164,245,.15)',color:'var(--mf-blue)',borderColor:'rgba(91,164,245,.3)'}}>সমদ্বিবাহু ত্রিভুজ</CardTitle>
              <div style={{textAlign:'center',margin:'10px 0'}}>
                <svg width="140" height="115" viewBox="0 0 140 115">
                  <polygon points="70,8 122,110 18,110" fill="rgba(91,164,245,.08)" stroke="#5ba4f5" strokeWidth="2"/>
                  <text x="99" y="61" fill="#5ba4f5" fontSize="13" fontWeight="700">a</text>
                  <text x="31" y="61" fill="#5ba4f5" fontSize="13" fontWeight="700">a</text>
                  <line x1="70" y1="8" x2="70" y2="110" stroke="#ffd166" strokeWidth="1.5" strokeDasharray="4,3"/>
                  <text x="74" y="57" fill="#ffd166" fontSize="11" fontWeight="600">h</text>
                  <rect x="70" y="102" width="8" height="8" fill="none" stroke="#ffd166" strokeWidth="1.2"/>
                  <text x="55" y="108" fill="#f0a500" fontSize="13" fontWeight="700">b</text>
                </svg>
              </div>
              <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{b}{4}\\sqrt{4a^2-b^2}"} highlight/>
              <FBox label="উচ্চতা h" tex={"= \\sqrt{a^2 - \\dfrac{b^2}{4}}"}/>
              <Mem title="💡 মনে রাখুন"><p><strong>b = ভূমি</strong> (বেজ), <strong>a = সমান দুটি বাহু</strong> — "b" আলাদা কারণ ভূমি আলাদা।</p></Mem>
            </Card>

            <Card color="rose">
              <CardTitle badge="Scalene / Heron" badgeStyle={{background:'rgba(240,108,126,.12)',color:'var(--mf-rose)',borderColor:'rgba(240,108,126,.25)'}}>বিষমবাহু ত্রিভুজ</CardTitle>
              <div style={{textAlign:'center',margin:'10px 0'}}>
                <svg width="140" height="115" viewBox="0 0 140 115">
                  <polygon points="15,106 118,106 82,14" fill="rgba(240,108,126,.08)" stroke="#f06d7e" strokeWidth="2"/>
                  <text x="30" y="65" fill="#f06d7e" fontSize="13" fontWeight="700">a</text>
                  <text x="103" y="65" fill="#f06d7e" fontSize="13" fontWeight="700">b</text>
                  <text x="60" y="104" fill="#f06d7e" fontSize="13" fontWeight="700">c</text>
                </svg>
              </div>
              <FBox label="ক্ষেত্রফল" tex={"= \\sqrt{s(s-a)(s-b)(s-c)}"} highlight/>
              <FBox label="s (অর্ধপরি)" tex={"= \\dfrac{a+b+c}{2}"}/>
              <Mem title="💡 হেরনের সূত্র"><p>"<strong>s</strong> থেকে তিনটি বাদ দাও, গুণ করো, বর্গমূল নাও"</p></Mem>
            </Card>
          </div>

          <div className="mf-grid2">
            <Card color="violet">
              <CardTitle color="var(--mf-violet)">দুই বাহু ও অন্তর্ভুক্ত কোণ দিয়ে ক্ষেত্রফল</CardTitle>
              <div style={{textAlign:'center',margin:'10px 0'}}>
                <svg width="160" height="110" viewBox="0 0 160 110">
                  <polygon points="10,100 150,100 50,15" fill="rgba(167,139,250,.06)" stroke="#a78bfa" strokeWidth="2"/>
                  <text x="75" y="108" fill="#a78bfa" fontSize="13" fontWeight="700">a</text>
                  <text x="9" y="58" fill="#a78bfa" fontSize="13" fontWeight="700">b</text>
                  <path d="M 26 100 A 16 16 0 0 0 17 86" fill="none" stroke="#f0a500" strokeWidth="1.8"/>
                  <text x="24" y="95" fill="#f0a500" fontSize="11" fontWeight="600">θ</text>
                </svg>
              </div>
              <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{1}{2}\\,ab\\sin\\theta"} highlight/>
              <p style={{fontSize:13,color:'var(--text-3)',marginTop:8}}>যেখানে a ও b দুটি বাহু এবং θ তাদের অন্তর্ভুক্ত কোণ</p>
            </Card>

            <Card color="gold">
              <CardTitle>সর্বসমতার শর্ত (Congruence)</CardTitle>
              <div className="mf-legend">
                <span><strong>SAS</strong> Side-Angle-Side</span>
                <span><strong>SSS</strong> Side-Side-Side</span>
                <span><strong>ASA</strong> Angle-Side-Angle</span>
                <span><strong>AAS</strong> Angle-Angle-Side</span>
                <span><strong>RHS</strong> Right-Hypotenuse-Side</span>
              </div>
              <ul className="mf-prop-list">
                <li><span className="mf-tag g">SAS</span> দুই বাহু ও অন্তর্ভুক্ত কোণ সমান</li>
                <li><span className="mf-tag g">SSS</span> তিন বাহু সমান</li>
                <li><span className="mf-tag g">ASA</span> দুই কোণ ও মধ্যবর্তী বাহু সমান</li>
                <li><span className="mf-tag g">AAS</span> দুই কোণ ও যেকোনো বাহু সমান</li>
                <li><span className="mf-tag g">RHS</span> সমকোণী: অতিভুজ ও একটি বাহু সমান</li>
              </ul>
              <Warn title="⚠️ মিলিয়ে ফেলবেন না">
                <p>সর্বসম (Congruent) ≠ সদৃশ (Similar)। সর্বসম = একই আকার ও মাপ। সদৃশ = শুধু একই আকার।</p>
              </Warn>
            </Card>
          </div>

          <Card color="gold" style={{marginTop:16}}>
            <CardTitle>পিথাগোরাস সংক্রান্ত গুরুত্বপূর্ণ তথ্য</CardTitle>
            <div className="mf-grid2">
              <div>
                <FBox label="সমকোণী হলে" val="AB² + BC² = AC² (অতিভুজ²)"/>
                <FBox label="সূক্ষ্মকোণী হলে" val="বৃহত্তম বাহুর² < অন্য দুই বাহুর² যোগফল"/>
                <FBox label="স্থূলকোণী হলে" val="বৃহত্তম বাহুর² > অন্য দুই বাহুর² যোগফল"/>
              </div>
              <div style={{textAlign:'center',padding:10}}>
                <svg width="160" height="132" viewBox="0 0 160 132">
                  <polygon points="14,112 134,112 14,16" fill="rgba(240,165,0,.07)" stroke="#f0a500" strokeWidth="2"/>
                  <rect x="14" y="100" width="12" height="12" fill="none" stroke="#ffd166" strokeWidth="1.5"/>
                  <text x="28" y="110" fill="#ffd166" fontSize="10">90°</text>
                  <text x="74" y="126" fill="#0fdba8" fontSize="12" textAnchor="middle">a (ভূমি)</text>
                  <text x="8" y="64" fill="#0fdba8" fontSize="12" textAnchor="middle" transform="rotate(-90,8,64)">b (লম্ব)</text>
                  <text x="82" y="55" fill="#f0a500" fontSize="11" fontWeight="700" textAnchor="middle" transform="rotate(40,82,55)">c = √(a²+b²)</text>
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* ══ S-TRIG: TRIGONOMETRY ══════════════════════════════ */}
        <div className="mf-section" id="trig">
          <SectionHeader icon="√" title="ত্রিকোণমিতি — √ কৌশল" sub="sin · cos · tan — শুধু √0, 1, 2, 3, 4 মনে রাখো, ভাগ করো 2 দিয়ে" />

          {/* Trick overview */}
          <Card color="teal" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-teal)">কৌশল: মাত্র একটি সিকোয়েন্স মনে রাখো</CardTitle>
            <div style={{display:'flex', flexWrap:'wrap', gap:12, margin:'12px 0'}}>
              <div style={{flex:1, minWidth:140, background:'rgba(15,219,168,.08)', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-teal)'}}>
                <div style={{fontWeight:700, color:'var(--mf-teal)', marginBottom:10, fontSize:13}}>sin — বাড়তি ক্রম ↑</div>
                <div style={{display:'flex', alignItems:'flex-end', gap:10, marginBottom:8}}>
                  {['√0','√1','√2','√3','√4'].map((v,i) => (
                    <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
                      <span style={{fontWeight:800, color:'var(--mf-teal)', fontSize:16, fontFamily:"'Space Grotesk',sans-serif"}}>{v}</span>
                      <span style={{width:'100%', height:1, background:'var(--text-dim)'}} />
                      <span style={{fontSize:12, color:'var(--text-3)', fontWeight:600}}>2</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:12, color:'var(--text-3)'}}>n = 0 → 4 &nbsp;→&nbsp; <strong style={{color:'var(--mf-teal)'}}>sin = √n / 2</strong></div>
              </div>
              <div style={{flex:1, minWidth:140, background:'rgba(91,164,245,.08)', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-blue)'}}>
                <div style={{fontWeight:700, color:'var(--mf-blue)', marginBottom:10, fontSize:13}}>cos — কমতি ক্রম ↓</div>
                <div style={{display:'flex', alignItems:'flex-end', gap:10, marginBottom:8}}>
                  {['√4','√3','√2','√1','√0'].map((v,i) => (
                    <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
                      <span style={{fontWeight:800, color:'var(--mf-blue)', fontSize:16, fontFamily:"'Space Grotesk',sans-serif"}}>{v}</span>
                      <span style={{width:'100%', height:1, background:'var(--text-dim)'}} />
                      <span style={{fontSize:12, color:'var(--text-3)', fontWeight:600}}>2</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:12, color:'var(--text-3)'}}>n = 4 → 0 &nbsp;→&nbsp; <strong style={{color:'var(--mf-blue)'}}>cos = √n / 2</strong></div>
              </div>
              <div style={{flex:1, minWidth:140, background:'rgba(240,108,126,.08)', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-rose)'}}>
                <div style={{fontWeight:700, color:'var(--mf-rose)', marginBottom:10, fontSize:13}}>tan = sin ÷ cos</div>
                <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:8}}>
                  {['0','1/√3','1','√3','∞'].map((v,i) => (
                    <span key={i} style={{fontWeight:700, color:'var(--mf-rose)', fontSize:14, fontFamily:"'Space Grotesk',sans-serif"}}>{v}{i < 4 ? <span style={{color:'var(--text-dim)', fontWeight:400}}>, </span> : ''}</span>
                  ))}
                </div>
                <div style={{fontSize:12, color:'var(--text-3)'}}>tan = <strong style={{color:'var(--mf-rose)'}}>sin θ ÷ cos θ</strong></div>
              </div>
            </div>
            <Mem title="💡 মনে রাখার সহজ উপায়">
              <p><strong>sin:</strong> কোণ বাড়লে n বাড়ে (0→4) → sin = √n ÷ 2</p>
              <p style={{marginTop:4}}><strong>cos:</strong> sin-এর ঠিক উল্টো ক্রম (4→0) → cos = √n ÷ 2</p>
              <p style={{marginTop:4}}><strong>tan:</strong> sin ÷ cos — আলাদা মুখস্থ করতে হবে না</p>
            </Mem>
          </Card>

          {/* Quick reference table */}
          <Card color="violet">
            <CardTitle color="var(--mf-violet)">দ্রুত রেফারেন্স — সম্পূর্ণ ছক</CardTitle>
            <div className="mf-table-scroll">
              <table className="mf-cmp-table" style={{minWidth:320}}>
                <thead>
                  <tr><th>কোণ</th><th style={{color:'#0fdba8'}}>sin</th><th style={{color:'#5ba4f5'}}>cos</th><th style={{color:'#f06d7e'}}>tan</th></tr>
                </thead>
                <tbody>
                  {[
                    ['0°',  '0',    '1',      '0'],
                    ['30°', '½',    '√3/2',   '1/√3'],
                    ['45°', '1/√2', '1/√2',   '1'],
                    ['60°', '√3/2', '½',      '√3'],
                    ['90°', '1',    '0',      '∞'],
                  ].map(([a,s,c,t]) => (
                    <tr key={a}>
                      <td><strong style={{color:'var(--mf-gold)'}}>{a}</strong></td>
                      <td className="hl">{s}</td>
                      <td className="hl">{c}</td>
                      <td style={{color:'var(--mf-rose)', fontWeight:600}}>{t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Mem title="💡 গুরুত্বপূর্ণ সম্পর্ক">
              <ul>
                <li>sin ↑ বাড়ে (0→1), cos ↓ কমে (1→0) — সবসময় উল্টো দিকে</li>
                <li>sin² θ + cos² θ = <strong>1</strong> সবসময়</li>
                <li>tan θ = sin θ ÷ cos θ</li>
                <li>tan 90° অসংজ্ঞায়িত — cos 90° = 0, শূন্য দিয়ে ভাগ হয় না</li>
              </ul>
            </Mem>
          </Card>
        </div>

        {/* ══ S3: TRIANGLE CENTERS ══════════════════════════════ */}
        <div className="mf-section" id="tri-center">
          <SectionHeader icon="⊙" title="ত্রিভুজের কেন্দ্র" sub="Incentre · Circumcentre · Centroid" />
          <div className="mf-grid3">
            <Card color="violet">
              <CardTitle color="var(--mf-violet)" badge="Incentre" badgeStyle={{background:'rgba(167,139,250,.12)',color:'var(--mf-violet)',borderColor:'rgba(167,139,250,.3)'}}>অন্তঃকেন্দ্র</CardTitle>
              <div style={{textAlign:'center',margin:'10px 0'}}>
                <svg width="140" height="120" viewBox="0 0 140 120">
                  <polygon points="70,8 128,112 12,112" fill="rgba(167,139,250,.06)" stroke="#a78bfa" strokeWidth="1.5"/>
                  <line x1="70" y1="8" x2="70" y2="112" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <line x1="12" y1="112" x2="99" y2="61" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <line x1="128" y1="112" x2="41" y2="61" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <circle cx="70" cy="78" r="34" fill="none" stroke="#f0a500" strokeWidth="1.5" strokeDasharray="2,2"/>
                  <circle cx="70" cy="78" r="4" fill="#f0a500"/>
                  <text x="74" y="76" fill="#f0a500" fontSize="11">I</text>
                </svg>
              </div>
              <ul className="mf-prop-list">
                <li>কোণের <strong>সমদ্বিখণ্ডকের</strong> ছেদবিন্দু</li>
                <li>অন্তর্বৃত্তের কেন্দ্র</li>
                <li>সর্বদা ত্রিভুজের <strong>ভেতরে</strong> থাকে</li>
              </ul>
              <Mem title="💡 মনে রাখুন"><p><strong>অন্তঃ</strong>কেন্দ্র → <strong>কোণের</strong> সমদ্বিখণ্ডক</p></Mem>
            </Card>

            <Card color="teal">
              <CardTitle color="var(--mf-teal)" badge="Circumcentre">পরিকেন্দ্র</CardTitle>
              <div style={{textAlign:'center',margin:'10px 0'}}>
                <svg width="140" height="150" viewBox="0 0 140 150">
                  <polygon points="70,8 128,112 12,112" fill="rgba(15,219,168,.05)" stroke="#0fdba8" strokeWidth="1.5"/>
                  <line x1="70" y1="8" x2="70" y2="112" stroke="#0fdba8" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <line x1="41" y1="60" x2="125" y2="106" stroke="#0fdba8" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <line x1="99" y1="60" x2="15" y2="107" stroke="#0fdba8" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <circle cx="70" cy="76" r="68" fill="none" stroke="#f0a500" strokeWidth="1.3" strokeDasharray="2,3"/>
                  <circle cx="70" cy="76" r="4" fill="#f0a500"/>
                  <text x="74" y="74" fill="#f0a500" fontSize="11">O</text>
                </svg>
              </div>
              <ul className="mf-prop-list">
                <li>বাহুর <strong>লম্বদ্বিখণ্ডকের</strong> ছেদবিন্দু</li>
                <li>পরিবৃত্তের কেন্দ্র</li>
                <li>সূক্ষ্মকোণীতে ভেতরে, স্থূলকোণীতে বাইরে</li>
              </ul>
              <Mem title="💡 মনে রাখুন"><p><strong>পরি</strong>কেন্দ্র → <strong>বাহুর</strong> লম্বদ্বিখণ্ডক</p></Mem>
            </Card>

            <Card color="rose">
              <CardTitle badge="Centroid" badgeStyle={{background:'rgba(240,108,126,.12)',color:'var(--mf-rose)',borderColor:'rgba(240,108,126,.25)'}}>ভরকেন্দ্র</CardTitle>
              <div style={{textAlign:'center',margin:'10px 0'}}>
                <svg width="140" height="120" viewBox="0 0 140 120">
                  <polygon points="70,8 128,112 12,112" fill="rgba(240,108,126,.05)" stroke="#f06d7e" strokeWidth="1.5"/>
                  <line x1="70" y1="8" x2="70" y2="112" stroke="#f06d7e" strokeWidth="1.5" strokeDasharray="3,2"/>
                  <line x1="12" y1="112" x2="99" y2="60" stroke="#f06d7e" strokeWidth="1.5" strokeDasharray="3,2"/>
                  <line x1="128" y1="112" x2="41" y2="60" stroke="#f06d7e" strokeWidth="1.5" strokeDasharray="3,2"/>
                  <circle cx="70" cy="77" r="5" fill="#f06d7e"/>
                  <text x="75" y="75" fill="#f0a500" fontSize="11">G</text>
                  <circle cx="70" cy="112" r="3" fill="#ffd166"/>
                  <circle cx="99" cy="60" r="3" fill="#ffd166"/>
                  <circle cx="41" cy="60" r="3" fill="#ffd166"/>
                </svg>
              </div>
              <ul className="mf-prop-list">
                <li><strong>মধ্যমার</strong> ছেদবিন্দু</li>
                <li>মধ্যমাকে <span className="mf-fi">2:1</span> অনুপাতে ভাগ করে</li>
                <li>সর্বদা ত্রিভুজের <strong>ভেতরে</strong> থাকে</li>
              </ul>
              <Mem title="💡 মনে রাখুন">
                <p><strong>ভর</strong>কেন্দ্র → <strong>মধ্যমা</strong> (2:1)</p>
                <p style={{marginTop:4}}>শীর্ষ থেকে ভরকেন্দ্র = মধ্যমার ⅔, ভূমি মধ্যবিন্দু থেকে = ⅓।</p>
              </Mem>
            </Card>
          </div>
          <Mem title="💡 তিন কেন্দ্র একসাথে মনে রাখুন" style={{marginTop:8}}>
            <p>
              <strong style={{color:'var(--mf-violet)'}}>অন্তঃ (I)</strong> = কোণ দ্বিখণ্ডক → সবসময় ভেতরে &nbsp;|&nbsp;
              <strong style={{color:'var(--mf-teal)'}}>পরি (O)</strong> = বাহু লম্বদ্বিখণ্ডক → ধরন অনুসারে &nbsp;|&nbsp;
              <strong style={{color:'var(--mf-rose)'}}>ভর (G)</strong> = মধ্যমা → সবসময় ভেতরে, 2:1
            </p>
            <p style={{marginTop:4}}>স্মৃতিসূত্র: <strong>"কোণ-বাহু-মধ্যমা"</strong> → <strong>"অন্তঃ-পরি-ভর"</strong></p>
          </Mem>
        </div>

        {/* ══ S4: QUADRILATERALS ════════════════════════════════ */}
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
                </svg>
              </div>
              <FBox label="ক্ষেত্রফল" tex={"= \\dfrac{1}{2}\\,d_1 d_2"} highlight/>
              <FBox label="পরিসীমা" val="= 4a"/>
              <ul className="mf-prop-list" style={{marginTop:8}}>
                <li>কর্ণদ্বয় পরস্পরকে <strong>সমকোণে সমদ্বিখণ্ডিত</strong> করে</li>
                <li>চার বাহু সমান, কিন্তু কোণ ≠ 90°</li>
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
                </svg>
              </div>
              <FBox label="ক্ষেত্রফল" val="= ভূমি × উচ্চতা (a × h)" highlight/>
              <FBox label="পরিসীমা" val="= 2(a + b)"/>
              <ul className="mf-prop-list" style={{marginTop:8}}>
                <li>বিপরীত বাহু সমান ও সমান্তরাল</li>
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

          <Mem title="💡 সব ক্ষেত্রফল মনে রাখার সহজ ট্রিক" style={{marginTop:8}}>
            <ul>
              <li><strong>বর্গ:</strong> এক বাহু একবার নিজেকে গুণ → a²</li>
              <li><strong>আয়ত:</strong> দৈর্ঘ্য × প্রস্থ → ab</li>
              <li><strong>রম্বস:</strong> দুই কর্ণের গুণফলের অর্ধেক → ½d₁d₂</li>
              <li><strong>সামান্তরিক:</strong> ভূমি × উচ্চতা (আয়তের মতো)</li>
              <li><strong>ট্রাপিজিয়াম:</strong> দুই সমান্তরাল বাহুর গড় × উচ্চতা → ½(a+b)h</li>
            </ul>
          </Mem>
        </div>

        {/* ══ S5: CIRCLE & POLYGON ══════════════════════════════ */}
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
              <FBox label="চাপের দৈর্ঘ্য (Arc)" tex={"= r\\theta"} highlight/>
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

        {/* ══ S6: 3D SOLID ══════════════════════════════════════ */}
        <div className="mf-section" id="solid">
          <SectionHeader icon="◧" title="ঘনক ও ঘনবস্তু" sub="Cube · Cuboid · 3D Properties" />
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
            <CardTitle>ঘনক vs ঘনবস্তু সূত্র তুলনা</CardTitle>
            <div className="mf-table-scroll"><table className="mf-cmp-table">
              <thead>
                <tr><th>বৈশিষ্ট্য</th><th>ঘনক (Cube) — বাহু a</th><th>ঘনবস্তু (Cuboid) — a, b, c</th></tr>
              </thead>
              <tbody>
                <tr><td>আয়তন</td><td className="hl">a³</td><td className="hl">a × b × c</td></tr>
                <tr><td>একটি তলের ক্ষেত্রফল</td><td className="hl">a²</td><td className="hl">ab বা bc বা ca</td></tr>
                <tr><td>সমগ্র পৃষ্ঠতল</td><td className="hl">6a²</td><td className="hl">2(ab + bc + ca)</td></tr>
                <tr><td>একটি তলের কর্ণ</td><td className="hl">√2 · a</td><td className="hl">√(a²+b²) ইত্যাদি</td></tr>
                <tr><td>মহাকর্ণ (Space diagonal)</td><td className="hl">√3 · a</td><td className="hl">√(a² + b² + c²)</td></tr>
              </tbody>
            </table></div>
            <Mem title="💡 মনে রাখুন — ঘনক vs ঘনবস্তু" style={{marginTop:12}}>
              <ul>
                <li><strong>ঘনক:</strong> শুধু "a" → a³, 6a², √3·a</li>
                <li><strong>ঘনবস্তু:</strong> a, b, c → জোড়ায় গুণ (ab+bc+ca)</li>
                <li><strong>তলের কর্ণ:</strong> দুটি দিক → √(a²+b²)</li>
                <li><strong>মহাকর্ণ:</strong> তিনটি দিক → √(a²+b²+c²)</li>
              </ul>
            </Mem>
          </Card>
        </div>

        {/* ══ S7: CYLINDER, CONE, SPHERE ════════════════════════ */}
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
                <tr><td><strong style={{color:'var(--mf-rose)'}}>Cone</strong></td><td className="hl">⅓πr²h</td><td className="hl">πrl</td><td className="hl">πr(r+l)</td><td>l = √(h²+r²)</td></tr>
                <tr><td><strong style={{color:'var(--mf-gold)'}}>গোলক</strong></td><td className="hl">⁴⁄₃πr³</td><td>−</td><td className="hl">4πr²</td><td>−</td></tr>
                <tr><td><strong style={{color:'var(--mf-violet)'}}>অর্ধগোলক</strong></td><td className="hl">⅔πr³</td><td className="hl">2πr²</td><td className="hl">3πr²</td><td>সমগ্র = বক্র + ভূমি</td></tr>
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
              <CardTitle>গোলক ও অর্ধগোলক</CardTitle>
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

        {/* ══ S8: ALGEBRA ════════════════════════════════════════ */}
        <div className="mf-section" id="algebra">
          <SectionHeader icon="≡" title="বীজগণিতীয় সূত্রাবলি" sub="Algebraic Identities" />
          <div className="mf-grid2">
            <Card color="rose">
              <CardTitle>বর্গ সংক্রান্ত সূত্র (Square Identities)</CardTitle>
              <div className="mf-id-list">
                <IdItem n="1"><Tex>{"(a+b)^2 = a^2 + 2ab + b^2"}</Tex></IdItem>
                <IdItem n="2"><Tex>{"(a-b)^2 = a^2 - 2ab + b^2"}</Tex></IdItem>
                <IdItem n="3"><Tex>{"(a+b)^2 = (a-b)^2 + 4ab"}</Tex></IdItem>
                <IdItem n="4"><Tex>{"(a-b)^2 = (a+b)^2 - 4ab"}</Tex></IdItem>
                <IdItem n="5"><Tex>{"a^2 + b^2 = (a+b)^2 - 2ab = (a-b)^2 + 2ab"}</Tex></IdItem>
                <IdItem n="6"><Tex>{"2(a^2+b^2) = (a+b)^2 + (a-b)^2"}</Tex></IdItem>
                <IdItem n="7"><Tex>{"a^2 - b^2 = (a+b)(a-b)"}</Tex></IdItem>
                <IdItem n="8"><Tex>{"4ab = (a+b)^2 - (a-b)^2"}</Tex></IdItem>
                <IdItem n="9"><Tex>{"ab = \\left[\\dfrac{a+b}{2}\\right]^2 - \\left[\\dfrac{a-b}{2}\\right]^2"}</Tex></IdItem>
              </div>
              <Mem title="💡 মনে রাখুন — সূত্র ১ ও ২">
                <ul>
                  <li>যোগ: (a+b)² → মাঝে <strong>+2ab</strong></li>
                  <li>বিয়োগ: (a−b)² → মাঝে <strong>−2ab</strong></li>
                  <li>৭ নম্বর: বর্গের পার্থক্য = গুণনীয়কে পরিণত</li>
                </ul>
              </Mem>
            </Card>

            <Card color="violet">
              <CardTitle color="var(--mf-violet)">তিন পদ ও ঘন সংক্রান্ত সূত্র</CardTitle>
              <div className="mf-id-list">
                <IdItem n="10"><Tex>{"(a+b+c)^2 = a^2+b^2+c^2+2(ab+bc+ca)"}</Tex></IdItem>
                <IdItem n="11"><Tex>{"(x+a)(x+b) = x^2+(a+b)x+ab"}</Tex></IdItem>
                <IdItem n="12" star><Tex>{"(a+b)^3 = a^3+3a^2b+3ab^2+b^3"}</Tex></IdItem>
                <IdItem n="13"><Tex>{"(a-b)^3 = a^3-3a^2b+3ab^2-b^3"}</Tex></IdItem>
                <IdItem n="14"><Tex>{"a^3+b^3 = (a+b)(a^2-ab+b^2)"}</Tex></IdItem>
                <IdItem n="15"><Tex>{"a^3-b^3 = (a-b)(a^2+ab+b^2)"}</Tex></IdItem>
              </div>
              <Mem title="💡 ঘন সূত্র মনে রাখুন">
                <ul>
                  <li>(a+b)³: a³, <strong>+</strong>3a²b, <strong>+</strong>3ab², <strong>+</strong>b³</li>
                  <li>(a−b)³: a³, <strong>−</strong>3a²b, <strong>+</strong>3ab², <strong>−</strong>b³ (চিহ্ন পাল্টায়)</li>
                  <li>a³+b³ → মাঝে <strong>−ab</strong> → (a²−ab+b²)</li>
                  <li>a³−b³ → মাঝে <strong>+ab</strong> → (a²+ab+b²)</li>
                </ul>
              </Mem>
            </Card>
          </div>
          <Warn title="⚠️ সবচেয়ে বেশি ভুল হয় এই সূত্রগুলোতে" style={{marginTop:10}}>
            <p>(a+b)² ≠ a² + b² (2ab ভুলে যাবেন না!) &nbsp;|&nbsp; a³+b³ ≠ (a+b)³ &nbsp;|&nbsp; a²+b² ≠ (a+b)(a−b)</p>
          </Warn>
        </div>

        {/* ══ QUADRATIC EQUATIONS ═══════════════════════════════ */}
        <div className="mf-section" id="quadratic">
          <SectionHeader icon="x²" title="দ্বিঘাত সমীকরণ" sub="Quadratic Equation · Roots · Discriminant" />

          <Card color="blue" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-blue)">মানক রূপ: ax² + bx + c = 0</CardTitle>
            <p style={{fontSize:13,color:'var(--text-3)',marginBottom:12}}>
              α ও β হলো সমীকরণের দুটি মূল (roots)
            </p>
            <div className="mf-grid2">
              <FBox label="① মূলদ্বয়ের সমষ্টি (α + β)" tex={"= -\\dfrac{b}{a}"} highlight/>
              <FBox label="② মূলদ্বয়ের গুণফল (αβ)" tex={"= \\dfrac{c}{a}"} highlight/>
            </div>
            <Mem title="💡 মনে রাখুন — সরল সূত্র">
              <p>সমষ্টি = <strong>−b/a</strong> (ঋণাত্মক b, ধনাত্মক a) &nbsp;|&nbsp; গুণফল = <strong>c/a</strong> (উভয় ধনাত্মক)</p>
            </Mem>
          </Card>

          <Card color="teal" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-teal)">③ দ্বিঘাত সূত্র (Quadratic Formula)</CardTitle>
            <div style={{textAlign:'center',margin:'14px 0'}}>
              <FBox label="x" tex={"= \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"} highlight/>
            </div>
            <FBox label="বিকাশক (Discriminant)" tex={"D = b^2 - 4ac"}/>
            <Mem title="💡 মনে রাখুন">
              <p>"<strong>মাইনাস b প্লাস-মাইনাস রুট b বর্গ মাইনাস 4ac, ভাগ 2a</strong>" — এভাবে পড়লে ভোলা যায় না।</p>
            </Mem>
          </Card>

          <Card color="gold" style={{marginBottom:16}}>
            <CardTitle>④ বিকাশক ও মূলের প্রকৃতি</CardTitle>
            <div className="mf-table-scroll">
              <table className="mf-cmp-table">
                <thead>
                  <tr><th>বিকাশক D = b²−4ac</th><th>মূলের প্রকৃতি</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong style={{color:'var(--mf-teal)'}}>D &gt; 0</strong></td>
                    <td className="hl">দুটি বাস্তব ও অসমান মূল</td>
                  </tr>
                  <tr>
                    <td><strong style={{color:'var(--mf-gold)'}}>D = 0</strong></td>
                    <td className="hl">দুটি বাস্তব ও সমান মূল</td>
                  </tr>
                  <tr>
                    <td><strong style={{color:'var(--mf-rose)'}}>D &lt; 0</strong></td>
                    <td className="hl">দুটি জটিল (কাল্পনিক) মূল</td>
                  </tr>
                  <tr>
                    <td><strong style={{color:'var(--mf-violet)'}}>D &gt; 0 এবং পূর্ণবর্গ</strong></td>
                    <td className="hl">দুটি মূলদ (Rational) মূল</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card color="violet">
            <CardTitle color="var(--mf-violet)">⑤ মূল থেকে সমীকরণ নির্মাণ</CardTitle>
            <p style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>
              যদি α ও β মূল হয়, তবে সমীকরণটি হবে:
            </p>
            <FBox label="সমীকরণ" tex={"x^2 - (\\alpha+\\beta)\\,x + \\alpha\\beta = 0"} highlight/>
            <Mem title="💡 মনে রাখুন">
              <p><strong>x² − (সমষ্টি)x + (গুণফল) = 0</strong></p>
              <p style={{marginTop:4}}>মূল ৩ ও ৪ হলে: x² − 7x + 12 = 0</p>
            </Mem>
          </Card>
        </div>

        {/* ══ LOGARITHM ══════════════════════════════════════════ */}
        <div className="mf-section" id="logarithm">
          <SectionHeader icon="㏒" title="লগারিদম" sub="Logarithm — Properties & Rules" />

          <Card color="teal" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-teal)">মূল সংজ্ঞা ও প্রাথমিক সূত্র</CardTitle>
            <div className="mf-id-list">
              <IdItem n="①"><span style={{marginRight:8,fontWeight:700}}>log<sub>a</sub> 1 = 0</span><span style={{color:'var(--text-3)',fontSize:12}}>(যেকোনো সংখ্যার log of 1 = 0)</span></IdItem>
              <IdItem n="②"><span style={{marginRight:8,fontWeight:700}}>log<sub>a</sub> a = 1</span><span style={{color:'var(--text-3)',fontSize:12}}>(নিজের ভিত্তিতে log = 1)</span></IdItem>
              <IdItem n="③">
                <span>log<sub>a</sub> M = n &nbsp;মানে&nbsp; <strong>a<sup>n</sup> = M</strong></span>
              </IdItem>
              <IdItem n="⑤"><Tex>{"a^{\\log_a b} = b"}</Tex></IdItem>
            </div>
            <Mem title="💡 মূল সংজ্ঞা">
              <p><strong>log<sub>a</sub> M = n</strong> মানে a কে n-তম ঘাতে তুললে M হয়।</p>
              <p style={{marginTop:4}}>log₂ 8 = 3 কারণ 2³ = 8</p>
            </Mem>
          </Card>

          <Card color="violet">
            <CardTitle color="var(--mf-violet)">④ Chain Rule — কোনাকুনি বাতিল হয়</CardTitle>
            <div style={{marginBottom:12}}>
              <FBox label="log_a b × log_b c" tex={"= \\log_a c"} highlight/>
            </div>
            <div style={{background:'var(--elevated)',borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:13,color:'var(--text-3)',marginBottom:8}}>সাধারণ রূপ:</div>
              <FBox label="log_p q × log_m p" tex={"= \\log_m q"}/>
              <div style={{marginTop:10,fontSize:13,color:'var(--text-3)',lineHeight:1.7}}>
                মাঝের ভিত্তি (<strong>b</strong> বা <strong>p</strong>) কোনাকুনিভাবে বাতিল হয়ে যায়।<br/>
                <span style={{color:'var(--mf-violet)',fontWeight:700}}>log<sub>a</sub> <u>b</u></span> × <span style={{color:'var(--mf-violet)',fontWeight:700}}>log<sub><u>b</u></sub> c</span> → b বাতিল → log<sub>a</sub> c
              </div>
            </div>
            <Mem title="💡 মনে রাখুন">
              <p>Chain rule মানে মাঝের ভিত্তি বাতিল। তিনটি বা বেশি গুণও একইভাবে কমানো যায়।</p>
              <p style={{marginTop:4}}>log₂ 3 × log₃ 5 × log₅ 8 = log₂ 8 = 3</p>
            </Mem>
          </Card>
        </div>

        {/* ══ S9: SERIES ════════════════════════════════════════ */}
        <div className="mf-section" id="series">
          <SectionHeader icon="∑" title="সমান্তর ও গুণোত্তর ধারা" sub="Arithmetic Progression (AP) · Geometric Progression (GP)" />
          <div className="mf-grid2">
            <Card color="blue">
              <CardTitle color="var(--mf-blue)">সমান্তর ধারা (AP)</CardTitle>
              <p style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>
                প্রথম পদ <span className="mf-fi">a</span>, সাধারণ অন্তর <span className="mf-fi">d</span>, পদসংখ্যা <span className="mf-fi">n</span>
              </p>
              <div className="mf-series-card"><div className="step">n-তম পদ (Tₙ)</div><div className="formula"><Tex>{"T_n = a + (n-1)d"}</Tex></div></div>
              <div className="mf-series-card"><div className="step">n পদের সমষ্টি (Sₙ)</div><div className="formula"><Tex>{"S_n = \\dfrac{n}{2}\\bigl[2a+(n-1)d\\bigr]"}</Tex></div></div>
              <div className="mf-series-card"><div className="step">গাণিতিক গড় (AM)</div><div className="formula">AM = (প্রথম পদ + শেষ পদ) / 2</div></div>
              <div className="mf-series-card" style={{borderLeft:'3px solid #a78bfa'}}>
                <div className="step">পদ সংখ্যা (Number of Terms)</div>
                <div className="formula"><Tex>{"n = \\dfrac{\\text{শেষ পদ} - \\text{প্রথম পদ}}{\\text{সা. অন্তর}} + 1"}</Tex></div>
              </div>
              <div style={{background:'var(--elevated)',borderRadius:8,padding:12,marginTop:10,borderLeft:'3px solid #0fdba8'}}>
                <div style={{color:'var(--mf-teal)',fontSize:13,fontWeight:700,marginBottom:8}}>বিশেষ সমষ্টি সূত্র</div>
                <FBox label="1+2+...+n" tex={"= \\dfrac{n(n+1)}{2}"}/>
                <FBox label="1²+2²+...+n²" tex={"= \\dfrac{n(n+1)(2n+1)}{6}"}/>
                <FBox label="1³+2³+...+n³" tex={"= \\left[\\dfrac{n(n+1)}{2}\\right]^2"} highlight/>
                <FBox label="2+4+6+...+2L" tex={"= L(L+1)"} highlight/>
              </div>
              <Mem title="💡 মনে রাখুন">
                <ul>
                  <li>n পদের সমষ্টি = <strong>n × গড়</strong></li>
                  <li>n³ এর সমষ্টি = (1+2+...+n) এর <strong>বর্গ</strong></li>
                </ul>
              </Mem>
            </Card>

            <Card color="gold">
              <CardTitle>গুণোত্তর ধারা (GP)</CardTitle>
              <p style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>
                প্রথম পদ <span className="mf-fi">a</span>, সাধারণ অনুপাত <span className="mf-fi">r</span>, পদসংখ্যা <span className="mf-fi">n</span>
              </p>
              <div className="mf-series-card"><div className="step">n-তম পদ</div><div className="formula"><Tex>{"T_n = a \\cdot r^{n-1}"}</Tex></div></div>
              <div className="mf-series-card" style={{borderLeft:'3px solid #f0a500'}}>
                <div className="step">n পদের সমষ্টি — r &gt; 1 হলে</div>
                <div className="formula"><Tex>{"S_n = \\dfrac{a(r^n-1)}{r-1}"}</Tex></div>
                <div style={{fontSize:12, color:'var(--text-3)', marginTop:6}}>
                  যেমন: <strong>2 + 4 + 8 + 16 + ... + 1024</strong> → r = 2, শেষ আছে (সশীম)
                </div>
              </div>
              <div className="mf-series-card">
                <div className="step">n পদের সমষ্টি — r &lt; 1 হলে</div>
                <div className="formula"><Tex>{"S_n = \\dfrac{a(1-r^n)}{1-r}"}</Tex></div>
                <div style={{fontSize:12, color:'var(--text-3)', marginTop:6}}>
                  যেমন: <strong>1 + 0.1 + 0.01 + ... + 0.00001</strong> → r = 0.1, শেষ আছে (সশীম)
                </div>
              </div>
              <div className="mf-series-card" style={{borderLeft:'3px solid #f06d7e', background:'rgba(240,108,126,.06)'}}>
                <div className="step">অশীম পদের সমষ্টি (S∞) — শর্ত: <strong style={{color:'var(--mf-rose)'}}>−1 &lt; r &lt; 1</strong></div>
                <div className="formula"><Tex>{"S_\\infty = \\dfrac{a}{1-r}"}</Tex></div>
                <div style={{fontSize:12, color:'var(--text-3)', marginTop:8, lineHeight:1.6}}>
                  <strong style={{color:'var(--mf-rose)'}}>অশীম ধারা</strong> = যে ধারার শেষ নেই (∞ পদ)<br/>
                  যেমন: <strong>1 + 0.1 + 0.01 + 0.001 + ...</strong> → r = 0.1, শেষ নেই কিন্তু যোগফল আছে<br/>
                  এই সূত্র শুধু তখনই কাজ করে যখন <strong>|r| &lt; 1</strong> (r এর মান −1 থেকে 1 এর মধ্যে)
                </div>
              </div>
              <Mem title="💡 AP vs GP পার্থক্য">
                <ul>
                  <li><strong>AP:</strong> যোগ/বিয়োগ → পরের পদ (d = ধ্রুবক পার্থক্য)</li>
                  <li><strong>GP:</strong> গুণ/ভাগ → পরের পদ (r = ধ্রুবক অনুপাত)</li>
                  <li>AP তে <strong>(n−1)d</strong>, GP তে <strong>r^(n−1)</strong></li>
                </ul>
              </Mem>
            </Card>
          </div>
        </div>

        {/* ══ S10: PERMUTATION & COMBINATION ════════════════════ */}
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

        {/* ══ S11: SET & PROBABILITY ════════════════════════════ */}
        <div className="mf-section" id="set">
          <SectionHeader icon="∩" title="সেট তত্ত্ব ও সম্ভাবনা" sub="Set Theory · Probability" />

          {/* Venn diagram visual guide */}
          <Card color="violet" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-violet)">ভেন চিত্র — অঞ্চল বোঝার সহজ উপায়</CardTitle>
            <div style={{display:'flex', flexWrap:'wrap', gap:20, alignItems:'center', justifyContent:'center', margin:'10px 0'}}>
              {/* SVG Venn Diagram */}
              <svg width="220" height="150" viewBox="0 0 220 150">
                {/* Universal set box */}
                <rect x="5" y="10" width="210" height="130" rx="8" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
                <text x="205" y="24" textAnchor="end" fill="#a78bfa" fontSize="12" fontWeight="700">U</text>
                {/* Circle A */}
                <ellipse cx="85" cy="75" rx="52" ry="45" fill="rgba(91,164,245,.12)" stroke="#5ba4f5" strokeWidth="2"/>
                {/* Circle B */}
                <ellipse cx="135" cy="75" rx="52" ry="45" fill="rgba(15,219,168,.12)" stroke="#0fdba8" strokeWidth="2"/>
                {/* Labels */}
                <text x="48" y="30" fill="#5ba4f5" fontSize="13" fontWeight="700">A</text>
                <text x="166" y="30" fill="#0fdba8" fontSize="13" fontWeight="700">B</text>
                {/* Region numbers */}
                <text x="68" y="80" textAnchor="middle" fill="#5ba4f5" fontSize="16" fontWeight="800">1</text>
                <text x="110" y="80" textAnchor="middle" fill="#a78bfa" fontSize="16" fontWeight="800">2</text>
                <text x="152" y="80" textAnchor="middle" fill="#0fdba8" fontSize="16" fontWeight="800">3</text>
                <text x="195" y="120" textAnchor="middle" fill="#f0a500" fontSize="16" fontWeight="800">4</text>
                {/* A∩B label */}
                <text x="110" y="128" textAnchor="middle" fill="#a78bfa" fontSize="10">A∩B</text>
              </svg>

              {/* Legend */}
              <div style={{fontSize:13, lineHeight:2}}>
                <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(91,164,245,.2)',border:'1.5px solid #5ba4f5',textAlign:'center',fontWeight:700,color:'#5ba4f5',fontSize:12,lineHeight:'20px',marginRight:8}}>1</span><strong>শুধু A</strong> — A-তে আছে, B-তে নেই</div>
                <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(167,139,250,.2)',border:'1.5px solid #a78bfa',textAlign:'center',fontWeight:700,color:'#a78bfa',fontSize:12,lineHeight:'20px',marginRight:8}}>2</span><strong>A∩B (ছেদ)</strong> — উভয়তে আছে</div>
                <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(15,219,168,.2)',border:'1.5px solid #0fdba8',textAlign:'center',fontWeight:700,color:'#0fdba8',fontSize:12,lineHeight:'20px',marginRight:8}}>3</span><strong>শুধু B</strong> — B-তে আছে, A-তে নেই</div>
                <div><span style={{display:'inline-block',width:20,height:20,borderRadius:4,background:'rgba(240,165,0,.15)',border:'1.5px solid #f0a500',textAlign:'center',fontWeight:700,color:'#f0a500',fontSize:12,lineHeight:'20px',marginRight:8}}>4</span><strong>(A∪B)' বাইরে</strong> — কোনোটিতেই নেই</div>
              </div>
            </div>

            {/* Quick reference */}
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

          <div className="mf-grid2">
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
          </div>

          <Card color="rose" style={{marginTop:16}}>
            <CardTitle color="var(--mf-rose)">ব্যবহারিক সমস্যা — ভেন চিত্র দিয়ে মোট নির্ণয়</CardTitle>
            <p style={{fontSize:13,color:'var(--text-3)',marginBottom:12}}>
              x = A∩B (ছেদ), c = A∪B এর বাইরের সংখ্যা
            </p>

            <div style={{display:'flex',flexWrap:'wrap',gap:16,alignItems:'center',marginBottom:14}}>
              {/* Venn diagram with regions labelled */}
              <svg width="190" height="130" viewBox="0 0 190 130" style={{flexShrink:0}}>
                <rect x="4" y="4" width="182" height="122" rx="8" fill="none" stroke="#f06d7e" strokeWidth="1.5"/>
                <text x="178" y="18" textAnchor="end" fill="#f06d7e" fontSize="11" fontWeight="700">U</text>
                <ellipse cx="72" cy="65" rx="48" ry="42" fill="rgba(91,164,245,.12)" stroke="#5ba4f5" strokeWidth="2"/>
                <ellipse cx="118" cy="65" rx="48" ry="42" fill="rgba(15,219,168,.12)" stroke="#0fdba8" strokeWidth="2"/>
                <text x="48" y="22" fill="#5ba4f5" fontSize="12" fontWeight="700">A</text>
                <text x="138" y="22" fill="#0fdba8" fontSize="12" fontWeight="700">B</text>
                {/* Region labels */}
                <text x="55" y="70" textAnchor="middle" fill="#5ba4f5" fontSize="13" fontWeight="800">A−x</text>
                <text x="95" y="70" textAnchor="middle" fill="#a78bfa" fontSize="13" fontWeight="800">x</text>
                <text x="135" y="70" textAnchor="middle" fill="#0fdba8" fontSize="13" fontWeight="800">B−x</text>
                <text x="168" y="115" textAnchor="middle" fill="#f06d7e" fontSize="13" fontWeight="800">c</text>
              </svg>

              {/* Region breakdown */}
              <div style={{flex:1,minWidth:140}}>
                {[
                  {label:'শুধু A', val:'= A − x', color:'var(--mf-blue)'},
                  {label:'শুধু B', val:'= B − x', color:'var(--mf-teal)'},
                  {label:'A∩B (ছেদ)', val:'= x', color:'var(--mf-violet)'},
                  {label:'বাইরে (Neither)', val:'= c', color:'var(--mf-rose)'},
                ].map(r => (
                  <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'5px 8px',borderRadius:6,marginBottom:4,background:'var(--elevated)',borderLeft:`3px solid ${r.color}`}}>
                    <span style={{fontSize:13,color:'var(--text-2)'}}>{r.label}</span>
                    <span style={{fontSize:13,fontWeight:700,color:r.color}}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:'rgba(240,108,126,.08)',borderRadius:10,padding:14,borderLeft:'3px solid var(--mf-rose)'}}>
              <div style={{fontSize:13,fontWeight:700,color:'var(--mf-rose)',marginBottom:8}}>মোট সমীকরণ</div>
              <FBox label="মোট (N)" val="= (A − x) + (B − x) + x + c" highlight/>
              <div style={{fontSize:12,color:'var(--text-3)',marginTop:8}}>
                সরলীকরণ: N = A + B − x + c
              </div>
            </div>

            <Mem title="💡 সমস্যা সমাধানের ধাপ" style={{marginTop:10}}>
              <ol style={{paddingLeft:18,lineHeight:2}}>
                <li>x = A∩B খুঁজে নাও (বা অজানা হলে চল রাশি ধরো)</li>
                <li>শুধু A = A − x, শুধু B = B − x লেখো</li>
                <li>সব অঞ্চল যোগ করো = মোট N</li>
                <li>সমীকরণ: N = (A−x) + x + (B−x) + c</li>
              </ol>
            </Mem>
          </Card>
        </div>

        {/* ══ S12: LCM & GCD ════════════════════════════════════ */}
        <div className="mf-section" id="lcm">
          <SectionHeader icon="÷" title="ল.সা.গু ও গ.সা.গু" sub="LCM (Lowest Common Multiple) · GCD / HCF (Greatest Common Divisor)" />
          <div className="mf-grid2">
            <Card color="teal">
              <CardTitle color="var(--mf-teal)">মূল সম্পর্ক</CardTitle>
              <FBox label="গুরুত্বপূর্ণ সম্পর্ক" val="সংখ্যাগুলোর গুণফল = ল.সা.গু × গ.সা.গু" highlight/>
              <FBox label="অতএব" val="একটি সংখ্যা = (ল.সা.গু × গ.সা.গু) / অপর সংখ্যা"/>
              <ul className="mf-prop-list" style={{marginTop:10}}>
                <li>সংখ্যাগুলোকে গ.সা.গু দিয়ে ভাগ করলে অনুপাত পাওয়া যায়</li>
                <li>অনুপাতে একটি সংখ্যার সাথে গ.সা.গু গুণ করলে সংখ্যা পাওয়া যায়</li>
              </ul>
            </Card>

            <Card color="blue">
              <CardTitle color="var(--mf-blue)">ভগ্নাংশের ল.সা.গু ও গ.সা.গু</CardTitle>
              <FBox label="ভগ্নাংশের ল.সা.গু" val="= লবগুলোর ল.সা.গু / হরগুলোর গ.সা.গু" highlight/>
              <FBox label="ভগ্নাংশের গ.সা.গু" val="= লবগুলোর গ.সা.গু / হরগুলোর ল.সা.গু"/>
              <Mem title="💡 মনে রাখার সহজ উপায়">
                <p><strong>ল.সা.গু:</strong> লব-এ ল, হর-এ গ<br/>
                <strong>গ.সা.গু:</strong> উল্টো — লব-এ গ, হর-এ ল</p>
              </Mem>
            </Card>
          </div>
        </div>

        {/* ══ S13: PROFIT / INTEREST ════════════════════════════ */}
        <div className="mf-section" id="profit">
          <SectionHeader icon="৳" title="সরল ও চক্রবৃদ্ধি মুনাফা" sub="Simple Interest · Compound Interest · Difference" />
          <div className="mf-grid2">
            <Card color="teal">
              <CardTitle color="var(--mf-teal)">সরল মুনাফা (Simple Interest)</CardTitle>
              <FBox label="সরল মুনাফা (I)" tex={"= \\dfrac{Pnr}{100}"}/>
              <FBox label="মোট পরিমাণ (A)" tex={"= P + I = P\\left(1 + \\dfrac{nr}{100}\\right)"} highlight/>
              <p style={{fontSize:12, color:'var(--text-3)', marginTop:6}}>
                P = মূলধন, n = বছর, r = বার্ষিক হার (%)
              </p>
            </Card>

            <Card color="gold">
              <CardTitle color="var(--mf-gold)">চক্রবৃদ্ধি মুনাফা (Compound Interest)</CardTitle>
              <FBox label="মোট পরিমাণ (A)" tex={"= P\\left(1 + \\dfrac{r}{100}\\right)^n"} highlight/>
              <FBox label="চক্রবৃদ্ধি মুনাফা" tex={"= A - P"}/>
              <p style={{fontSize:12, color:'var(--text-3)', marginTop:6}}>
                P = মূলধন, n = বছর, r = বার্ষিক হার (%)
              </p>
            </Card>
          </div>

          <Card color="rose" style={{marginTop:14}}>
            <CardTitle color="var(--mf-rose)">সরল ও চক্রবৃদ্ধি মুনাফার পার্থক্য</CardTitle>
            <div className="mf-legend" style={{marginBottom:12}}>
              <span><strong>P</strong> = মূলধন</span>
              <span><strong>r</strong> = হার ÷ 100 (দশমিকে)</span>
              <span><strong>n</strong> = বছর</span>
            </div>
            <div className="mf-grid2">
              <div>
                <FBox label="2 বছরের পার্থক্য" tex={"= Pr^2"} highlight/>
                <p style={{fontSize:12, color:'var(--text-3)', marginTop:4, textAlign:'center'}}>
                  যেমন: P=3000, r=10%=0.1 → 3000×0.01 = 30
                </p>
              </div>
              <div>
                <FBox label="3 বছরের পার্থক্য" tex={"= 3Pr^2 + Pr^3"} highlight/>
                <p style={{fontSize:12, color:'var(--text-3)', marginTop:4, textAlign:'center'}}>
                  যেমন: P=100, r=5%=0.05 → 3×100×0.0025 + 100×0.000125
                </p>
              </div>
            </div>
            <Mem title="💡 মনে রাখুন">
              <ul>
                <li>r সবসময় <strong>দশমিকে</strong> দাও — হার ÷ 100 (যেমন 5% → 0.05)</li>
                <li>2 বছর → শুধু <strong>Pr²</strong> (একটি পদ)</li>
                <li>3 বছর → <strong>3Pr² + Pr³</strong> (দুটি পদ)</li>
                <li>পার্থক্য = চক্রবৃদ্ধি − সরল মুনাফা</li>
              </ul>
            </Mem>
          </Card>
        </div>

        {/* Footer */}
        <div className="mf-footer">
          <p>গণিত সূত্র সংকলন · সব সূত্র একটি পৃষ্ঠায়</p>
          <p className="sub">জ্যামিতি · বীজগণিত · সেট তত্ত্ব · সম্ভাবনা · ধারা · বিন্যাস-সমাবেশ</p>
        </div>

      </div>
    </div>
  )
}

/* ── Helper components ───────────────────────── */

function SectionHeader({ icon, title, sub }) {
  return (
    <div className="mf-sec-header">
      <div className="mf-sec-icon" style={{background:'var(--elevated)'}}>{icon}</div>
      <div>
        <div className="mf-sec-title">{title}</div>
        <div className="mf-sec-sub">{sub}</div>
      </div>
    </div>
  )
}

function Card({ color = 'gold', children, style }) {
  return (
    <div className={`mf-card ${color}`} style={style}>
      {children}
    </div>
  )
}

function CardTitle({ color, badge, badgeStyle, children }) {
  return (
    <div className="mf-card-title" style={color ? {color} : {}}>
      {children}
      {badge && <span className="mf-badge" style={badgeStyle}>{badge}</span>}
    </div>
  )
}

function Tex({ children }) {
  const html = katex.renderToString(String(children), { throwOnError: false, displayMode: false })
  return <span className="mf-tex" dangerouslySetInnerHTML={{ __html: html }} />
}

function FBox({ label, val, tex, highlight }) {
  return (
    <div className={`mf-f-box${highlight ? ' highlight' : ''}`}>
      <span className="label">{label}</span>
      <span className="val">{tex ? <Tex>{tex}</Tex> : val}</span>
    </div>
  )
}

function Mem({ title, children, style }) {
  const label = title?.replace(/💡\s*/g, '')
  return (
    <div className="mf-mem" style={style}>
      <div className="mf-mem-title"><Lightbulb size={13} style={{ flexShrink: 0 }} />{label}</div>
      {children}
    </div>
  )
}

function Warn({ title, children, style }) {
  const label = title?.replace(/⚠️\s*/g, '')
  return (
    <div className="mf-warn" style={style}>
      <div className="mf-warn-title"><AlertTriangle size={13} style={{ flexShrink: 0 }} />{label}</div>
      {children}
    </div>
  )
}


function IdItem({ n, star, children }) {
  return (
    <div className="mf-id-item">
      <div className={`mf-id-num${star ? ' star' : ''}`}>{star ? '★' : n}</div>
      <div className="mf-id-text">{children}</div>
    </div>
  )
}

function StatBox({ val, label, color }) {
  return (
    <div style={{textAlign:'center',background:'var(--elevated)',borderRadius:8,padding:10}}>
      <div style={{fontSize:28,fontWeight:700,color}}>{val}</div>
      <div style={{fontSize:12,color:'var(--text-3)'}}>{label}</div>
    </div>
  )
}
