import { Card, CardTitle, IdItem, SectionHeader } from '../MathFormulaHelpers'

export default function AlgebraSection() {
  return (
    <div className="mf-section" id="algebra">
      <SectionHeader icon="≡" title="বীজগণিতীয় সূত্রাবলি" sub="Algebraic Identities" />
      <div className="mf-grid2">
        <Card color="rose">
          <CardTitle>বর্গ সংক্রান্ত সূত্র (Square Identities)</CardTitle>
          <div className="mf-id-list">
            <IdItem n="1" tex={"(a+b)^2 = (a-b)^2 + 4ab"} />
            <IdItem n="2" tex={"(a-b)^2 = (a+b)^2 - 4ab"} />
            <IdItem n="3" tex={"a^2 + b^2 = (a+b)^2 - 2ab = (a-b)^2 + 2ab"} />
            <IdItem n="4" tex={"2(a^2+b^2) = (a+b)^2 + (a-b)^2"} />
            <IdItem n="5" tex={"4ab = (a+b)^2 - (a-b)^2"} />
            <IdItem n="6" tex={"ab = \\left[\\dfrac{a+b}{2}\\right]^2 - \\left[\\dfrac{a-b}{2}\\right]^2"} />
          </div>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">তিন পদ ও ঘন সংক্রান্ত সূত্র</CardTitle>
          <div className="mf-id-list">
            <IdItem n="7" tex={"(a+b+c)^2 = a^2+b^2+c^2+2(ab+bc+ca)"} />
            <IdItem n="8" tex={"(a+b)^3 = a^3+b^3+3ab(a+b)"} />
            <IdItem n="9" tex={"(a-b)^3 = a^3-b^3-3ab(a-b)"} />
            <IdItem n="10" tex={"a^3+b^3 = (a+b)(a^2-ab+b^2)"} />
            <IdItem n="11" tex={"a^3-b^3 = (a-b)(a^2+ab+b^2)"} />
            <IdItem n="12" tex={"a^3+b^3 = (a+b)^3-3ab(a+b)"} />
            <IdItem n="13" tex={"a^3-b^3 = (a-b)^3+3ab(a-b)"} />
          </div>
        </Card>
      </div>
    </div>
  )
}
