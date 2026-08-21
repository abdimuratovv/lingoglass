import { useState } from 'react';
import { PlayCircle, Headphones, BookOpen, Type, Mic, BookMarked, Star, LayoutDashboard } from 'lucide-react';

const contentTypes = [
  { id: 'video', label: 'Video Lessons', icon: <PlayCircle size={18} /> },
  { id: 'listening', label: 'Listening Audio', icon: <Headphones size={18} /> },
  { id: 'reading', label: 'Reading Articles', icon: <BookOpen size={18} /> },
  { id: 'writing', label: 'Writing Prompts', icon: <Type size={18} /> },
  { id: 'speaking', label: 'Speaking Exercises', icon: <Mic size={18} /> },
  { id: 'vocab', label: 'Vocabulary Lists', icon: <BookMarked size={18} /> },
  { id: 'idiom', label: 'Idioms & Slang', icon: <Star size={18} /> },
  { id: 'grammar', label: 'Grammar Rules', icon: <LayoutDashboard size={18} /> },
];

export function AdminContentManager() {
  const [selectedType, setSelectedType] = useState('video');

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Sidebar for Content Types */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        <div className="glass-panel p-4 rounded-2xl mb-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-navy/60 mb-3">Resource Type</h3>
          <div className="flex flex-col gap-1">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                aria-pressed={selectedType === type.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                  selectedType === type.id
                    ? 'bg-amaranth/10 text-amaranth font-semibold'
                    : 'text-navy/70 hover:bg-white/5'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Upload/Manage Area */}
      <div className="flex-1 glass-panel rounded-3xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Manage {contentTypes.find((t) => t.id === selectedType)?.label}</h3>
          <button className="bg-charcoal hover:bg-charcoal/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2">
            + Add New Resource
          </button>
        </div>

        {/* Upload Form Placeholder */}
        <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center mb-8 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-navy/50 mb-4 shadow-sm">
            {contentTypes.find((t) => t.id === selectedType)?.icon}
          </div>
          <h4 className="font-semibold text-lg mb-1">Drag and drop files here</h4>
          <p className="text-sm text-navy/60 max-w-sm mb-4">
            Upload MP4, MP3, PDF, or Markdown files depending on the resource type. Maximum file size 500MB.
          </p>
          <button className="bg-white/5 hover:bg-white border border-white/10 text-charcoal px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-sm">
            Browse Files
          </button>
        </div>

        {/* Recent Uploads List */}
        <div>
          <h4 className="font-semibold mb-4">Recent Uploads</h4>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-navy shadow-sm">
                    {contentTypes.find((t) => t.id === selectedType)?.icon}
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Sample Resource Title {i}</h5>
                    <p className="text-xs text-navy/60">Uploaded 2 days ago • B2 Level</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-navy/60 hover:text-charcoal hover:bg-white/5 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
