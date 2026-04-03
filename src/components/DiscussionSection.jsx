import { useState, useContext } from "react";
import { FiMessageSquare, FiCornerDownRight, FiLoader, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { addComment, addReply, getComments } from "../api/campaign";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { Link } from "react-router";

const avatar = (name, size = "w-8 h-8") =>
  <div className={`${size} rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
    {(name || "?")[0].toUpperCase()}
  </div>;

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString();
};

// ── Single Reply ──────────────────────────────────────────────────────────────
const ReplyItem = ({ reply }) => (
  <div className="flex gap-2.5 pl-10 py-2">
    <div className="flex-shrink-0 mt-0.5">
      {reply.user?.avatar
        ? <img src={reply.user.avatar} className="w-7 h-7 rounded-lg object-cover" alt="" />
        : avatar(reply.name, "w-7 h-7")}
    </div>
    <div className="flex-1 bg-[#F8FDFB] rounded-lg p-3 border border-[#E5F0EA]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold text-gray-800">{reply.name || "Anonymous"}</span>
        <span className="text-[10px] text-gray-400">{timeAgo(reply.createdAt)}</span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{reply.text}</p>
    </div>
  </div>
);

// ── Single Comment ────────────────────────────────────────────────────────────
const CommentItem = ({ comment, campaignId, user, onAuthRequired }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const qc = useQueryClient();

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user) { onAuthRequired(); return; }
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      await addReply(campaignId, comment._id, replyText.trim());
      setReplyText("");
      setShowReplyBox(false);
      setShowReplies(true);
      qc.invalidateQueries(["comments", campaignId]);
      toast.success("Reply posted!");
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="border border-[#E5F0EA] rounded-xl overflow-hidden">
      {/* Comment body */}
      <div className="flex gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">
          {comment.user?.avatar
            ? <img src={comment.user.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
            : avatar(comment.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-xs font-bold text-gray-900">{comment.name || "Anonymous"}</span>
            <span className="text-[10px] text-gray-400">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">"{comment.text}"</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => {
                if (!user) { onAuthRequired(); return; }
                setShowReplyBox((p) => !p);
              }}
              className="text-[10px] font-bold text-[#2D6A4F] flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <FiCornerDownRight size={10} /> Reply
            </button>
            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies((p) => !p)}
                className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-[#2D6A4F] transition-colors"
              >
                {showReplies ? <FiChevronUp size={10} /> : <FiChevronDown size={10} />}
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply box */}
      {showReplyBox && (
        <form onSubmit={handleReply} className="px-4 pb-3 flex gap-2 border-t border-[#E5F0EA]">
          <div className="w-6 h-6 rounded-md bg-[#2D6A4F] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-2.5">
            {user?.data?.name?.[0] || "?"}
          </div>
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-3 py-2 text-xs bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-lg outline-none mt-2"
          />
          <button
            type="submit"
            disabled={replyLoading || !replyText.trim()}
            className="mt-2 px-3 py-2 bg-[#2D6A4F] text-white text-xs font-bold rounded-lg hover:bg-[#1B4332] disabled:opacity-50 transition-colors"
          >
            {replyLoading ? <FiLoader size={12} className="animate-spin" /> : "Reply"}
          </button>
        </form>
      )}

      {/* Replies */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="border-t border-[#E5F0EA] bg-[#FAFFFE] py-1 divide-y divide-[#F0FBF4]">
          {comment.replies.map((r) => <ReplyItem key={r._id} reply={r} />)}
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN DISCUSSION SECTION
// ═════════════════════════════════════════════════════════════════
export default function DiscussionSection({ campaignId, setAuth }) {
  const { user } = useContext(AuthContext);
  const qc = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["comments", campaignId, page],
    queryFn: () => getComments(campaignId, page),
    keepPreviousData: true,
  });

  const comments = data?.comments || [];
  const totalPages = data?.totalPages || 1;

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { setAuth("login"); return; }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      await addComment(campaignId, commentText.trim());
      setCommentText("");
      qc.invalidateQueries(["comments", campaignId]);
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5F0EA] p-6 md:p-8" id="discussion">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest flex items-center gap-2">
          <FiMessageSquare size={12} /> Discussion ({data?.total || 0})
        </h2>
      </div>

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleComment} className="flex gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
            {user?.data?.name?.[0] || "?"}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share a thought, question, or word of support..."
              className="flex-1 px-4 py-2.5 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-lg text-sm outline-none transition-all"
            />
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className="px-4 py-2.5 bg-[#2D6A4F] text-white text-xs font-bold rounded-lg hover:bg-[#1B4332] disabled:opacity-50 transition-colors"
            >
              {commentLoading ? <FiLoader size={13} className="animate-spin" /> : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAuth("login")}
          className="w-full mb-6 py-3 border border-dashed border-[#D1EAD9] text-xs font-semibold text-gray-400 hover:text-[#2D6A4F] hover:border-[#2D6A4F] rounded-xl transition-all"
        >
          Login to join the discussion →
        </button>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="py-8 flex justify-center">
          <FiLoader className="animate-spin text-[#2D6A4F]" size={20} />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xs font-semibold text-gray-300">No comments yet — be the first to share a note of kindness</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              campaignId={campaignId}
              user={user}
              onAuthRequired={() => setAuth("login")}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                page === p
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-[#F0FBF4] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
