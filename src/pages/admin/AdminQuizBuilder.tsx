export function AdminQuizBuilder() {
  return (
    <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1">Quiz Builder</h3>
          <p className="text-sm text-navy/70">Create and manage assessments for learners.</p>
        </div>
        <button className="bg-amaranth hover:bg-amaranth/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2">
          + Create New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Quiz List */}
        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-navy/60 mb-2">Existing Quizzes</h4>
          {[
            { title: 'Present Perfect vs Past Simple', level: 'B1', questions: 15 },
            { title: 'Business Idioms Assessment', level: 'C1', questions: 20 },
            { title: 'Travel Vocabulary Basics', level: 'A2', questions: 10 },
          ].map((quiz, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${i === 0 ? 'bg-amaranth/10 border-amaranth/20 shadow-sm' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <h5 className="font-bold text-sm mb-1">{quiz.title}</h5>
              <div className="flex items-center justify-between text-xs text-navy/70">
                <span>Level: {quiz.level}</span>
                <span>{quiz.questions} Qs</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Editor */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <label className="block text-sm font-medium text-navy/80 mb-1.5">Quiz Title</label>
            <input
              type="text"
              defaultValue="Present Perfect vs Past Simple"
              className="w-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amaranth/50 transition-all font-semibold"
            />
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-navy/80 mb-1.5">Target Level</label>
              <select
                defaultValue="B1"
                className="w-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amaranth/50 transition-all"
              >
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
                <option>C1</option>
                <option>C2</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-navy/80 mb-1.5">Category</label>
              <select
                defaultValue="Grammar"
                className="w-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amaranth/50 transition-all"
              >
                <option>Grammar</option>
                <option>Vocabulary</option>
                <option>Reading</option>
                <option>Listening</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-navy/60 mb-2">Questions</h4>

            {/* Question Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm relative group">
              <button className="absolute top-3 right-3 text-navy/40 hover:text-red-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity">
                Delete
              </button>
              <div className="mb-3">
                <label className="block text-xs font-medium text-navy/70 mb-1">Question 1</label>
                <input
                  type="text"
                  defaultValue="I _____ to Paris three times."
                  className="w-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amaranth/50"
                />
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-navy/10">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="q1"
                    aria-label='Mark "went" as correct answer'
                    className="text-amaranth focus:ring-amaranth"
                  />
                  <input
                    type="text"
                    defaultValue="went"
                    aria-label="Answer option"
                    className="flex-1 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="q1"
                    defaultChecked
                    aria-label='Mark "have been" as correct answer'
                    className="text-amaranth focus:ring-amaranth"
                  />
                  <input
                    type="text"
                    defaultValue="have been"
                    aria-label="Answer option (correct)"
                    className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none font-medium text-emerald-700"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="q1"
                    aria-label='Mark "had gone" as correct answer'
                    className="text-amaranth focus:ring-amaranth"
                  />
                  <input
                    type="text"
                    defaultValue="had gone"
                    aria-label="Answer option"
                    className="flex-1 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-navy/60 font-medium hover:bg-white/5 hover:text-charcoal transition-colors flex items-center justify-center gap-2">
              + Add Question
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
            <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors">
              Save Draft
            </button>
            <button className="px-5 py-2.5 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal/90 shadow-md transition-colors">
              Publish Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
