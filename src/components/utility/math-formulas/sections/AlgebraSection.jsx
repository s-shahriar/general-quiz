import { Card, CardTitle, IdItem, Mem, SectionHeader, Tex, Warn } from '../MathFormulaHelpers'

export default function AlgebraSection() {
  return (
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
  )
}
