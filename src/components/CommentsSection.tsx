import React, { useEffect } from 'react';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import { Comment } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

export interface CommentsSectionProps {
  targetId: string;
  targetType: 'news' | 'lore' | 'submission';
  user?: FirebaseUser | null;
  currentUser?: FirebaseUser | null;
  comments?: Record<string, Comment[]>;
  commentsLoading?: Record<string, boolean>;
  newCommentText?: Record<string, string>;
  setNewCommentText?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  fetchComments?: (targetId: string) => Promise<void>;
  handleAddComment?: (targetId: string, targetType: 'news' | 'lore' | 'submission', e: React.FormEvent) => Promise<void>;
  handleDeleteComment?: (targetId: string, commentId: string) => Promise<void>;
  handleLogin?: () => Promise<void>;
  onOpenAuth?: () => void;
}

export function CommentsSection({
  targetId,
  targetType,
  user,
  currentUser,
  comments = {},
  commentsLoading = {},
  newCommentText = {},
  setNewCommentText,
  fetchComments,
  handleAddComment,
  handleDeleteComment,
  handleLogin,
  onOpenAuth
}: CommentsSectionProps) {
  const activeUser = user !== undefined ? user : (currentUser ?? null);
  const activeLogin = handleLogin || onOpenAuth || (() => {});

  useEffect(() => {
    if (fetchComments && targetId) {
      fetchComments(targetId);
    }
  }, [targetId]);

  const targetComments = comments[targetId] || [];
  const isLoading = commentsLoading[targetId] || false;
  const commentInput = newCommentText[targetId] || '';

  return (
    <div className="mt-4 pt-4 border-t border-zelda-border-sand/40 space-y-4">
      <div className="flex items-center gap-2 text-xs font-serif font-bold text-zelda-charcoal uppercase tracking-wider">
        <MessageSquare className="w-4 h-4 text-zelda-gold" />
        <span>Alliance Discussions ({targetComments.length})</span>
      </div>

      {/* Input Form */}
      {activeUser ? (
        <form onSubmit={(e) => handleAddComment && handleAddComment(targetId, targetType, e)} className="flex gap-2">
          <input
            type="text"
            placeholder="Write a message in the scroll..."
            value={commentInput}
            onChange={(e) => setNewCommentText && setNewCommentText(prev => ({ ...prev, [targetId]: e.target.value }))}
            className="flex-grow bg-white border border-zelda-border-sand rounded-lg px-3 py-2 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="bg-zelda-gold hover:bg-yellow-600 disabled:bg-gray-400 text-white px-3.5 py-2 rounded-lg text-xs font-serif font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      ) : (
        <div className="bg-zelda-beige-card/40 border border-dashed border-zelda-border-sand/60 rounded-lg p-3 text-center">
          <p className="text-[11px] text-zelda-charcoal/60 mb-2">
            You must be authenticated with Google to share words in this discussion scroll.
          </p>
          <button
            type="button"
            onClick={() => activeLogin()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zelda-gold hover:bg-yellow-600 text-white text-[10px] font-serif font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer shadow-sm"
          >
            <User className="w-3 h-3" /> Login with Google ▲
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {isLoading && targetComments.length === 0 ? (
          <div className="text-center py-4 text-xs text-zelda-charcoal/50 font-mono animate-pulse">
            Retrieving messages from the sanctuary...
          </div>
        ) : targetComments.length === 0 ? (
          <div className="text-center py-4 text-xs text-zelda-charcoal/40 italic">
            This scroll remains unwritten. Be the first to speak.
          </div>
        ) : (
          targetComments.map((comment) => (
            <div key={comment.id} className="bg-white/30 border border-zelda-border-sand/30 rounded-lg p-2.5 text-xs flex gap-2.5 items-start">
              {comment.authorPhoto ? (
                <img
                  src={comment.authorPhoto}
                  alt={comment.authorName}
                  className="w-7 h-7 rounded-full border border-zelda-gold/30 mt-0.5"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-zelda-gold/20 flex items-center justify-center text-zelda-gold font-bold text-xs mt-0.5">
                  {comment.authorName.substring(0, 1).toUpperCase()}
                </div>
              )}

              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-bold text-zelda-charcoal font-serif truncate max-w-[150px]">
                    {comment.authorName}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[9px] text-zelda-charcoal/40 font-mono">
                      {comment.date}
                    </span>
                    {activeUser?.uid === comment.authorId && (
                      <button
                        onClick={() => handleDeleteComment && handleDeleteComment(targetId, comment.id)}
                        className="text-red-500 hover:text-red-700 p-0.5 rounded transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-zelda-charcoal/80 leading-relaxed break-words font-sans whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
