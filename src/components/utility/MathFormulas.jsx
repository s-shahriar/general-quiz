import katex from 'katex'
import 'katex/dist/katex.min.css'
import { AlertTriangle, ChevronLeft, LayoutGrid, Lightbulb } from 'lucide-react'
import { useEffect, useState } from 'react'
import CategorySidebar from '../CategorySidebar'
import './MathFormulas.css'

const SECTIONS = [
  { id: 'triangle',  label: 'ত্রিভুজ',           icon: '△', color: '#0d9488' },
  { id: 'trig',      label: 'ত্রিকোণমিতি',        icon: '√', color: '#1d4ed8' },
  { id: 'tri-center',label: 'ত্রিভুজ কেন্দ্র',   icon: '⊙', color: '#6d28d9' },
  { id: 'quad',      label: 'চতুর্ভুজ',            icon: '▭', color: '#be123c' },
  { id: 'circle',    label: 'বৃত্ত ও বহুভুজ',     icon: '○', color: '#b45309' },
  { id: 'solid',     label: 'ঘনবস্তু',             icon: '◧', color: '#0d9488' },
  { id: 'curved',    label: 'সিলিন্ডার·Cone',      icon: '⬡', color: '#1d4ed8' },
  { id: 'algebra',   label: 'বীজগণিত',             icon: '≡', color: '#6d28d9' },
  { id: 'line',      label: 'সরল রেখা',            icon: '∕', color: '#b45309' },
  { id: 'quadratic', label: 'দ্বিঘাত সমী.',        icon: 'x²', color: '#be123c' },
  { id: 'logarithm', label: 'লগারিদম',             icon: '㏒', color: '#0d9488' },
  { id: 'series',    label: 'ধারা',                icon: '∑', color: '#1d4ed8' },
  { id: 'pnc',       label: 'বিন্যাস-সমাবেশ',      icon: 'nPr', color: '#6d28d9' },
  { id: 'set',       label: 'সেট ও সম্ভাবনা',      icon: '∩', color: '#be123c' },
  { id: 'lcm',       label: 'ল.সা.গু-গ.সা.গু',    icon: '÷', color: '#b45309' },
  { id: 'profit',    label: 'মুনাফা',              icon: '৳', color: '#0d9488' },
  { id: 'percentage',label: 'শতকরা',               icon: '%', color: '#1d4ed8' },
  { id: 'unitary',   label: 'ঐকিক নিয়ম',           icon: '⚖', color: '#be123c' },
]

