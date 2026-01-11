import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/data/mockComments';
import { formatDistanceToNow } from 'date-fns';
import { useUserProfile } from '@/hooks/useUserProfile';

interface CommentSectionProps {
  comments: Comment[];
  animeId: string;
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, depth = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
      <div className="flex gap-3 py-4">
        <Avatar className="w-10 h-10 ring-2 ring-primary/10">
          <AvatarImage src={comment.avatar} alt={comment.username} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {comment.username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{comment.username}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-foreground/90 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${liked ? 'text-primary' : ''}`}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {comment.likes + (liked ? 1 : 0)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </Button>
          </div>

          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <Button size="sm" onClick={() => { setReplyText(''); setShowReplyInput(false); }}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ comments, animeId }) => {
  const [newComment, setNewComment] = useState('');
  const { profile } = useUserProfile();

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    // In a real app, this would post to an API
    console.log('Posting comment:', newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

      {/* New Comment Input */}
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 ring-2 ring-primary/10">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar} alt={profile.username} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary">
            {profile.username[0]?.toUpperCase() || 'G'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Share your thoughts about this anime..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-border">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

export default CommentSection;
