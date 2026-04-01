import { FiX, FiDownload } from "react-icons/fi";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <a 
            href={imageUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20"
            title="Open Original"
          >
            <FiDownload />
          </a>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20"
          >
            <FiX />
          </button>
        </div>

        {/* Image Container */}
        <div className="w-full h-full flex items-center justify-center bg-neutral/50 p-2">
            <img 
                src={imageUrl} 
                alt="Full Preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-lg"
            />
        </div>

        {/* Footer/Info */}
        <div className="p-4 bg-white flex justify-center border-t border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Resolution Mission Evidence</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
