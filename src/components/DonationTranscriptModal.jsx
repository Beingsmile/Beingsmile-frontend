import { FiX, FiShield, FiCalendar, FiArrowRight, FiInfo, FiPrinter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const DonationTranscriptModal = ({ isOpen, onClose, donation }) => {
  if (!isOpen || !donation) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Branded Header */}
          <div className="bg-[#1B4332] p-8 text-white relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Humanitarian <span className="text-emerald-400">Transcript</span></h2>
                <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase mt-1">Official Beingsmile Foundation Record</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Transcript Content */}
          <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
            
            {/* Contributor Section */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Contributor</p>
                <p className="text-sm font-black text-gray-900">{donation.donorName || "Anonymous Supporter"}</p>
                <p className="text-[10px] font-bold text-gray-500">{donation.donorEmail || "private@beingsmile.org"}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Donated At</p>
                <p className="text-sm font-black text-gray-900">
                  {new Date(donation.donatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Ref: {donation.transactionId?.slice(-12)}</p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="bg-[#F8FDFB] rounded-[2rem] p-6 border border-[#E5F0EA] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EDFAF3] text-[#2D6A4F] rounded-2xl flex items-center justify-center border border-[#C8EDDA]">
                 <FiShield size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Global Mission Supported</p>
                <h3 className="text-base font-black text-gray-900 leading-snug">{donation.campaignTitle}</h3>
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-100 pb-2">Financial Breakdown</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-500">Mission Gift</span>
                  <span className="font-black text-gray-900">৳{donation.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-500">Platform Support Fee</span>
                  <span className="font-black text-gray-900">৳{donation.platformFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm italic">
                   <span className="font-medium text-gray-400 text-xs">Processing Channel</span>
                   <span className="font-bold text-gray-500 text-xs uppercase">{donation.paymentMethod}</span>
                </div>
                <div className="pt-4 border-t-2 border-[#2D6A4F] flex justify-between items-end">
                   <div>
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Humanitarian Aid</p>
                     <p className="text-3xl font-black text-[#1B4332]">৳{donation.totalAmount?.toLocaleString()}</p>
                   </div>
                   <div className="bg-[#EDFAF3] px-3 py-1.5 rounded-lg border border-[#C8EDDA]">
                      <span className="text-[9px] font-black text-[#2D6A4F] uppercase">Payment Verified</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Footer / Notes */}
            <div className="flex gap-4 p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <FiInfo className="text-amber-500 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] text-amber-800/70 font-bold leading-relaxed uppercase tracking-wider">
                This document is an official record of Beingsmile Foundation. For tax purposes, please use the PDF version available via email.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
             <button
               onClick={() => window.print()}
               className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
             >
               <FiPrinter size={14} /> Print Transcript
             </button>
             <button
               onClick={onClose}
               className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-black transition-all shadow-md cursor-pointer"
             >
               Close Document
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DonationTranscriptModal;
