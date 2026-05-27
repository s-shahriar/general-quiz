import { BookOpen, Play, Bookmark, Zap } from 'lucide-react'
import { TOPICS } from '../../data/eee/topics'
import Header from './Header'

export default function Home({ onSelectTopic, bookmarkCount }) {
  return (
    <div className="min-h-screen">
      <Header title="" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 22px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.2)',
              }}
            >
              <Zap size={22} className="text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight logo-gradient">EEE Quiz</h1>
          </div>

          <p className="text-sm mb-3" style={{ color: '#7879c0' }}>বিষয় ভিত্তিক MCQ প্র্যাকটিস</p>

          {bookmarkCount > 0 && (
            <div
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.22)' }}
            >
              <Bookmark size={12} />
              {bookmarkCount} bookmarked
            </div>
          )}
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-bold tracking-widest uppercase font-mono shrink-0"
            style={{ color: '#4a4e80' }}
          >
            Choose a Topic
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.24), transparent)' }} />
        </div>

        {/* Topic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPICS.map((topic, i) => {
            const { Icon } = topic
            return (
              <div
                key={topic.id}
                className="eee-topic-card rounded-2xl p-5 flex flex-col gap-4 card-enter"
                style={{
                  animationDelay: `${i * 55}ms`,
                  background: '#0f1433',
                  borderTop: '1px solid rgba(99,102,241,0.14)',
                  borderRight: '1px solid rgba(99,102,241,0.14)',
                  borderBottom: '1px solid rgba(99,102,241,0.14)',
                  borderLeft: `3px solid ${topic.accent}`,
                }}
              >
                {/* Topic header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: topic.accent + '22', border: `1px solid ${topic.accent}33` }}
                  >
                    <Icon size={20} style={{ color: topic.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm leading-tight truncate" style={{ color: '#ecedf8' }}>{topic.title}</h2>
                    <p className="text-xs mt-0.5" style={{ color: '#7879c0' }}>{topic.title_bn}</p>
                  </div>
                  <span
                    className="text-xs font-mono px-2 py-1 rounded-md shrink-0"
                    style={{ background: '#141a3c', color: '#7879c0', border: '1px solid rgba(99,102,241,0.16)' }}
                  >
                    {topic.data.length}Q
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectTopic(topic, 'quiz')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: topic.accent, boxShadow: `0 4px 18px ${topic.accent}44` }}
                  >
                    <Play size={14} />
                    Quiz
                  </button>
                  <button
                    onClick={() => onSelectTopic(topic, 'revise')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: '#141a3c', color: '#ecedf8', border: '1px solid rgba(99,102,241,0.22)' }}
                  >
                    <BookOpen size={14} />
                    Revise
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
