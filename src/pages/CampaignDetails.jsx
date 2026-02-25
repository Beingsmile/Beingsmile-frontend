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

const CampaignDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [donationAmount, setDonationAmount] = useState(50);
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

  const { data: data, isLoading, isError, error } = useCampaignDetails(id);
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
    <div className="bg-neutral min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-12 p-6 bg-green-50 rounded-[2rem] border-2 border-green-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
            <div>
              <p className="text-sm font-black text-green-900 uppercase tracking-tight">Donation Successful!</p>
              <p className="text-sm text-green-700 font-medium">Thank you for your incredible support. Your gift has been received.</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-16 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              {campaign.category}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <FiShield className="text-primary" /> Verified Mission
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight font-sans leading-tight">
            {campaign.title}
          </h1>
          <div className="flex flex-wrap items-center gap-8 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent">
                <FiUser size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Created By</p>
                <p className="text-sm font-black text-gray-900">{campaign.creator?.name || "Anonymous Member"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-500">
                <FiActivity size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Time Remaining</p>
                <p className="text-sm font-black text-gray-900">{daysLeft > 0 ? `${daysLeft} Days Left` : "Ended"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center text-green-500">
                <FiHeart size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Supporters</p>
                <p className="text-sm font-black text-gray-900">{campaign.supporters || 0} People</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column (8/12) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Gallery */}
            <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 border-8 border-white bg-white group">
              <Slider {...sliderSettings} className="campaign-slider">
                <div className="aspect-[16/9] relative">
                  <img src={campaign.coverImage} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                </div>
                {campaign.images?.map((image, index) => (
                  <div key={index} className="aspect-[16/9] relative">
                    <img src={image} alt={`${campaign.title} ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Content Tabs/Sections */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-50 space-y-10">
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 flex items-center gap-2">
                  <FiHeart className="animate-pulse" /> The Mission Story
                </h2>
                <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-gray-900">
                  {campaign.description?.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Updates */}
              {campaign.updates?.length > 0 && (
                <section className="pt-10 border-t border-gray-50">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Latest Updates ({campaign.updates.length})</h2>
                  <div className="space-y-8">
                    {campaign.updates.map((update, index) => (
                      <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-1 before:bg-primary/10">
                        <div className="absolute left-[-4px] top-1 w-3 h-3 rounded-full bg-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                          {new Date(update?.postedAt)?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <h4 className="text-lg font-black text-gray-900 mb-2">{update?.title}</h4>
                        <p className="text-gray-600 font-medium leading-relaxed">{update?.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-50">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Words of Kindness ({comments.length})</h2>

              <form onSubmit={handleCommentSubmit} className="mb-12 relative group">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Leave a message of hope..."
                  className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white p-8 rounded-[2rem] text-sm font-bold text-gray-900 placeholder-gray-400 transition-all outline-none resize-none"
                  rows="3"
                  disabled={addCommentMutation.isLoading}
                />
                <div className="absolute bottom-4 right-4">
                  {user ? (
                    <button
                      type="submit"
                      disabled={!newComment.trim() || addCommentMutation.isLoading}
                      className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {addCommentMutation.isLoading ? <FiLoader className="animate-spin" /> : "Post"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAuth("login")}
                      className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl"
                    >
                      Login to Post
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-8">
                {isLoadingComments ? (
                  <div className="py-12 flex justify-center"><FiLoader className="text-2xl text-primary animate-spin" /></div>
                ) : comments.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <FiMessageSquare className="mx-auto text-4xl text-gray-100" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No words of hope yet</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-6 items-start group">
                      <div className="w-12 h-12 rounded-2xl bg-neutral flex items-center justify-center text-primary font-black uppercase border-2 border-transparent group-hover:border-primary/20 transition-all">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{comment.user?.name || "Anonymous"}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed bg-neutral/50 p-6 rounded-3xl group-hover:bg-white transition-all">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">

              {/* Support Card */}
              <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary/10 border-4 border-primary/5">
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Amount Collected</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-gray-900">${campaign.currentAmount?.toLocaleString()}</span>
                      <span className="text-sm font-black text-gray-400 capitalize">of ${campaign.goalAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-neutral rounded-full h-4 overflow-hidden border border-gray-100">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percentageFunded}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-primary">{percentageFunded}% Collected</span>
                      <span className="text-gray-400 tracking-tighter">Support the mission</span>
                    </div>
                  </div>

                  {daysLeft > 0 && (
                    <div className="bg-neutral p-6 rounded-3xl border border-gray-50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">Campaign Closes In</p>
                      <CountdownRenderer endDate={campaign.endDate} />
                    </div>
                  )}

                  <div className="space-y-6 pt-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <FiDollarSign className="text-primary font-black scale-125" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white px-12 py-6 rounded-2xl text-2xl font-black text-gray-900 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[25, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setDonationAmount(amt)}
                          className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${donationAmount === amt ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-neutral text-gray-500 hover:bg-gray-100"}`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    <Payment campaignId={id} amount={donationAmount} />
                  </div>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-accent rounded-[3rem] p-8 text-white space-y-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                  <FiShield />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight">Smile Promise</h3>
                  <p className="text-sm font-medium text-white/80 leading-relaxed">We guarantee that 100% of your donation will reach the cause directly. No hidden fees, no strings attached.</p>
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 text-center">Amplify the Cause</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <FiFacebook />, label: "Facebook", bg: "bg-[#1877F2]/10 text-[#1877F2]" },
                    { icon: <FiTwitter />, label: "Twitter", bg: "bg-[#1DA1F2]/10 text-[#1DA1F2]" },
                    { icon: <FiLink />, label: "Copy Link", bg: "bg-gray-100 text-gray-500" },
                  ].map((social, idx) => (
                    <button key={idx} className={`w-full aspect-square rounded-2xl flex items-center justify-center text-xl transition-all hover:scale-110 ${social.bg}`}>
                      {social.icon}
                    </button>
                  ))}
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
