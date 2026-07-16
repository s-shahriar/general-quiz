import { Card, CardTitle, IdItem, SectionHeader, Tex } from '../MathFormulaHelpers'

export default function AlgebraSection() {
  return (
    <div className="mf-section" id="algebra">
      <SectionHeader icon="≡" title="বীজগণিতীয় সূত্রাবলি" sub="Algebraic Identities" />
      <div className="mf-grid2">
        <Card color="rose">
          <CardTitle>বর্গ সংক্রান্ত সূত্র (Square Identities)</CardTitle>
          <div className="mf-id-list">
            <IdItem n="1"><Tex>{"(a+b)^2 = (a-b)^2 + 4ab"}</Tex></IdItem>
            <IdItem n="2"><Tex>{"(a-b)^2 = (a+b)^2 - 4ab"}</Tex></IdItem>
            <IdItem n="3"><Tex>{"a^2 + b^2 = (a+b)^2 - 2ab = (a-b)^2 + 2ab"}</Tex></IdItem>
            <IdItem n="4"><Tex>{"2(a^2+b^2) = (a+b)^2 + (a-b)^2"}</Tex></IdItem>
            <IdItem n="5"><Tex>{"4ab = (a+b)^2 - (a-b)^2"}</Tex></IdItem>
            <IdItem n="6"><Tex>{"ab = \\left[\\dfrac{a+b}{2}\\right]^2 - \\left[\\dfrac{a-b}{2}\\right]^2"}</Tex></IdItem>
          </div>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">তিন পদ ও ঘন সংক্রান্ত সূত্র</CardTitle>
          <div className="mf-id-list">
            <IdItem n="7"><Tex>{"(a+b+c)^2 = a^2+b^2+c^2+2(ab+bc+ca)"}</Tex></IdItem>
            <IdItem n="8"><Tex>{"(x+a)(x+b) = x^2+(a+b)x+ab"}</Tex></IdItem>
            <IdItem n="9" star><Tex>{"(a+b)^3 = a^3+3a^2b+3ab^2+b^3"}</Tex></IdItem>
            <IdItem n="10"><Tex>{"(a+b)^3 = a^3+b^3+3ab(a+b)"}</Tex></IdItem>
            <IdItem n="11"><Tex>{"(a-b)^3 = a^3-3a^2b+3ab^2-b^3"}</Tex></IdItem>
            <IdItem n="12"><Tex>{"(a-b)^3 = a^3-b^3-3ab(a-b)"}</Tex></IdItem>
            <IdItem n="13"><Tex>{"a^3+b^3 = (a+b)(a^2-ab+b^2)"}</Tex></IdItem>
            <IdItem n="14"><Tex>{"a^3-b^3 = (a-b)(a^2+ab+b^2)"}</Tex></IdItem>
            <IdItem n="15"><Tex>{"a^3+b^3 = (a+b)^3-3ab(a+b)"}</Tex></IdItem>
            <IdItem n="16"><Tex>{"a^3-b^3 = (a-b)^3+3ab(a-b)"}</Tex></IdItem>
          </div>
        </Card>
      </div>
    </div>
  )
}
