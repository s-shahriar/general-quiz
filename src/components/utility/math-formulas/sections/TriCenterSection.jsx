import { Card, CardTitle, Mem, SectionHeader } from '../MathFormulaHelpers'

export default function TriCenterSection() {
  return (
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
  )
}
