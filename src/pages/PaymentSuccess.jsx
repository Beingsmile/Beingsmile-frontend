import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiCheck, FiMail, FiExternalLink, FiCopy, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tid = searchParams.get("tid");
  const amount = searchParams.get("amount");
  const [transaction, setTransaction] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyTid = () => {
    if (tid) {
      navigator.clipboard.writeText(tid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Transaction ID copied!");
    }
  };

  useEffect(() => {
    const fetchTrx = async () => {
      try {
        const res = await axiosInstance.get(`/payment/transaction/${tid}`);
        setTransaction(res.data.transaction);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
      } finally {
        setFetching(false);
      }
    };
    if (tid) fetchTrx();
  }, [tid]);

  const downloadReceipt = () => {
    try {
      const doc = new jsPDF();
      const t = transaction || {};
      
      // Header & Branding
      doc.setFontSize(26);
      doc.setTextColor(27, 67, 50); // Dark emerald
      doc.text("BeingSmile", 105, 25, { align: "center" });
      
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.setFont("helvetica", "bold");
      doc.text("HUMANITARIAN FOUNDATION · OFFICIAL TRANSCRIPT", 105, 32, { align: "center" });
      
      // Divider
      doc.setDrawColor(45, 106, 79);
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);

      // Section: Contributor
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("CONTRIBUTOR DETAILS", 20, 50);
      
      doc.setFontSize(12);
      doc.setTextColor(33);
      doc.setFont("helvetica", "bold");
      doc.text(t.customerName || "Anonymous Supporter", 20, 58);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`${t.customerEmail || "N/A"} | ${t.customerPhone || "N/A"}`, 20, 64);

      // Transaction Table
      const tableData = [
        ["MISSION SUPPORTED", t.campaignTitle || "Humanitarian Aid"],
        ["TRANSACTION ID", tid || "N/A"],
        ["PAYMENT MEDIUM", t.paymentMethod || "Aamarpay Secure"],
        ["DATE", t.donatedAt ? new Date(t.donatedAt).toLocaleString() : new Date().toLocaleString()],
        ["STATUS", "VERIFIED SUCCESSFUL"],
      ];

      autoTable(doc, {
        startY: 75,
        head: [["DESCRIPTION", "DETAILS"]],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [27, 67, 50], fontSize: 10, halign: 'center' },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold', textColor: [27, 67, 50] },
          1: { cellWidth: 'auto' }
        }
      });

      // Financial Ledger
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("FINANCIAL LEDGER", 20, finalY);

      const ledgerData = [
        ["MISSION GIFT", `BDT ${(t.netAmount || amount || 0).toLocaleString()}`],
        ["PLATFORM SUPPORT FEE", `BDT ${(t.platformFee || 0).toLocaleString()}`],
        ["TOTAL PAID", `BDT ${(t.amount || amount || 0).toLocaleString()}`],
      ];

      autoTable(doc, {
        startY: finalY + 5,
        body: ledgerData,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 100, fontStyle: 'bold' },
          1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: (data) => {
           if (data.row.index === 2) {
             data.cell.styles.textColor = [27, 67, 50];
             data.cell.styles.fontSize = 12;
           }
        }
      });

      // Verification Stamp
      const stampY = doc.lastAutoTable.finalY + 25;
      doc.setDrawColor(200);
      doc.setLineWidth(0.1);
      doc.line(20, stampY, 190, stampY);
      
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("BeingSmile Foundation is a registered non-profit. This transcript serves as an official proof of contribution.", 105, stampY + 10, { align: "center" });
      doc.setFontSize(11);
      doc.setTextColor(45, 106, 79);
      doc.setFont("helvetica", "bold");
      doc.text("Thank you for your humanity.", 105, stampY + 22, { align: "center" });

      doc.save(`BeingSmile_Receipt_${tid}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FBF4] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 sm:p-12 max-w-lg w-full text-center border border-emerald-50">
        <div className="mb-6 flex justify-center">
          <div className="bg-emerald-100 rounded-3xl p-5 animate-pulse">
            <FiCheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">
          Gift <span className="text-emerald-500">Received!</span>
        </h1>
        <p className="text-gray-500 mb-10 font-medium leading-relaxed">
          Your contribution has been successfully verified. A digital receipt has been dispatched to your email.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-10 text-left border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform" />
          
          <div className="relative space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900 font-mono tracking-tight">{tid}</span>
                  <button 
                    onClick={copyTid}
                    className={`p-2 rounded-lg transition-all ${copied ? "bg-emerald-500 text-white" : "bg-white text-gray-400 hover:text-emerald-600 border border-gray-100 shadow-sm"}`}
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Final Amount</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">৳{amount}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full border border-emerald-200"> Verified </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-200"
          >
            <FiDownload size={15} /> Download Receipt
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-emerald-700 border-2 border-emerald-100 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
          >
            Go To Home <FiExternalLink size={15} />
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-emerald-600/60 font-black text-[10px] uppercase tracking-widest">
          <FiMail /> Detailed receipt sent to email
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
