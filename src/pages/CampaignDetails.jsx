import { useState, useContext, useEffect } from "react";
import { useOutletContext, useParams, useLocation, Link } from "react-router";
import { useCampaignDetails } from "../hooks/useCampaign";
import Payment from "../components/Payment";
import {
  FiHeart,
  FiShare2,
  FiUser,
  FiFacebook,
  FiTwitter,
  FiLink,
  FiMessageSquare,
  FiLoader,
  FiCheckCircle,
  FiShield,
  FiActivity,
  FiCalendar,
  FiMapPin,
  FiCopy,
} from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetComments, useAddComment } from "../hooks/useComments";
import { AuthContext } from "../contexts/AuthProvider";
import heroImage from "../assets/hero.jpg";
import { toast } from "react-toastify";

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
      setTimeout(() => setShowSuccessMessage(false), 6000);
    }
  }, [location]);

  const { data, isLoading, isError, error } = useCampaignDetails(id);
  const { data: comments = [], isLoading: isLoadingComments } = useGetComments(id);
  const addCommentMutation = useAddComment(id);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      await addCommentMutation.mutateAsync({
        text: newComment,
        user: { _id: user?.data?._id, name: user?.data?.name },
      });
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    autoplay: true,
    autoplaySpeed: 4500,
    cssEase: "ease-in-out",
    dotsClass: "slick-dots custom-green-dots",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F0FBF4]">
        <FiLoader className="text-3xl text-[#2D6A4F] animate-spin mb-3" />
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading Mission...</p>
      </div>
    );
  }

  if (isError) return <div className="text-center py-40 text-red-500 font-semibold">Error: {error.message}</div>;

  const campaign = data?.campaign;
  if (!campaign) return <div className="text-center py-40 font-semibold text-gray-500">Campaign not found</div>;

  const percentageFunded = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const allImages = [campaign.coverImage, ...(campaign.images || [])].filter(Boolean);

  return (
    <div className="bg-white min-h-screen pt-16 pb-20">

      {/* Payment Success Banner */}
      {showSuccessMessage && (
        <div className="fixed top-16 left-0 right-0 z-50 mx-auto max-w-2xl px-4 pt-4">
          <div className="bg-white border-2 border-[#2D6A4F] rounded-xl p-5 shadow-lg flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="w-11 h-11 bg-[#2D6A4F] text-white rounded-xl flex items-center justify-center flex-shrink-0">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Mission Accomplished!</h3>
              <p className="text-xs text-gray-500 mt-0.5">Your kindness just changed a life forever. Receipt emailed.</p>
            </div>
          </div>
        </div>
      )}

      {/* Mint page header strip */}
      <div className="bg-[#F0FBF4] border-b border-[#D1EAD9] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white border border-[#D1EAD9] text-[#2D6A4F] text-xs font-bold rounded-full">
              {campaign.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
              <FiShield size={11} className="text-[#2D6A4F]" /> Verified Mission
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 max-w-3xl leading-snug">
            {campaign.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E5F0EA] flex items-center justify-center text-gray-400">
                <FiUser size={13} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Creator</p>
                <p className="text-xs font-bold text-gray-800">{campaign.creator?.name || "Member"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E5F0EA] flex items-center justify-center text-gray-400">
                <FiCalendar size={13} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Timeline</p>
                <p className="text-xs font-bold text-gray-800">{daysLeft > 0 ? `${daysLeft} Days Left` : "Ended"}</p>
              </div>
            </div>
            {campaign.location && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E5F0EA] flex items-center justify-center text-gray-400">
                  <FiMapPin size={13} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Location</p>
                  <p className="text-xs font-bold text-gray-800">{campaign.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Image Carousel */}
            <div className="bg-[#F0FBF4] rounded-xl overflow-hidden border border-[#D1EAD9]">
              {allImages.length > 1 ? (
                <Slider {...sliderSettings} className="campaign-slider-green">
                  {allImages.map((img, idx) => (
                    <div key={idx} className="aspect-[16/9] outline-none">
                      <img src={img} alt={`${campaign.title}-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="aspect-[16/9]">
                  <img src={campaign.coverImage || heroImage} alt={campaign.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Mission Story */}
            <div className="bg-white rounded-xl border border-[#E5F0EA] p-6 md:p-8">
              <h2 className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest mb-5 flex items-center gap-2">
                <FiHeart size={12} /> The Mission Story
              </h2>
              <div className="space-y-4">
                {campaign.description?.split("\n").map((paragraph, i) => (
                  paragraph.trim() && (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed font-medium">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Verified Documents — admin/creator only */}
            {(user?.data?.role === "admin" || user?.data?.role === "moderator" || user?.data?._id === campaign.creator?._id) &&
              campaign.verificationDetails?.documents?.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5F0EA] p-6 md:p-8">
                  <h2 className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest mb-5 flex items-center gap-2">
                    <FiShield size={12} /> Mission Integrity Proof
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {campaign.verificationDetails.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square bg-[#F0FBF4] rounded-xl overflow-hidden border border-[#D1EAD9] hover:border-[#2D6A4F] transition-all flex items-center justify-center"
                      >
                        {doc.match(/\.(pdf)$/i) ? (
                          <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#2D6A4F]">
                            <FiActivity size={20} />
                            <span className="text-[10px] font-bold uppercase">Document {idx + 1}</span>
                          </div>
                        ) : (
                          <img src={doc} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Proof" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            {/* Kindness Wall */}
            <div className="bg-white rounded-xl border border-[#E5F0EA] p-6 md:p-8">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">Kindness Wall</h2>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">Recent Heroes</h3>
                </div>
                <span className="px-3 py-1 bg-[#F0FBF4] border border-[#D1EAD9] text-[#2D6A4F] text-xs font-bold rounded-full">
                  {campaign.donations?.length || 0} Contributions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {campaign.donations?.length > 0 ? (
                  [...campaign.donations].reverse().slice(0, 6).map((donation, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] hover:border-[#2D6A4F] transition-all">
                      <div className="w-10 h-10 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {donation.isAnonymous ? "H" : (donation.donor?.name?.charAt(0) || "D")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {donation.isAnonymous ? "Anonymous Hero" : (donation.donor?.name || "Kind Donor")}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(donation.donatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm font-black text-[#2D6A4F] flex-shrink-0">৳{donation.amount}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center bg-[#F0FBF4] rounded-xl border border-dashed border-[#D1EAD9]">
                    <p className="text-xs font-semibold text-gray-400">Be the first hero of this mission</p>
                  </div>
                )}
              </div>
            </div>

            {/* Comments / Kindness Notes */}
            <div className="bg-white rounded-xl border border-[#E5F0EA] p-6 md:p-8">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest flex items-center gap-2">
                  <FiMessageSquare size={12} /> Kindness Notes ({comments.length})
                </h2>
              </div>

              <div className="space-y-3 mb-5">
                {comments.slice(0, 4).map((comment) => (
                  <div key={comment._id} className="flex gap-3 p-4 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA]">
                    <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {comment.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 mb-1">{comment.user?.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">"{comment.text}"</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center py-8 text-xs font-semibold text-gray-300">Be the first to share kindness</p>
                )}
              </div>

              {/* Add comment */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a note of kindness..."
                    className="flex-1 px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-lg text-sm outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={addCommentMutation.isPending}
                    className="px-5 py-3 bg-[#2D6A4F] text-white text-xs font-bold rounded-lg hover:bg-[#1B4332] transition-colors disabled:opacity-50"
                  >
                    Post
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setAuth("login")}
                  className="w-full py-3 border border-dashed border-[#D1EAD9] text-xs font-semibold text-gray-400 hover:text-[#2D6A4F] hover:border-[#2D6A4F] rounded-xl transition-all"
                >
                  Login to leave a note of kindness →
                </button>
              )}
            </div>

            {/* Share section */}
            <div className="bg-[#F0FBF4] rounded-xl border border-[#D1EAD9] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">Share this Mission</p>
                <p className="text-xs text-gray-500 mt-0.5">Help spread the word and multiply the impact</p>
              </div>
              <div className="flex gap-2">
                {[
                  { Icon: FiFacebook, href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                  { Icon: FiTwitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}` },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white border border-[#D1EAD9] flex items-center justify-center text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
                  >
                    <Icon size={15} />
                  </a>
                ))}
                <button
                  onClick={handleCopyLink}
                  className="w-9 h-9 rounded-lg bg-white border border-[#D1EAD9] flex items-center justify-center text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
                >
                  <FiCopy size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column — sticky donation card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">

              {/* Donation card */}
              <div className="bg-white rounded-xl border border-[#E5F0EA] shadow-sm p-6">
                {/* Amount raised */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Raised</p>
                  <p className="text-3xl font-black text-gray-900">৳{campaign.currentAmount?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">of ৳{campaign.goalAmount?.toLocaleString()} goal</p>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="w-full bg-[#F0FBF4] rounded-full h-2">
                    <div
                      className="bg-[#2D6A4F] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percentageFunded}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold mt-1.5">
                    <span className="text-[#2D6A4F]">{percentageFunded}% funded</span>
                    <span className="text-gray-400">{daysLeft > 0 ? `${daysLeft} days left` : "Ended"}</span>
                  </div>
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDonationAmount(amt)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        donationAmount === amt
                          ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                          : "bg-white text-gray-600 border-[#E5F0EA] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative mb-4">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#2D6A4F] font-bold text-sm">৳</span>
                  <input
                    type="number"
                    min="10"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Math.max(10, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] pl-9 pr-4 py-3 rounded-lg text-base font-bold text-gray-900 outline-none transition-all"
                  />
                </div>

                <Payment campaignId={id} amount={donationAmount} />
              </div>

              {/* Trust badge */}
              <div className="bg-[#1B4332] rounded-xl p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#2D6A4F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiShield size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-1">100% Secure Giving</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Every taka you donate reaches the mission directly. Zero hidden fees, government-level audit trail.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F0FBF4] rounded-xl p-4 border border-[#D1EAD9]">
                  <p className="text-xl font-black text-[#2D6A4F]">{campaign.donations?.length || 0}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Contributors</p>
                </div>
                <div className="bg-[#F0FBF4] rounded-xl p-4 border border-[#D1EAD9]">
                  <p className="text-xl font-black text-[#2D6A4F]">{daysLeft > 0 ? daysLeft : 0}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Days Left</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .campaign-slider-green .slick-dots {
          bottom: 12px !important;
        }
        .campaign-slider-green .slick-dots li button:before {
          color: white !important;
          opacity: 0.5;
          font-size: 8px !important;
        }
        .campaign-slider-green .slick-dots li.slick-active button:before {
          color: white !important;
          opacity: 1;
          font-size: 10px !important;
        }
      `}</style>
    </div>
  );
};

export default CampaignDetails;
