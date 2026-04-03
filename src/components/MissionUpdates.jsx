import { useState } from "react";
import {
  FiRss, FiChevronDown, FiChevronUp, FiLoader, FiImage, FiX, FiPlus, FiUpload,
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitCampaignUpdate } from "../api/campaign";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const toBase64 = (f) =>
  new Promise((res) => { const r = new FileReader(); r.onloadend = () => res(r.result); r.readAsDataURL(f); });

const timeStr = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// ── Single Update Card ────────────────────────────────────────────────────────
const UpdateCard = ({ update, isLatest }) => {
  const [expanded, setExpanded] = useState(isLatest);
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isLatest ? "border-[#2D6A4F]" : "border-[#E5F0EA]"}`}>
      <button
        onClick={() => setExpanded((p) => !p)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left ${isLatest ? "bg-[#F0FBF4]" : "bg-white"}`}
      >
        <div className="flex items-center gap-3">
          {isLatest && (
            <span className="px-2 py-0.5 bg-[#2D6A4F] text-white text-[9px] font-bold rounded-full">LATEST</span>
          )}
          <div>
            <p className="text-sm font-bold text-gray-900">{update.title}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{timeStr(update.postedAt)}</p>
          </div>
        </div>
        <span className="text-gray-400">
          {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-[#E5F0EA]">
          {/* Image carousel */}
          {update.images?.length > 0 && (
            <div className="mt-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-[#F8FDFB] border border-[#E5F0EA]">
                <img src={update.images[imgIndex]} className="w-full h-full object-cover" alt="" />
              </div>
              {update.images.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-2">
                  {update.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? "bg-[#2D6A4F] scale-125" : "bg-[#D1EAD9]"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{update.content}</p>
        </div>
      )}
    </div>
  );
};

// ── Post Update Modal ─────────────────────────────────────────────────────────
const PostUpdateModal = ({ campaignId, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => submitCampaignUpdate(campaignId, {
      title: title.trim(),
      content: content.trim(),
      images: images.map((i) => i.base64),
    }),
    onSuccess: () => {
      toast.success("Update submitted for admin review!");
      qc.invalidateQueries(["campaign", campaignId]);
      onClose();
    },
    onError: () => toast.error("Failed to submit update"),
  });

  const handleImages = async (e) => {
    const files = Array.from(e.target.files).filter((f) => {
      if (f.size > MAX_FILE_SIZE) { toast.error(`"${f.name}" too large`); return false; }
      return true;
    });
    const results = await Promise.all(
      files.map(async (f) => ({ base64: await toBase64(f), preview: URL.createObjectURL(f) }))
    );
    setImages((p) => [...p, ...results].slice(0, 4));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#E5F0EA] shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-[#E5F0EA]">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Post Mission Update</h3>
            <p className="text-xs text-gray-400 mt-0.5">Will be reviewed by admin before publishing</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <FiX size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Update Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Treatment started — great progress!"
              className="w-full px-4 py-2.5 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-lg text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Update Content *</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share the latest news about this mission..."
              className="w-full px-4 py-2.5 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-lg text-sm outline-none resize-none"
            />
          </div>
          {/* Image upload */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Photos <span className="normal-case font-normal text-gray-400">(optional, up to 4)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#E5F0EA]">
                  <img src={img.preview} className="w-full h-full object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-md flex items-center justify-center"
                  >
                    <FiX size={9} />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square flex flex-col items-center justify-center bg-[#F8FDFB] border-2 border-dashed border-[#D1EAD9] rounded-lg cursor-pointer hover:border-[#2D6A4F] transition-colors">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                  <FiPlus size={16} className="text-gray-400" />
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-[#E5F0EA]">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 border border-[#E5F0EA] rounded-lg hover:border-gray-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending || !title.trim() || !content.trim()}
            className="px-5 py-2 bg-[#2D6A4F] text-white text-sm font-bold rounded-lg hover:bg-[#1B4332] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isPending ? <FiLoader size={13} className="animate-spin" /> : <FiUpload size={13} />}
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN MISSION UPDATES COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function MissionUpdates({ updates = [], campaignId, isCreator }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#E5F0EA] p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest flex items-center gap-2">
          <FiRss size={12} /> Mission Updates ({updates.length})
        </h2>
        {isCreator && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FBF4] border border-[#D1EAD9] text-[#2D6A4F] text-xs font-bold rounded-lg hover:bg-[#2D6A4F] hover:text-white transition-colors"
          >
            <FiPlus size={12} /> Post Update
          </button>
        )}
      </div>

      {updates.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-10 h-10 bg-[#F0FBF4] rounded-xl flex items-center justify-center text-[#2D6A4F] mx-auto mb-3">
            <FiRss size={18} />
          </div>
          <p className="text-xs font-semibold text-gray-400">No updates posted yet</p>
          {isCreator && (
            <p className="text-xs text-gray-400 mt-1">
              Keep your donors informed by posting progress updates!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((u, i) => (
            <UpdateCard key={u._id || i} update={u} isLatest={i === 0} />
          ))}
        </div>
      )}

      {showModal && (
        <PostUpdateModal campaignId={campaignId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
