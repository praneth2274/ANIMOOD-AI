import React from 'react';
import { X, ExternalLink, Play } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  youtubeId?: string;
  embedUrl?: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  title,
  youtubeId,
  embedUrl,
}) => {
  if (!isOpen) return null;

  const videoUrl = embedUrl || (youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1` : null);
  const directUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-500">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-wide truncate max-w-md sm:max-w-xl">
                {title} — Official Trailer / Teaser
              </h3>
              <p className="text-xs text-slate-400">Official promotional trailer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Player Body */}
        <div className="aspect-video w-full bg-black flex items-center justify-center">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="text-center p-8 text-slate-400">
              <p className="text-lg font-medium text-slate-300 mb-2">Trailer Preview Unavailable</p>
              <p className="text-sm">No video link provided for this specific title.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
