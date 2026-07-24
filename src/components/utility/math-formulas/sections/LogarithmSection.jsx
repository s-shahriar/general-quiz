import { SectionHeader, Card, CardTitle, CoverEq, Mem } from '../MathFormulaHelpers'

export default function LogarithmSection() {
  return (
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
              <span className="mf-log-tex"><CoverEq>{tex}</CoverEq></span>
              {note && <span className="mf-log-note">{note}</span>}
            </div>
          ))}
          <Mem title="💡 সংজ্ঞা" style={{marginTop:8}}>
            <p>log₂ 8 = 3 &nbsp;কারণ&nbsp; 2³ = 8</p>
          </Mem>
        </Card>

        <Card color="violet">
          <CardTitle color="var(--mf-violet)">Chain Rule — কোনাকুনি বাতিল হয়</CardTitle>
          {[
            { tex: "\\log_a b \\times \\log_b c = \\log_a c",  note: "b বাতিল"  },
            { tex: "\\log_p q \\times \\log_m p = \\log_m q",  note: "p বাতিল"  },
          ].map(({tex, note}) => (
            <div key={tex} className="mf-log-row highlight">
              <span className="mf-log-tex"><CoverEq>{tex}</CoverEq></span>
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
  )
}
