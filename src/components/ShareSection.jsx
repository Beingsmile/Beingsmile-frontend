import { useState } from "react";
import { FiShare2, FiCopy, FiCheck, FiCode, FiX, FiFacebook, FiTwitter } from "react-icons/fi";
import { toast } from "react-toastify";

const getUrl = (id) => `${window.location.origin}/campaigns/${id}`;
const getEmbedCode = (id) =>
  `<iframe src="${window.location.origin}/embed/campaigns/${id}" width="360" height="480" frameborder="0" style="border-radius:12px;border:1px solid #E5F0EA;" allowtransparency="true"></iframe>`;

export default function ShareSection({ campaignId, campaignTitle }) {
  const [copied, setCopied] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const url = getUrl(campaignId);
  const embedCode = getEmbedCode(campaignId);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Support "${campaignTitle}" on BeingSmile`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${campaignTitle} — ${url}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E5F0EA] p-5">
        <h3 className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest mb-4 flex items-center gap-2">
          <FiShare2 size={12} /> Spread the Word
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Facebook */}
          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiFacebook size={13} /> Facebook
          </a>

          {/* Twitter / X */}
          <a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
          >
            <FiTwitter size={13} /> Twitter/X
          </a>

          {/* WhatsApp */}
          <a
            href={shareUrls.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
          >
            <span className="text-sm leading-none">💬</span> WhatsApp
          </a>

          {/* LinkedIn */}
          <a
            href={shareUrls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-colors"
          >
            <span className="text-sm leading-none">in</span> LinkedIn
          </a>
        </div>

        {/* Copy link */}
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-[#F8FDFB] border border-[#E5F0EA] rounded-lg text-[10px] text-gray-500 font-mono truncate">
            {url}
          </div>
          <button
            onClick={copyLink}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              copied
                ? "bg-[#2D6A4F] text-white"
                : "border border-[#E5F0EA] text-gray-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
            }`}
          >
            {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Embed */}
        <button
          onClick={() => setEmbedOpen(true)}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 border border-dashed border-[#E5F0EA] rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
        >
          <FiCode size={12} /> Embed on your website
        </button>
      </div>

      {/* Embed Modal */}
      {embedOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E5F0EA] shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-[#E5F0EA]">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Embed This Mission</h3>
                <p className="text-xs text-gray-400 mt-0.5">Copy the code below and paste it into your website or blog</p>
              </div>
              <button onClick={() => setEmbedOpen(false)} className="text-gray-400 hover:text-gray-700">
                <FiX size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="relative">
                <pre className="bg-[#F8FDFB] border border-[#E5F0EA] rounded-lg p-4 text-[10px] text-gray-600 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                  {embedCode}
                </pre>
                <button
                  onClick={copyEmbed}
                  className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                    embedCopied ? "bg-[#2D6A4F] text-white" : "bg-white border border-[#E5F0EA] text-gray-600"
                  }`}
                >
                  {embedCopied ? <FiCheck size={10} /> : <FiCopy size={10} />}
                  {embedCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                The embedded widget will show live donation progress and a donate button.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
