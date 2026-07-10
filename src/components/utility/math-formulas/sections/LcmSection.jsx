import { SectionHeader, Card, CardTitle, FBox, Mem, IdItem } from '../MathFormulaHelpers'

const exBox = { background:'var(--elevated)', borderRadius:8, padding:'7px 11px', marginTop:7, fontSize:12.5, color:'var(--text-2)', lineHeight:1.6 }

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
      </div>

      <Card color="gold" style={{marginTop:14}}>
        <CardTitle color="var(--mf-gold)">ভাগশেষ সংক্রান্ত নিয়ম (ভাগ করলে অবশিষ্ট থাকে)</CardTitle>

        <IdItem n="১">
          <strong>একই অবশিষ্ট → ল.সা.গু + অবশিষ্ট।</strong><br/>
          কোন <strong>ক্ষুদ্রতম</strong> সংখ্যাকে কয়েকটি সংখ্যা দিয়ে ভাগ করলে <strong>প্রতিবার একই অবশিষ্ট (r)</strong> থাকলে → নির্ণেয় সংখ্যা = <strong>ল.সা.গু + r</strong>।
          <div style={exBox}>উদাহরণ: <strong>১৩, ১৮, ২১</strong> দিয়ে ভাগ করলে প্রতিবার <strong>২</strong> অবশিষ্ট → (১৩,১৮,২১-এর ল.সা.গু) <strong>+ ২</strong>।</div>
        </IdItem>

        <IdItem n="২">
          <strong>(ভাজক − অবশিষ্ট) সমান → ল.সা.গু − পার্থক্য।</strong><br/>
          অবশিষ্ট ভিন্ন কিন্তু প্রতিক্ষেত্রে <strong>(ভাজক − অবশিষ্ট) = ধ্রুবক (k)</strong> হলে → নির্ণেয় সংখ্যা = <strong>ল.সা.গু − k</strong>।
          <div style={exBox}>উদাহরণ: <strong>১২, ১৫, ১৬</strong> দিয়ে ভাগ করলে যথাক্রমে <strong>৫, ৮, ৯</strong> অবশিষ্ট (১২−৫ = ১৫−৮ = ১৬−৯ = <strong>৭</strong>) → ল.সা.গু <strong>− ৭</strong>।</div>
        </IdItem>

        <IdItem n="৩">
          <strong>বৃহত্তম সংখ্যা → অবশিষ্ট বিয়োগ করে গ.সা.গু।</strong><br/>
          কোন <strong>বৃহত্তম</strong> সংখ্যা দিয়ে কয়েকটি সংখ্যাকে ভাগ করলে নির্দিষ্ট অবশিষ্ট থাকলে → প্রতিটি থেকে তার <strong>অবশিষ্ট বিয়োগ</strong> করে <strong>গ.সা.গু</strong> নাও।
          <div style={exBox}>উদাহরণ: <strong>২৯, ৪০, ৫৫</strong> কে ভাগ করলে যথাক্রমে <strong>৩, ৪, ৫</strong> অবশিষ্ট → (২৯−৩), (৪০−৪), (৫৫−৫) = <strong>২৬, ৩৬, ৫০</strong> → এদের <strong>গ.সা.গু = উত্তর</strong>।</div>
        </IdItem>

        <Mem title="💡 মনে রাখুন">
          <ul>
            <li>অবশিষ্ট <strong>একই</strong> → ল.সা.গু <strong>+</strong> অবশিষ্ট</li>
            <li>(ভাজক − অবশিষ্ট) <strong>সমান</strong> → ল.সা.গু <strong>−</strong> পার্থক্য</li>
            <li><strong>বৃহত্তম</strong> সংখ্যা (ভাগশেষসহ) → অবশিষ্ট বিয়োগ করে <strong>গ.সা.গু</strong></li>
          </ul>
        </Mem>
      </Card>
    </div>
  )
}