export default function MathFormulas({ onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id)

  useEffect(() => {
    const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        setActiveSectionId(e.target.id)
      })
    }, { rootMargin: '-20% 0px -65% 0px' })

    sectionEls.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const topics = SECTIONS.map(s => ({
    id: s.id,
    name: s.label,
    icon: () => <span style={{ fontSize: 14, fontWeight: 'bold' }}>{s.icon}</span>,
    color: s.color
  }))

  return (
    <div className="mf-root">
      <CategorySidebar
        topics={topics}
        currentTopicId={activeSectionId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(t) => scrollTo(t.id)}
      />

      <div className="mf-wrap">
        {/* Top bar */}
        <div className="mf-topbar">
          <button className="back-btn" onClick={onBack}>
            <ChevronLeft size={15} /> হোম
          </button>
          <span className="mf-topbar-title">গণিত সূত্র সংকলন</span>
          <div className="topbar-right-actions" style={{ marginLeft: 'auto' }}>
            <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse categories">
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Section picker grid */}
        <div className="mf-sec-picker">
          {SECTIONS.map(s => (
            <button key={s.id} className="mf-sec-tile" onClick={() => scrollTo(s.id)}>
              <span className="mf-sec-tile-icon">{s.icon}</span>
              <span className="mf-sec-tile-label">{s.label}</span>
            </button>
          ))}
        </div>

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
              
            </Card>

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
              <div style={{marginTop:12,paddingTop:10,borderTop:'1px solid var(--border-dim)'}}>
                <div style={{fontWeight:700,marginBottom:6,fontSize:13,color:'var(--mf-violet)'}}>সর্বসমতার শর্ত (Congruence)</div>
                <div className="mf-legend" style={{marginBottom:6}}>
                  <span style={{fontSize:11}}><strong>SAS</strong></span>
                  <span style={{fontSize:11}}><strong>SSS</strong></span>
                  <span style={{fontSize:11}}><strong>ASA</strong></span>
                  <span style={{fontSize:11}}><strong>AAS</strong></span>
                  <span style={{fontSize:11}}><strong>RHS</strong></span>
                </div>
                <ul className="mf-prop-list" style={{fontSize:12}}>
                  <li><span className="mf-tag g" style={{fontSize:10}}>SAS</span> দুই বাহু ও অন্তর্ভুক্ত কোণ</li>
                  <li><span className="mf-tag g" style={{fontSize:10}}>SSS</span> তিন বাহু সমান</li>
                  <li><span className="mf-tag g" style={{fontSize:10}}>RHS</span> সমকোণী: অতিভুজ ও বাহু</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* ══ S-TRIG: TRIGONOMETRY ══════════════════════════════ */}
        <div className="mf-section" id="trig">
          <SectionHeader icon="√" title="ত্রিকোণমিতি — √ কৌশল" sub="sin · cos · tan — শুধু √0, 1, 2, 3, 4 মনে রাখো, ভাগ করো 2 দিয়ে" />

          {/* Trick overview */}
          <Card color="teal" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-teal)">কৌশল: মাত্র একটি সিকোয়েন্স মনে রাখো</CardTitle>
            <div style={{display:'flex', flexWrap:'wrap', gap:12, margin:'12px 0'}}>
              <div style={{flex:1, minWidth:140, background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-teal)'}}>
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
              <div style={{flex:1, minWidth:140, background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-blue)'}}>
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
              <div style={{flex:1, minWidth:140, background:'#ffffff', border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', borderLeft:'3px solid var(--mf-rose)'}}>
                <div style={{fontWeight:700, color:'var(--mf-rose)', marginBottom:10, fontSize:13}}>tan = sin ÷ cos</div>
                <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:8}}>
                  {['0','1/√3','1','√3','∞'].map((v,i) => (
                    <span key={i} style={{fontWeight:700, color:'var(--mf-rose)', fontSize:14, fontFamily:"'Space Grotesk',sans-serif"}}>{v}{i < 4 ? <span style={{color:'var(--text-dim)', fontWeight:400}}>, </span> : ''}</span>
                  ))}
                </div>
                <div style={{fontSize:12, color:'var(--text-3)'}}>tan = <strong style={{color:'var(--mf-rose)'}}>sin θ ÷ cos θ</strong></div>
              </div>
            </div>
            
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
              
            </Card>
          </div>
          
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
              
            </Card>
          </div>
        </div>

        {/* ══ S6: 3D SOLID ══════════════════════════════════════ */}
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
                <tr><th>বৈশিষ্ট্য</th><th>ঘনক (Cube) — বাহু a</th><th>ঘনবস্তু / আয়তাকার ঘনবস্তু — a, b, c</th></tr>
              </thead>
              <tbody>
                <tr><td>আয়তন</td><td className="hl">a³</td><td className="hl">a × b × c</td></tr>
                <tr><td>একটি তলের ক্ষেত্রফল</td><td className="hl">a²</td><td className="hl">ab বা bc বা ca</td></tr>
                <tr><td>সমগ্র পৃষ্ঠতল</td><td className="hl">6a²</td><td className="hl">2(ab + bc + ca)</td></tr>
                <tr><td>একটি তলের কর্ণ</td><td className="hl">√2 · a</td><td className="hl">√(a²+b²) ইত্যাদি</td></tr>
                <tr><td>মহাকর্ণ / হেলান তলের উন্নতি</td><td className="hl">√3 · a</td><td className="hl">√(a² + b² + c²)</td></tr>
              </tbody>
            </table></div>
            
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

          <div className="mf-grid2">
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
                <div style={{background:'#ffffff',border:'1px solid #e2e8f0',borderRadius:8,padding:10,borderLeft:'3px solid #f0a500'}}>
                  <div style={{color:'var(--mf-gold)',fontWeight:700,marginBottom:6}}>গোলক</div>
                  <div style={{color:'var(--text-2)',marginBottom:3}}>আয়তন = <span style={{color:'#000000'}}>⁴⁄₃πr³</span></div>
                  <div style={{color:'var(--text-2)'}}>পৃষ্ঠতল = <span style={{color:'#000000'}}>4πr²</span></div>
                </div>
                <div style={{background:'#ffffff',border:'1px solid #e2e8f0',borderRadius:8,padding:10,borderLeft:'3px solid #a78bfa'}}>
                  <div style={{color:'var(--mf-violet)',fontWeight:700,marginBottom:6}}>অর্ধগোলক</div>
                  <div style={{color:'var(--text-2)',marginBottom:3}}>আয়তন = <span style={{color:'#000000'}}>⅔πr³</span></div>
                  <div style={{color:'var(--text-2)',marginBottom:3}}>বক্রপৃষ্ঠ = <span style={{color:'#000000'}}>2πr²</span></div>
                  <div style={{color:'var(--text-2)'}}>সমগ্র = <span style={{color:'#000000'}}>3πr²</span></div>
                </div>
              </div>
              
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
          
        </div>

        {/* ══ S8: ALGEBRA ════════════════════════════════════════ */}
        <div className="mf-section" id="algebra">
          <SectionHeader icon="≡" title="বীজগণিতীয় সূত্রাবলি" sub="Algebraic Identities" />
          <div className="mf-grid2">
            <Card color="rose">
              <CardTitle>বর্গ সংক্রান্ত সূত্র (Square Identities)</CardTitle>
              <div className="mf-id-list">
                <IdItem n="1"><Tex>{"(a+b)^2 = (a-b)^2 + 4ab"}</Tex></IdItem>
                <IdItem n="2"><Tex>{"(a-b)^2 = (a+b)^2 - 4ab"}</Tex></IdItem>
                <IdItem n="3"><Tex>{"a^2 + b^2 = (a+b)^2 - 2ab"}</Tex></IdItem>
                <IdItem n="4"><Tex>{"a^2 + b^2 = (a-b)^2 + 2ab"}</Tex></IdItem>
                <IdItem n="5"><Tex>{"2(a^2+b^2) = (a+b)^2 + (a-b)^2"}</Tex></IdItem>
                <IdItem n="6"><Tex>{"4ab = (a+b)^2 - (a-b)^2"}</Tex></IdItem>
                <IdItem n="7"><Tex>{"ab = \\left[\\dfrac{a+b}{2}\\right]^2 - \\left[\\dfrac{a-b}{2}\\right]^2"}</Tex></IdItem>
              </div>
            </Card>

            <Card color="violet">
              <CardTitle color="var(--mf-violet)">তিন পদ ও ঘন সংক্রান্ত সূত্র</CardTitle>
              <div className="mf-id-list">
                <IdItem n="8"><Tex>{"(a+b+c)^2 = a^2+b^2+c^2+2(ab+bc+ca)"}</Tex></IdItem>
                <IdItem n="9"><Tex>{"(x+a)(x+b) = x^2+(a+b)x+ab"}</Tex></IdItem>
                <IdItem n="10"><Tex>{"(a+b)^3 = a^3+3a^2b+3ab^2+b^3"}</Tex></IdItem>
                <IdItem n="11"><Tex>{"(a-b)^3 = a^3-3a^2b+3ab^2-b^3"}</Tex></IdItem>
                <IdItem n="12"><Tex>{"a^3+b^3 = (a+b)(a^2-ab+b^2)"}</Tex></IdItem>
                <IdItem n="13"><Tex>{"a^3-b^3 = (a-b)(a^2+ab+b^2)"}</Tex></IdItem>
              </div>
            </Card>
          </div>
        </div>

        {/* ══ STRAIGHT LINE ════════════════════════════════════════ */}
        <div className="mf-section" id="line">
          <SectionHeader icon="∕" title="সরল রেখা" sub="Straight Line · Slope · Forms · Parallel & Perpendicular" />

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:12}}>
            <Card color="blue">
              <CardTitle color="var(--mf-blue)">মূল সূত্রসমূহ</CardTitle>
              {[
                { label: 'মিডপয়েন্ট',   tex: "\\left(\\tfrac{x_1+x_2}{2},\\;\\tfrac{y_1+y_2}{2}\\right)" },
                { label: 'দূরত্ব',        tex: "\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}" },
                { label: 'ঢাল (Slope)',   tex: "m = \\tan\\theta = \\tfrac{y_2-y_1}{x_2-x_1}" },
              ].map(({label, tex}) => (
                <div key={label} className="mf-f-box" style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,padding:'7px 10px',margin:'5px 0'}}>
                  <span className="label" style={{fontSize:12,whiteSpace:'nowrap'}}>{label}</span>
                  <span className="val" style={{textAlign:'right',width:'auto'}}><Tex>{tex}</Tex></span>
                </div>
              ))}
            </Card>

            <Card color="teal">
              <CardTitle color="var(--mf-teal)">রেখার বিভিন্ন রূপ (Forms)</CardTitle>
              {[
                { label: 'Slope-intercept', tex: "y = mx + c" },
                { label: 'Intercept form',  tex: "\\tfrac{x}{a} + \\tfrac{y}{b} = 1" },
                { label: 'Standard form',   tex: "ax + by + c = 0" },
                { label: 'দুই বিন্দু দিয়ে', tex: "\\tfrac{y-y_1}{y_2-y_1} = \\tfrac{x-x_1}{x_2-x_1}" },
              ].map(({label, tex}) => (
                <div key={label} className="mf-f-box" style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,padding:'7px 10px',margin:'5px 0'}}>
                  <span className="label" style={{fontSize:12,whiteSpace:'nowrap'}}>{label}</span>
                  <span className="val" style={{textAlign:'right',width:'auto'}}><Tex>{tex}</Tex></span>
                </div>
              ))}
            </Card>

            <Card color="violet">
              <CardTitle color="var(--mf-violet)">সমান্তরাল রেখা (Parallel)</CardTitle>
              <p style={{fontSize:12,color:'var(--text-3)',marginBottom:10}}>
                দুই রেখা <strong>a₁x + b₁y + c₁ = 0</strong> ও <strong>a₂x + b₂y + c₂ = 0</strong> সমান্তরাল হলে:
              </p>
              <div style={{padding:'12px 14px',borderRadius:10,background:'#ffffff',border:'1px solid #e2e8f0'}}>
                <div style={{fontSize:15,marginBottom:8}}><Tex>{"\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\neq \\dfrac{c_1}{c_2}"}</Tex></div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',fontSize:12,color:'var(--text-3)'}}>
                  <span>উদা: 3x+2ky−7=0 ∥ 2x+5y+1=0 হলে</span>
                  <code style={{background:'rgba(167,139,250,.15)',padding:'2px 7px',borderRadius:5,color:'var(--mf-violet)',fontWeight:700}}>3/2 = 2k/5</code>
                  <span>→ k = 15/4</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ══ QUADRATIC EQUATIONS ═══════════════════════════════ */}
        <div className="mf-section" id="quadratic">
          <SectionHeader icon="x²" title="দ্বিঘাত সমীকরণ" sub="Quadratic Equation · Roots · Discriminant" />

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:12}}>
            <Card color="blue">
              <CardTitle color="var(--mf-blue)">মানক রূপ: ax² + bx + c = 0 <span style={{fontWeight:400,fontSize:12,color:'var(--text-3)'}}>(α, β = দুটি মূল)</span></CardTitle>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:10}}>
                {[
                  "\\alpha+\\beta = -\\tfrac{b}{a}",
                  "\\alpha\\beta = \\tfrac{c}{a}",
                  "D = b^2-4ac",
                ].map(tex => (
                  <div key={tex} className="mf-f-box highlight" style={{flex:'1 1 auto',alignItems:'center',justifyContent:'center',padding:'8px 12px',margin:0,textAlign:'center',minWidth:0}}>
                    <span className="val"><Tex>{tex}</Tex></span>
                  </div>
                ))}
              </div>
              <div className="mf-f-box highlight" style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,padding:'10px 14px',margin:0}}>
                <span className="val"><Tex>{"x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"}</Tex></span>
              </div>
            </Card>

            <Card color="gold">
              <CardTitle>④ D ও মূলের প্রকৃতি</CardTitle>
              <div style={{display:'flex',flexDirection:'column',gap:7}}>
                {[
                  {cond:'D > 0',          desc:'বাস্তব ও অসমান',   border:'#e2e8f0',  tc:'var(--mf-teal)'  },
                  {cond:'D = 0',          desc:'বাস্তব ও সমান',    border:'#e2e8f0',   tc:'var(--mf-gold2)' },
                  {cond:'D < 0',          desc:'জটিল (কাল্পনিক)', border:'#e2e8f0',   tc:'var(--mf-rose)'  },
                  {cond:'D > 0, পূর্ণবর্গ',desc:'মূলদ (Rational)', border:'#e2e8f0', tc:'var(--mf-violet)'},
                ].map(r => (
                  <div key={r.cond} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:9,background:'#ffffff',border:`1px solid ${r.border}`}}>
                    <code style={{fontWeight:800,fontSize:13,color:r.tc,minWidth:100,whiteSpace:'nowrap'}}>{r.cond}</code>
                    <span style={{color:'var(--text-1)',fontSize:13,fontWeight:600}}>→ {r.desc}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card color="violet">
              <CardTitle color="var(--mf-violet)">⑤ মূল থেকে সমীকরণ</CardTitle>
              <FBox label="" tex={"x^2 - (\\alpha+\\beta)\\,x + \\alpha\\beta = 0"} highlight/>
              <p style={{fontSize:12,color:'var(--text-3)',marginTop:8}}><strong>x² − (সমষ্টি)x + (গুণফল) = 0</strong></p>
              <p style={{fontSize:12,color:'var(--text-3)',marginTop:4}}>মূল ৩ ও ৪ হলে: x² − 7x + 12 = 0</p>
            </Card>
          </div>
        </div>

        {/* ══ LOGARITHM ══════════════════════════════════════════ */}
        <div className="mf-section" id="logarithm">
          <SectionHeader icon="㏒" title="লগারিদম" sub="Logarithm — Properties & Rules" />

          <div className="mf-grid2">
            <Card color="teal">
              <CardTitle color="var(--mf-teal)">মূল সূত্রসমূহ</CardTitle>
              {[
                { tex: "\\log_a 1 = 0",              note: "যেকোনো ভিত্তিতে' log(1) = 0"    },
                { tex: "\\log_a a = 1",              note: "নিজের ভিত্তিতে log = 1"         },
                { tex: "\\log_a M = n \\Leftrightarrow a^n = M", note: "মূল সংজ্ঞা"        },
                { tex: "a^{\\log_a b} = b",          note: ""                                },
              ].map(({tex, note}) => (
                <div key={tex} className="mf-log-row">
                  <span className="mf-log-tex"><Tex>{tex}</Tex></span>
                  {note && <span className="mf-log-note">{note}</span>}
                </div>
              ))}
              
            </Card>

            <Card color="violet">
              <CardTitle color="var(--mf-violet)">Chain Rule — কোনাকুনি বাতিল হয়</CardTitle>
              {[
                { tex: "\\log_a b \\times \\log_b c = \\log_a c",  note: "b বাতিল"  },
                { tex: "\\log_p q \\times \\log_m p = \\log_m q",  note: "p বাতিল"  },
              ].map(({tex, note}) => (
                <div key={tex} className="mf-log-row highlight">
                  <span className="mf-log-tex"><Tex>{tex}</Tex></span>
                  <span className="mf-log-badge">{note}</span>
                </div>
              ))}
              <p style={{fontSize:12,color:'var(--text-3)',marginTop:10,lineHeight:1.7}}>
                মাঝের ভিত্তি কোনাকুনিভাবে বাতিল হয়।<br/>
                log₂ 3 × log₃ 5 × log₅ 8 <strong>= log₂ 8 = 3</strong>
              </p>
            </Card>
          </div>
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
              <div className="mf-series-card" style={{borderLeft:'3px solid #f06d7e', background:'#ffffff', border:'1px solid #e2e8f0'}}>
                <div className="step">অশীম পদের সমষ্টি (S∞) — শর্ত: <strong style={{color:'var(--mf-rose)'}}>−1 &lt; r &lt; 1</strong></div>
                <div className="formula"><Tex>{"S_\\infty = \\dfrac{a}{1-r}"}</Tex></div>
                <div style={{fontSize:12, color:'var(--text-3)', marginTop:8, lineHeight:1.6}}>
                  <strong style={{color:'var(--mf-rose)'}}>অশীম ধারা</strong> = যে ধারার শেষ নেই (∞ পদ)<br/>
                  যেমন: <strong>1 + 0.1 + 0.01 + 0.001 + ...</strong> → r = 0.1, শেষ নেই কিন্তু যোগফল আছে<br/>
                  এই সূত্র শুধু তখনই কাজ করে যখন <strong>|r| &lt; 1</strong> (r এর মান −1 থেকে 1 এর মধ্যে)
                </div>
              </div>
              
            </Card>
          </div>
        </div>

        {/* ══ S10: PERMUTATION & COMBINATION ════════════════════ */}
        <div className="mf-section" id="pnc">
          <SectionHeader icon="nPr" title="বিন্যাস ও সমাবেশ" sub="Permutation · Combination · Graph Theory" />

          {/* Quick Decision Guide */}
          <Card color="blue" style={{marginBottom:16}}>
            <CardTitle color="var(--mf-blue)">🎯 কখন কোনটি ব্যবহার করবেন?</CardTitle>

            {/* All 4 in one row on desktop, stacks on mobile */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:16}}>
              {/* nPr */}
              <div style={{background:'white',border:'2px solid #6d28d9',borderRadius:10,padding:16}}>
                <div style={{fontSize:18,fontWeight:700,color:'#6d28d9',marginBottom:10}}>nPr বিন্যাস</div>
                <div style={{fontSize:13,color:'#4b5563',lineHeight:1.7,marginBottom:10}}>
                  জায়গা বদলালে নতুন কিছু তৈরি হয়
                </div>
                <div style={{fontSize:11,color:'#6b7280',lineHeight:1.6}}>
                  পদের ক্রম • পাসওয়ার্ড • বসার ব্যবস্থা • দৌড়
                </div>
              </div>

              {/* nCr */}
              <div style={{background:'white',border:'2px solid #0fdba8',borderRadius:10,padding:16}}>
                <div style={{fontSize:18,fontWeight:700,color:'#0fdba8',marginBottom:10}}>nCr সমাবেশ</div>
                <div style={{fontSize:13,color:'#4b5563',lineHeight:1.7,marginBottom:10}}>
                  জায়গা বদলালে কিছু হয় না
                </div>
                <div style={{fontSize:11,color:'#6b7280',lineHeight:1.6}}>
                  দল গঠন • কমিটি • মেনু থেকে বাছাই • হ্যান্ডশেক
                </div>
              </div>

              {/* AND / × */}
              <div style={{background:'white',border:'2px solid #f0a500',borderRadius:10,padding:16}}>
                <div style={{fontSize:18,fontWeight:700,color:'#f0a500',marginBottom:10}}>× গুণ</div>
                <div style={{fontSize:13,color:'#4b5563',lineHeight:1.7,marginBottom:10}}>
                  এবং (AND) — দুটি কাজ একসাথে হবে
                </div>
                <div style={{fontSize:11,color:'#6b7280',lineHeight:1.6}}>
                  পুরুষ <strong>ও</strong> মহিলা দুজনকেই<br/>
                  প্রথমে এটা, তারপর ওটা
                </div>
              </div>

              {/* OR / + */}
              <div style={{background:'white',border:'2px solid #0fdba8',borderRadius:10,padding:16}}>
                <div style={{fontSize:18,fontWeight:700,color:'#0fdba8',marginBottom:10}}>+ যোগ</div>
                <div style={{fontSize:13,color:'#4b5563',lineHeight:1.7,marginBottom:10}}>
                  অথবা (OR) — যেকোনো একটি হবে
                </div>
                <div style={{fontSize:11,color:'#6b7280',lineHeight:1.6}}>
                  পুরুষ <strong>অথবা</strong> মহিলা যেকেউ<br/>
                  হয় এই উপায়, নয় ওই উপায়
                </div>
              </div>
            </div>
          </Card>

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
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:8, marginTop:8}}>
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

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:12}}>
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
              
            </Card>

            <Card color="violet">
              <CardTitle color="var(--mf-violet)">সম্ভাবনা (Probability)</CardTitle>
              <div className="mf-prob-item"><div className="cond">A ও B স্বাধীন (Independent)</div><div className="form">P(A∩B) = P(A) · P(B)</div></div>
              <div className="mf-prob-item"><div className="cond">A ও B বর্জনশীল (Mutually Exclusive)</div><div className="form">P(A∪B) = P(A) + P(B)</div></div>
              <div className="mf-prob-item"><div className="cond">A ও B সাধারণ ঘটনা</div><div className="form">P(A∪B) = P(A) + P(B) − P(A∩B)</div></div>
              <div className="mf-prob-item"><div className="cond">স্বাধীন ঘটনার Union</div><div className="form">P(A∪B) = P(A) + P(B) − P(A)·P(B)</div></div>
              <div className="mf-prob-item"><div className="cond">n বার টস ফেলার ফলাফল</div><div className="form">2<sup>n</sup> (প্রতিবারে 2টি ফলাফল)</div></div>
              <div className="mf-prob-item"><div className="cond">m বার ছক্কা মারার ফলাফল</div><div className="form">6<sup>m</sup> (প্রতিবারে 6টি ফলাফল)</div></div>
              <div className="mf-prob-item"><div className="cond">টস ও ছক্কা একসাথে</div><div className="form">2<sup>n</sup> × 6<sup>m</sup></div></div>
              <div className="mf-prob-item"><div className="cond">শর্তাধীন — A ঘটলে B এর সম্ভাবনা</div><div className="form">P(B|A) = P(A∩B) / P(A)</div></div>
              <div className="mf-prob-item"><div className="cond">A না ঘটার সম্ভাবনা</div><div className="form">P(A') = 1 − P(A)</div></div>
              <div className="mf-prob-item"><div className="cond">P(A'∩B')</div><div className="form">= P((A∪B)') = 1 − P(A∪B)</div></div>
              <div className="mf-prob-item"><div className="cond">P(A'∪B')</div><div className="form">= P((A∩B)') = 1 − P(A∩B)</div></div>
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

          <div className="mf-grid2" style={{marginTop:14}}>
            <Card color="violet">
              <CardTitle color="var(--mf-violet)">বিশেষ সূত্র</CardTitle>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{padding:'10px 12px',borderRadius:9,background:'#ffffff',border:'1px solid #e2e8f0',textAlign:'center'}}>
                  <div style={{fontSize:12,color:'var(--mf-violet)',fontWeight:700,marginBottom:6}}>সুদে-আসলে n গুণ হলে সুদের হার</div>
                  <div style={{textAlign:'center',marginBottom:6}}><Tex>{"r = \\dfrac{n-1}{\\text{time}} \\times 100\\%"}</Tex></div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>উদা: 5 বছরে 3 গুণ হলে → r = (3−1)/5 × 100 = <strong>40%</strong></div>
                </div>
                <div style={{padding:'10px 12px',borderRadius:9,background:'#ffffff',border:'1px solid #e2e8f0',textAlign:'center'}}>
                  <div style={{fontSize:12,color:'var(--mf-teal)',fontWeight:700,marginBottom:4}}>n বছরে দ্বিগুণ হলে, তিন গুণ হতে লাগবে</div>
                  <div style={{fontSize:15,fontWeight:700,color:'#000000',marginBottom:4,textAlign:'center'}}>2n বছর</div>
                  <div style={{fontSize:11,color:'var(--text-3)',textAlign:'center'}}>উদা: 4 বছরে দ্বিগুণ → তিন গুণ হতে 8 বছর</div>
                </div>
                <div style={{padding:'10px 12px',borderRadius:9,background:'#ffffff',border:'1px solid #e2e8f0',textAlign:'center'}}>
                  <div style={{fontSize:12,color:'var(--mf-gold2)',fontWeight:700,marginBottom:6}}>চক্রবৃদ্ধি — ধাপে ধাপে গুণ</div>
                  <div style={{textAlign:'center',marginBottom:6}}><Tex>{"C = P\\left(1+\\dfrac{r}{100}\\right)^t"}</Tex></div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>উদা: P=100, r=5%, t=2 → 100 × <strong>105/100 × 105/100</strong> = 110.25</div>
                </div>
              </div>
            </Card>

            <Card color="rose">
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
              
            </Card>
          </div>
        </div>

        {/* ══ PERCENTAGE ═══════════════════════════════════════ */}
        <div className="mf-section" id="percentage">
          <SectionHeader icon="%" title="শতকরা" sub="Percentage · Successive Change · Comparative" />

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:12}}>

            {/* Card 1: Successive % */}
            <Card color="blue">
              <CardTitle color="var(--mf-blue)">দুটি ক্রমিক পরিবর্তন (Successive %)</CardTitle>
              <div style={{textAlign:'center',margin:'8px 0 12px'}}>
                <Tex>{"\\left(a + b + \\dfrac{ab}{100}\\right)\\%"}</Tex>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:5,fontSize:12}}>
                {[
                  { shape:'ত্রিভুজ — ভূমি a%, উচ্চতা b% পরিবর্তন',  formula:'ক্ষেত্রফল → (a+b+ab/100)%',    color:'var(--mf-blue)',   bg:'rgba(91,164,245,.08)',   border:'rgba(91,164,245,.25)' },
                  { shape:'আয়তক্ষেত্র — দৈর্ঘ্য a%, প্রস্থ b% পরিবর্তন', formula:'ক্ষেত্রফল → (a+b+ab/100)%', color:'var(--mf-teal)',  bg:'rgba(15,219,168,.08)',   border:'rgba(15,219,168,.25)' },
                  { shape:'বর্গ — বাহু r% পরিবর্তন',                  formula:'ক্ষেত্রফল → (2r+r²/100)%  [a=b=r]', color:'var(--mf-violet)', bg:'rgba(167,139,250,.08)', border:'rgba(167,139,250,.25)' },
                  { shape:'বৃত্ত — ব্যাসার্ধ r% পরিবর্তন',            formula:'ক্ষেত্রফল → (2r+r²/100)%  [a=b=r]', color:'var(--mf-gold2)',  bg:'rgba(240,165,0,.08)',    border:'rgba(240,165,0,.25)'  },
                  { shape:'দাম/বেতন/আয় — পরপর দুটো পরিবর্তন',        formula:'নতুন মান → (a+b+ab/100)%',  color:'var(--text-2)',    bg:'rgba(167,139,250,.05)', border:'rgba(167,139,250,.15)' },
                ].map(r => (
                  <div key={r.shape} style={{padding:'6px 10px',borderRadius:7,background:r.bg,border:`1px solid ${r.border}`}}>
                    <div style={{color:r.color,fontWeight:700,marginBottom:2}}>{r.shape}</div>
                    <div style={{color:'var(--text-3)',fontSize:11}}>{r.formula}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Card 2: Price change → quantity */}
            <Card color="teal">
              <CardTitle color="var(--mf-teal)">দাম/আয় পরিবর্তন সূত্র</CardTitle>
              <p style={{fontSize:12,color:'var(--text-3)',marginBottom:10}}>
                দাম বাড়লে কম কিনতে হয়, বা ক বেশি হলে খ তুলনায় কম — একই সূত্র, context ভিন্ন
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(240,108,126,.08)',border:'1px solid rgba(240,108,126,.25)'}}>
                  <div style={{fontSize:12,color:'var(--mf-rose)',fontWeight:700,marginBottom:6}}>
                    r% <strong>বাড়লে</strong> → কত% <strong>কম</strong> হবে?
                  </div>
                  <div style={{textAlign:'center',margin:'4px 0'}}><Tex>{"\\dfrac{100r}{100+r}\\%"}</Tex></div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>উদা: দাম 25% বাড়লে কিনতে হবে 100×25/125 = <strong>20% কম</strong></div>
                </div>
                <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(15,219,168,.08)',border:'1px solid rgba(15,219,168,.25)'}}>
                  <div style={{fontSize:12,color:'var(--mf-teal)',fontWeight:700,marginBottom:6}}>
                    r% <strong>কমলে</strong> → কত% <strong>বেশি</strong> হবে?
                  </div>
                  <div style={{textAlign:'center',margin:'4px 0'}}><Tex>{"\\dfrac{100r}{100-r}\\%"}</Tex></div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:5}}>উদা: দাম 20% কমলে কিনতে পারবে 100×20/80 = <strong>25% বেশি</strong></div>
                </div>
                <div style={{fontSize:11,color:'var(--text-3)',padding:'5px 8px',background:'rgba(167,139,250,.06)',border:'1px solid rgba(167,139,250,.15)',borderRadius:6}}>
                  💡 বাড়লে → (100+r) হর-এ &nbsp;|&nbsp; কমলে → (100−r) হর-এ
                </div>
              </div>
            </Card>

          </div>
        </div>

        {/* ══ UNITARY METHOD ════════════════════════════════════ */}
        <div className="mf-section" id="unitary">
          <SectionHeader icon="⚖" title="ঐকিক নিয়ম" sub="Unitary Method · Work-Time · Average Speed" />
          
          <div className="mf-grid2">
            <Card color="rose">
              <CardTitle color="var(--mf-rose)">কাজ-সময় সূত্র (Work-Time Formula)</CardTitle>
              <div className="mf-eq-box">
                <Tex>{"\\dfrac{M_1 D_1 H_1}{W_1} = \\dfrac{M_2 D_2 H_2}{W_2}"}</Tex>
              </div>
              <div style={{fontSize:13,color:'var(--text-3)',lineHeight:1.7}}>
                <p>যেখানে:</p>
                <ul style={{marginTop:6,marginLeft:18}}>
                  <li><strong style={{color:'var(--mf-rose)'}}>M</strong> = মানুষ (Man/People)</li>
                  <li><strong style={{color:'var(--mf-rose)'}}>D</strong> = দিন (Day)</li>
                  <li><strong style={{color:'var(--mf-rose)'}}>H</strong> = সময় (Time/Hours)</li>
                  <li><strong style={{color:'var(--mf-rose)'}}>W</strong> = কাজ (Work)</li>
                </ul>
              </div>
              
            </Card>

            <Card color="teal">
              <CardTitle color="var(--mf-teal)">গড় বেগ (Average Speed)</CardTitle>
              <div className="mf-eq-box">
                <Tex>{"V_{avg} = \\dfrac{2xy}{x+y}"}</Tex>
              </div>
              <div style={{fontSize:13,color:'var(--text-3)',lineHeight:1.7}}>
                <p>যেখানে <strong style={{color:'var(--mf-teal)'}}>x</strong> ও <strong style={{color:'var(--mf-teal)'}}>y</strong> হলো দুটি বেগ (একই দূরত্ব দুটি ভিন্ন বেগে অতিক্রম করলে)</p>
                <p style={{marginTop:6}}>উদা: যাওয়া 40 km/h, আসা 60 km/h → গড় বেগ = <strong>2×40×60 / (40+60) = 48 km/h</strong></p>
              </div>
            </Card>

            <Card color="violet">
              <CardTitle color="var(--mf-violet)">নল ও চৌবাচ্চা (Pipes and Cisterns)</CardTitle>
              <div style={{fontSize:13,color:'var(--text-3)',lineHeight:1.7,marginBottom:12}}>
                <p>যদি দুটি নল দ্বারা একটি চৌবাচ্চা যথাক্রমে <strong style={{color:'var(--mf-violet)'}}>t₁</strong> ও <strong style={{color:'var(--mf-violet)'}}>t₂</strong> সময়ে পূর্ণ হয়, তবে নল দুটি একসাথে খোলা থাকলে চৌবাচ্চাটি পূর্ণ হতে সময় লাগবে:</p>
                <div className="mf-eq-box">
                  <Tex>{"\\dfrac{t_1 t_2}{t_1 + t_2}"}</Tex>
                </div>
                <p>যদি একটি নল দ্বারা একটি চৌবাচ্চা <strong style={{color:'var(--mf-violet)'}}>t₁</strong> সময়ে পূর্ণ হয় এবং অন্য একটি নল দ্বারা <strong style={{color:'var(--mf-violet)'}}>t₂</strong> সময়ে খালি হয়, তবে নল দুটি একসাথে খোলা থাকলে চৌবাচ্চাটি পূর্ণ হতে সময় লাগবে:</p>
                <div className="mf-eq-box">
                  <Tex>{"\\dfrac{t_1 t_2}{t_1 - t_2}"}</Tex>
                </div>
              </div>
            </Card>
          </div>
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
