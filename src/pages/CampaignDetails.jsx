import { useState, useContext, useEffect } from "react";
import { useOutletContext, useParams, useLocation } from "react-router";
import { useCampaignDetails } from "../hooks/useCampaign";
import Payment from "../components/Payment";
import {
  FiHeart,
  FiShare2,
  FiClock,
  FiDollarSign,
  FiUser,
  FiFacebook,
  FiTwitter,
  FiLink,
  FiMessageSquare,
  FiLoader,
  FiCheckCircle,
  FiShield,
  FiActivity,
  FiEdit3,
} from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CountdownRenderer from "../components/CountdownRenderer";
import { useGetComments, useAddComment } from "../hooks/useComments";
import { AuthContext } from "../contexts/AuthProvider";
import heroImage from "../assets/hero.jpg";

const CampaignDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [donationAmount, setDonationAmount] = useState(500);
  const [newComment, setNewComment] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useContext(AuthContext);
  const { setAuth } = useOutletContext();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (location.state?.paymentSuccess) {
      setShowSuccessMessage(true);
      window.history.replaceState({}, document.title);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [location]);

  const { data, isLoading, isError, error } = useCampaignDetails(id);
  const { data: comments = [], isLoading: isLoadingComments } = useGetComments(id);
  const addCommentMutation = useAddComment(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Loading Mission Details</p>
      </div>
    );
  }

  const campaign = data?.campaign;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await addCommentMutation.mutateAsync({
        text: newComment,
        user: {
          _id: user?.data?._id,
          name: user?.data?.name,
        },
      });
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  if (isError) return <div className="text-center py-40 text-red-500 font-black">Error: {error.message}</div>;
  if (!campaign) return <div className="text-center py-40 font-black">Campaign not found</div>;

  const percentageFunded = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-neutral min-h-screen pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 p-6 bg-green-50 border border-green-100 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center text-xl shadow-lg shadow-green-100">
              <FiCheckCircle />
            </div>
            <div>
              <p className="text-sm font-black text-green-900 uppercase tracking-tight">Mission Accomplished!</p>
              <p className="text-sm text-green-700 font-medium">Thank you for being a hero. Your contribution has been recorded.</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
              {campaign.category}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
              <FiShield className="text-primary" size={12} /> Verified Mission
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-sans uppercase">
            {campaign.title}
          </h1>
          <div className="flex flex-wrap items-center gap-8 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral flex items-center justify-center text-gray-400 border border-gray-100">
                <FiUser size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 leading-none mb-1">Creator</p>
                <p className="text-sm font-black text-gray-900">{campaign.creator?.name || "Member"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral flex items-center justify-center text-gray-400 border border-gray-100">
                <FiActivity size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 leading-none mb-1">Timeline</p>
                <p className="text-sm font-black text-gray-900">{daysLeft > 0 ? `${daysLeft} Days Left` : "Ended"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Main Visual */}
            <div className="bg-white rounded-[2.5rem] border-4 border-white shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="aspect-[16/9] relative scale-[0.99] rounded-[2rem] overflow-hidden m-2">
                <img src={campaign.coverImage || heroImage} alt={campaign.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-lg shadow-gray-100/50 border border-gray-50 space-y-10">
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                  <FiHeart /> The Mission Story
                </h2>
                <div className="prose prose-lg max-w-none prose-p:text-gray-500 prose-p:font-medium prose-p:leading-relaxed italic prose-p:mb-6">
                  {campaign.description?.split("\n").map((paragraph, i) => (
                    <p key={i}>"{paragraph}"</p>
                  ))}
                </div>
              </section>

              {/* Comments */}
              <section className="pt-10 border-t border-gray-50">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Words of Kindness ({comments.length})</h2>
                <div className="space-y-6">
                  {comments.slice(0, 3).map((comment) => (
                    <div key={comment._id} className="flex gap-4 p-6 bg-neutral/50 rounded-2xl border border-gray-50">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary font-black uppercase border border-gray-100 shadow-sm">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-900 uppercase mb-1">{comment.user?.name || "Anonymous"}</p>
                        <p className="text-sm text-gray-500 italic">"{comment.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Support Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 border border-gray-50">
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 italic">Raised Amount</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-gray-900">৳{campaign.currentAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full bg-neutral rounded-full h-3 overflow-hidden border border-gray-100">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percentageFunded}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-primary">{percentageFunded}% Goal</span>
                      <span className="text-gray-300">৳{campaign.goalAmount?.toLocaleString()} Target</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary font-black">
                        ৳
                      </div>
                      <input
                        type="number"
                        min="10"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(Math.max(10, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white px-10 py-4 rounded-xl text-xl font-black text-gray-900 outline-none transition-all shadow-inner"
                      />
                    </div>
                    <Payment campaignId={id} amount={donationAmount} />
                  </div>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-accent rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 text-[8rem] text-white/10 rotate-12 select-none group-hover:rotate-0 transition-transform duration-1000">
                  <FiShield />
                </div>
                <div className="relative z-10 space-y-4 font-sans">
                  <h3 className="text-lg font-black uppercase tracking-tight">Humanitarian Trust</h3>
                  <p className="text-xs font-medium text-white/90 leading-relaxed italic">"We guarantee that 100% of your donation will reach the mission directly. No hidden fees."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
