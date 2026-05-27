import { VOCAB_TOPICS } from '../../data/vocabTopics.js'
import VocabHomeScreen from './HomeScreen.jsx'
import VocabExamConfig from './ExamConfig.jsx'
import StudyMode       from '../StudyMode.jsx'
import QuizMode        from '../QuizMode.jsx'
import ModeSelect      from '../ModeSelect.jsx'
import ExamMode        from '../ExamMode.jsx'
import NailedScreen    from '../NailedScreen.jsx'
import ImportantScreen from '../ImportantScreen.jsx'

export { VOCAB_TOPICS }

export default function VocabApp({
  vocabScreen, vocabTopic, vocabExamData,
  setVocabScreen, setVocabTopic, setVocabExamData, goVocabHome,
  mastered, important,
  nail, unnail, markImportant, unmarkImportant,
  onOpenBackup,
}) {
  return (
    <>
      {vocabScreen === 'home' && (
        <VocabHomeScreen
          topics={VOCAB_TOPICS}
          mastered={mastered}
          important={important}
          onSelectTopic={(t) => { setVocabTopic(t); setVocabScreen('mode') }}
          onExam={() => setVocabScreen('exam_config')}
          onNailed={() => setVocabScreen('nailed')}
          onImportant={() => setVocabScreen('important')}
          onBackup={onOpenBackup}
        />
      )}
      {vocabScreen === 'important' && (
        <ImportantScreen topics={VOCAB_TOPICS} important={important} onUnmark={unmarkImportant} onHome={goVocabHome} />
      )}
      {vocabScreen === 'nailed' && (
        <NailedScreen topics={VOCAB_TOPICS} mastered={mastered} onUnnail={unnail} onHome={goVocabHome} />
      )}
      {vocabScreen === 'mode' && vocabTopic && (
        <ModeSelect topic={vocabTopic} onQuiz={() => setVocabScreen('quiz')} onStudy={() => setVocabScreen('study')} onBack={goVocabHome} />
      )}
      {vocabScreen === 'quiz' && vocabTopic && (
        <QuizMode
          key={vocabTopic.id + '-quiz'}
          topic={vocabTopic}
          topics={VOCAB_TOPICS}
          mastered={mastered}
          important={important}
          onNail={nail}
          onUnnail={unnail}
          onMarkImportant={markImportant}
          onUnmarkImportant={unmarkImportant}
          onBack={() => setVocabScreen('mode')}
          onHome={goVocabHome}
          onChangeTopic={(t) => setVocabTopic(t)}
        />
      )}
      {vocabScreen === 'study' && vocabTopic && (
        <StudyMode
          key={vocabTopic.id + '-study'}
          topic={vocabTopic}
          topics={VOCAB_TOPICS}
          mastered={mastered}
          important={important}
          onNail={nail}
          onMarkImportant={markImportant}
          onUnmarkImportant={unmarkImportant}
          onBack={() => setVocabScreen('mode')}
          onHome={goVocabHome}
          onChangeTopic={(t) => setVocabTopic(t)}
        />
      )}
      {vocabScreen === 'exam_config' && (
        <VocabExamConfig
          topics={VOCAB_TOPICS}
          important={important}
          onStart={(data) => { setVocabExamData(data); setVocabScreen('exam') }}
          onBack={goVocabHome}
        />
      )}
      {vocabScreen === 'exam' && vocabExamData && (
        <ExamMode
          key={vocabExamData.label + vocabExamData.questions.length}
          questions={vocabExamData.questions}
          label={vocabExamData.label}
          mastered={mastered}
          important={important}
          onNail={nail}
          onUnnail={unnail}
          onMarkImportant={markImportant}
          onUnmarkImportant={unmarkImportant}
          onHome={goVocabHome}
        />
      )}
    </>
  )
}
