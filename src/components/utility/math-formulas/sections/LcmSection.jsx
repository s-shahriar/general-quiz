import { SectionHeader, Card, CardTitle, FBox, Mem } from '../MathFormulaHelpers'

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
    </div>
  )
}
