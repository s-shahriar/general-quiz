import { SectionHeader, Card, CardTitle, FBox, Mem, IdItem } from '../MathFormulaHelpers'

const exBox = { background:'var(--elevated)', borderRadius:8, padding:'7px 11px', marginTop:7, fontSize:12.5, color:'var(--text-2)', lineHeight:1.6 }
const stepRow = { marginTop:3, paddingLeft:6 }
const whyRow = { marginTop:7, paddingLeft:8, borderLeft:'2px solid var(--mf-gold)', fontSize:12, color:'var(--text-3)' }
const ldWrap = { display:'inline-block', margin:'6px 0 3px 10px', fontSize:12.5, color:'var(--text-1)' }
const ldGutter = { minWidth:52, textAlign:'right', whiteSpace:'nowrap', paddingRight:1 }

function LdRow({ gutter='', t, over, under }) {
  const inSpan = (i, r) => r && i >= r[0] && i <= r[1]
  return (
    <div style={{display:'flex'}}>
      <span style={ldGutter}>{gutter}</span>
      {[...t].map((ch, i) => (
        <span key={i} style={{
          width:11, textAlign:'center', lineHeight:'19px',
          borderTop: inSpan(i, over) ? '1px solid var(--text-3)' : undefined,
          borderBottom: inSpan(i, under) ? '1px solid var(--text-3)' : undefined,
        }}>{ch === ' ' ? '\u00a0' : ch}</span>
      ))}
    </div>
  )
}

function LongDivision({ divisor, dividend, quotient, over, rows }) {
  return (
    <div style={ldWrap}>
      <LdRow t={quotient} over={over} />
      <LdRow gutter={divisor + ')'} t={dividend} />
      {rows.map((r, i) => <LdRow key={i} t={r.t} under={r.under} />)}
    </div>
  )
}

