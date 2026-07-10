import { SectionHeader, Card, CardTitle, Tex, FBox, Mem } from '../MathFormulaHelpers'

export default function SeriesSection() {
  return (
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
          <div className="mf-series-card"><div className="step">গাণিতিক গড় (AM)</div><div className="formula"><Tex>{"AM = \\dfrac{\\text{প্রথম পদ} + \\text{শেষ পদ}}{2}"}</Tex></div></div>
          <div className="mf-series-card" style={{borderLeft:'3px solid #0fdba8'}}>
            <div className="step">ধারার সমষ্টি (প্রথম ও শেষ পদ দিয়ে)</div>
            <div className="formula"><Tex>{"\\text{ধারার সমষ্টি} = \\dfrac{\\text{শেষ পদ} + \\text{প্রথম পদ}}{2} \\times \\text{পদ সংখ্যা}"}</Tex></div>
          </div>
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
  )
}