export default function LcmSection() {
  return (
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

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">কতগুলো সংখ্যা ভাগ যায় (ল.সা.গু প্রয়োগ)</CardTitle>
          <div style={{fontSize:11,color:'var(--text-3)',padding:'0 10px 6px'}}>
            d দিয়ে ভাগ যায় এমন সংখ্যা = (সীমা ÷ d) এর ভাগফলের পূর্ণ অংশ।
          </div>

          <IdItem n="১">
            <strong>প্রশ্ন:</strong> ১০–১০০০ এর মধ্যে ৩০ অথবা ১৫ দিয়ে ভাগ যায় কয়টি?
            <div style={exBox}><strong>Ans →</strong> (৩০ দিয়ে ভাগ যায় এমন + ১৫ দিয়ে ভাগ যায় এমন) − (৩০ ও ১৫ এর ল.সা.গু দিয়ে ভাগ যায় সংখ্যা)</div>
          </IdItem>

          <IdItem n="২">
            <strong>প্রশ্ন:</strong> ১০–১০০০ এর মধ্যে ৩০ দিয়ে যাবে কিন্তু ১৫ দিয়ে ভাগ যাবে না — কয়টি?
            <div style={exBox}><strong>Ans →</strong> (৩০ দিয়ে ভাগ যায় এমন সংখ্যাগুলো) − (৩০ ও ১৫ এর ল.সা.গু দিয়ে যা ভাগ যায়)</div>
          </IdItem>
        </Card>
      </div>

      <Card color="gold" style={{marginTop:14}}>
        <CardTitle color="var(--mf-gold)">ভাগশেষ সংক্রান্ত নিয়ম (ভাগ করলে অবশিষ্ট থাকে)</CardTitle>

        <IdItem n="১">
          <strong>একই অবশিষ্ট → ল.সা.গু + অবশিষ্ট।</strong><br/>
          কোন <strong>ক্ষুদ্রতম</strong> সংখ্যাকে কয়েকটি সংখ্যা দিয়ে ভাগ করলে <strong>প্রতিবার একই অবশিষ্ট (r)</strong> থাকলে → নির্ণেয় সংখ্যা = <strong>ল.সা.গু + r</strong>।
                    <div style={exBox}>
            <div><strong>উদাহরণ:</strong> কোন <strong>ক্ষুদ্রতম</strong> সংখ্যাকে <strong>১৩, ১৮, ২১</strong> দিয়ে ভাগ করলে প্রতিবার <strong>২</strong> অবশিষ্ট থাকবে? → (১৩, ১৮, ২১-এর ল.সা.গু) <strong>+ ২</strong>।</div>
            <div style={whyRow}><strong>কেন + ২, − ২ নয়?</strong> ল.সা.গু-কে ১৩, ১৮, ২১ — তিনটাই <strong>নিঃশেষে</strong> ভাগ করে (অবশিষ্ট ০)। ২ <strong>বেশি</strong> নিলে প্রতিবারই অবশিষ্ট ২ পড়ে — প্রশ্নে সেটাই চাওয়া। ২ <strong>কম</strong> নিলে অবশিষ্ট হতো (ভাজক − ২) = ১১, ১৬, ১৯ — একই থাকত না। তাই "প্রতিবার একই অবশিষ্ট" → <strong>+</strong>, আর "(ভাজক − অবশিষ্ট) সমান" → <strong>−</strong> (নিয়ম ৩)। শর্ত: অবশিষ্ট সবসময় <strong>ক্ষুদ্রতম ভাজকের চেয়ে ছোট</strong> হবে।</div>
          </div>
        </IdItem>

        <IdItem n="২">
          <strong>যোগ করলে নিঃশেষে বিভাজ্য → ল.সা.গু − যোগকৃত সংখ্যা।</strong><br/>
          কোন <strong>ক্ষুদ্রতম</strong> সংখ্যার সাথে <strong>a যোগ</strong> করলে যোগফল কয়েকটি সংখ্যা দিয়ে <strong>নিঃশেষে বিভাজ্য</strong> হলে → নির্ণেয় সংখ্যা = <strong>ল.সা.গু − a</strong>। (উল্টোটা: <strong>a বিয়োগ</strong> করলে বিভাজ্য হলে → <strong>ল.সা.গু + a</strong>)
                    <div style={exBox}>
            <div><strong>উদাহরণ:</strong> কোন <strong>ক্ষুদ্রতম</strong> সংখ্যার সাথে <strong>৫</strong> যোগ করলে যোগফল <strong>১৬, ২৪ ও ৩২</strong> দিয়ে নিঃশেষে বিভাজ্য হবে? → (১৬, ২৪, ৩২-এর ল.সা.গু = <strong>৯৬</strong>) <strong>− ৫ = ৯১</strong>।</div>
            <div style={whyRow}><strong>কেন − ৫?</strong> সংখ্যাটির সাথে ৫ যোগ করলে যোগফল তিনটা দিয়েই বিভাজ্য — অর্থাৎ যোগফলই <strong>ল.সা.গু (৯৬)</strong>; তাই সংখ্যাটি ৯৬-এর চেয়ে ৫ <strong>কম</strong>। উল্টো করে "৫ বিয়োগ করলে বিভাজ্য" বললে সংখ্যাটি ৯৬-এর ৫ <strong>বেশি</strong> → <strong>+ ৫</strong>।</div>
          </div>
        </IdItem>

        <IdItem n="৩">
          <strong>(ভাজক − অবশিষ্ট) সমান → ল.সা.গু − পার্থক্য।</strong><br/>
          অবশিষ্ট ভিন্ন কিন্তু প্রতিক্ষেত্রে <strong>(ভাজক − অবশিষ্ট) = ধ্রুবক (k)</strong> হলে → নির্ণেয় সংখ্যা = <strong>ল.সা.গু − k</strong>।
                    <div style={exBox}>
            <div><strong>উদাহরণ:</strong> কোন <strong>ক্ষুদ্রতম</strong> সংখ্যাকে <strong>১২, ১৫, ১৬</strong> দিয়ে ভাগ করলে যথাক্রমে <strong>৫, ৮, ৯</strong> অবশিষ্ট থাকবে? (১২−৫ = ১৫−৮ = ১৬−৯ = <strong>৭</strong>) → (১২, ১৫, ১৬-এর ল.সা.গু) <strong>− ৭</strong>।</div>
            <div style={whyRow}><strong>কেন − ৭?</strong> ল.সা.গু প্রতিটা দিয়ে নিঃশেষে যায়; ৭ কম নিলে প্রতিটা ভাগেই ৭ কম পড়ে, তাই অবশিষ্ট দাঁড়ায় (ভাজক − ৭) = ৫, ৮, ৯। প্রতিবার <strong>একই</strong> অবশিষ্ট চাইলে হতো <strong>+ r</strong> (নিয়ম ১)।</div>
          </div>
        </IdItem>

        <IdItem n="৪">
          <strong>বৃহত্তম সংখ্যা → অবশিষ্ট বিয়োগ করে গ.সা.গু।</strong><br/>
          কোন <strong>বৃহত্তম</strong> সংখ্যা দিয়ে কয়েকটি সংখ্যাকে ভাগ করলে নির্দিষ্ট অবশিষ্ট থাকলে → প্রতিটি থেকে তার <strong>অবশিষ্ট বিয়োগ</strong> করে <strong>গ.সা.গু</strong> নাও।
                    <div style={exBox}>
            <div><strong>উদাহরণ:</strong> কোন <strong>বৃহত্তম</strong> সংখ্যা দিয়ে <strong>২৯, ৪০, ৫৫</strong> কে ভাগ করলে যথাক্রমে <strong>৩, ৪, ৫</strong> অবশিষ্ট থাকবে? → (২৯−৩), (৪০−৪), (৫৫−৫) = <strong>২৬, ৩৬, ৫০</strong> → এদের <strong>গ.সা.গু = উত্তর</strong>।</div>
            <div style={whyRow}><strong>কেন বিয়োগ, আর কেন গ.সা.গু?</strong> অবশিষ্ট বাদ দিলে (২৬, ৩৬, ৫০) সংখ্যাগুলো ঐ ভাজক দিয়ে <strong>নিঃশেষে</strong> যায় — তাই আগে বিয়োগ। এখানে খোঁজা হচ্ছে <strong>ভাজক</strong> (যে সংখ্যা দিয়ে ভাগ করা হয়), তাই ল.সা.গু নয়, <strong>গ.সা.গু</strong>; নিয়ম ১–৩-এ খোঁজা হয় <strong>ভাজ্য</strong>, তাই সেখানে ল.সা.গু।</div>
          </div>
        </IdItem>

        <IdItem n="৫">
          <strong>নির্দিষ্ট অঙ্কের ক্ষুদ্রতম সংখ্যা → ল.সা.গু-র পরবর্তী গুণিতক ধরে নাও।</strong><br/>
          অঙ্কসংখ্যা বেঁধে দেওয়া থাকলে → ল.সা.গু বের করো → <strong>n অঙ্কের ক্ষুদ্রতম সংখ্যা ÷ ল.সা.গু</strong> করে ভাগশেষ দেখো → <strong>পরবর্তী গুণিতকে</strong> যাও → তারপর উপরের নিয়ম (<strong>− k</strong> বা <strong>+ r</strong>) বসাও।
          <div style={exBox}>
            <div><strong>উদাহরণ:</strong> <strong>চার অঙ্কের</strong> কোন <strong>ক্ষুদ্রতম</strong> সংখ্যাকে <strong>৪, ৬, ১০ ও ১২</strong> দিয়ে ভাগ করলে যথাক্রমে <strong>২, ৪, ৮, ১০</strong> অবশিষ্ট থাকবে?</div>
            <div style={stepRow}>→ প্রতিক্ষেত্রে (ভাজক − অবশিষ্ট) = <strong>২</strong> (ধ্রুবক)</div>
            <div style={stepRow}>→ ল.সা.গু (৪, ৬, ১০, ১২) = <strong>৬০</strong></div>
            <div style={stepRow}>→ চার অঙ্কের ক্ষুদ্রতম সংখ্যা <strong>১০০০</strong> ÷ <strong>৬০</strong> → ভাগশেষ <strong>৪০</strong></div>
            <LongDivision divisor="৬০" dividend="১০০০" quotient="  ১৬" over={[2,3]} rows={[
              { t:'৬০  ', under:[0,2] },
              { t:' ৪০০' },
              { t:' ৩৬০', under:[1,3] },
              { t:'  ৪০' },
            ]}/>
            <div style={stepRow}>→ পরবর্তী গুণিতক = ১০০০ + (৬০ − ৪০) = <strong>১০২০</strong></div>
            <div style={stepRow}>→ নির্ণেয় সংখ্যা = <strong>১০২০ − ২ = ১০১৮</strong></div>
            <div style={whyRow}><strong>কেন − ২?</strong> অবশিষ্টগুলো আলাদা, কিন্তু প্রতিটাই ভাজকের চেয়ে <strong>২ কম</strong> (৪−২, ৬−৪, ১০−৮, ১২−১০) — তাই গুণিতক থেকে ২ কম নিলেই প্রতিবার ঐ ঘাটতিটুকু অবশিষ্ট থাকে। প্রশ্নে "প্রতিবার ২ অবশিষ্ট" বললে হতো <strong>+ ২</strong> (নিয়ম ১)।</div>
          </div>
        </IdItem>

        <IdItem n="৬">
          <strong>নির্দিষ্ট অঙ্কের বৃহত্তম সংখ্যা → ল.সা.গু-র আগের গুণিতক ধরে নাও।</strong><br/>
          <strong>n অঙ্কের বৃহত্তম সংখ্যা ÷ ল.সা.গু</strong> করে <strong>ভাগশেষ বিয়োগ</strong> করো → এটাই নিঃশেষে বিভাজ্য বৃহত্তম সংখ্যা → তারপর <strong>অবশিষ্ট (r) যোগ</strong> করো।
          <div style={exBox}>
            <div><strong>উদাহরণ:</strong> <strong>পাঁচ অঙ্কের</strong> কোন <strong>বৃহত্তম</strong> সংখ্যাকে <strong>১৬, ২৮, ৩০ ও ৩৬</strong> দিয়ে ভাগ করলে প্রত্যেকবার <strong>১০</strong> ভাগশেষ থাকবে?</div>
            <div style={stepRow}>→ ল.সা.গু (১৬, ২৮, ৩০, ৩৬) = <strong>৫০৪০</strong></div>
            <div style={stepRow}>→ পাঁচ অঙ্কের বৃহত্তম সংখ্যা <strong>৯৯৯৯৯</strong> ÷ <strong>৫০৪০</strong> → ভাগশেষ <strong>৪২৩৯</strong></div>
            <LongDivision divisor="৫০৪০" dividend="৯৯৯৯৯" quotient="   ১৯" over={[3,4]} rows={[
              { t:'৫০৪০ ', under:[0,4] },
              { t:'৪৯৫৯৯' },
              { t:'৪৫৩৬০', under:[0,4] },
              { t:' ৪২৩৯' },
            ]}/>
            <div style={stepRow}>→ নিঃশেষে বিভাজ্য বৃহত্তম = ৯৯৯৯৯ − ৪২৩৯ = <strong>৯৫৭৬০</strong></div>
            <div style={stepRow}>→ নির্ণেয় সংখ্যা = <strong>৯৫৭৬০ + ১০ = ৯৫৭৭০</strong></div>
            <div style={whyRow}><strong>কেন + ১০?</strong> প্রশ্নেই বলা আছে <strong>প্রত্যেকবার ১০ ভাগশেষ</strong> — তাই নিঃশেষে বিভাজ্য সংখ্যার চেয়ে ১০ বেশি নিতে হয়। "প্রতিক্ষেত্রে (ভাজক − অবশিষ্ট) সমান" বললে হতো <strong>− সেই পার্থক্য</strong> (নিয়ম ৩)।</div>
          </div>
        </IdItem>

        <Mem title="💡 মনে রাখুন">
          <ul>
            <li>অবশিষ্ট <strong>একই</strong> → ল.সা.গু <strong>+</strong> অবশিষ্ট</li>
            <li><strong>যোগ</strong> করলে নিঃশেষে বিভাজ্য → ল.সা.গু <strong>−</strong> যোগকৃত সংখ্যা (বিয়োগ হলে <strong>+</strong>)</li>
            <li>(ভাজক − অবশিষ্ট) <strong>সমান</strong> → ল.সা.গু <strong>−</strong> পার্থক্য</li>
            <li><strong>বৃহত্তম</strong> সংখ্যা (ভাগশেষসহ) → অবশিষ্ট বিয়োগ করে <strong>গ.সা.গু</strong></li>
            <li><strong>n অঙ্কের ক্ষুদ্রতম</strong> → ল.সা.গু-র <strong>পরবর্তী</strong> গুণিতক ধরে − k / + r</li>
            <li><strong>n অঙ্কের বৃহত্তম</strong> → ল.সা.গু-র <strong>আগের</strong> গুণিতক ধরে + r</li>
          </ul>
        </Mem>
      </Card>
    </div>
  )
}
