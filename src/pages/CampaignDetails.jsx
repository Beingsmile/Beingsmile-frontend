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

    // Check if redirected after successful payment
    if (location.state?.paymentSuccess) {
      setShowSuccessMessage(true);
      // Clear the state
      window.history.replaceState({}, document.title);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [location]);

  const { data: data, isLoading, isError, error } = useCampaignDetails(id);

  const { data: comments = [], isLoading: isLoadingComments } =
    useGetComments(id);
  const addCommentMutation = useAddComment(id);
  if (isLoading)
    return <div className="text-center py-20">Loading campaign details...</div>;

  const campaign = data?.campaign;

  // const handleDonate = () => {
  //   console.log(`Donating $${donationAmount} to campaign ${id}`);
  // };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await addCommentMutation.mutateAsync({
        text: newComment,
        user: {
          _id: user?.data?._id,
          name: user?.data?.name,
          // include other needed user fields
        },
      });
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      // Optionally show error to user
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

  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!campaign)
    return <div className="text-center py-20">Campaign not found</div>;

  const percentageFunded = Math.min(
    Math.round((campaign.currentAmount / campaign.goalAmount) * 100),
    100
  );
  const daysLeft = Math.ceil(
    (new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Thank you for your donation! Your contribution has been received.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8 text-center lg:text-left">
        <div className="inline-block bg-blue-100 dark:bg-blue-900/30 px-4 py-1 rounded-full mb-3">
          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium capitalize">
            {campaign.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {campaign.title}
        </h1>
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-gray-600 dark:text-gray-400 mb-6">
          <span className="flex items-center">
            <FiUser className="mr-2 text-blue-500" />
            <span>by {campaign.creator?.name || "Anonymous"}</span>
          </span>
          <span className="flex items-center">
            <FiClock className="mr-2 text-blue-500" />
            <span>
              {daysLeft > 0 ? `${daysLeft} days left` : "Campaign ended"}
            </span>
          </span>
          <span className="flex items-center">
            <FiHeart className="mr-2 text-blue-500" />
            <span>{campaign.supporters || 0} supporters</span>
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Slider {...sliderSettings}>
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={campaign.coverImage}
                  alt={campaign.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              {campaign.images?.map((image, index) => (
                <div key={index} className="aspect-w-16 aspect-h-9">
                  <img
                    src={image}
                    alt={`${campaign.title} ${index + 1}`}
                    className="w-full h-96 object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Countdown Timer */}
          {/* {daysLeft > 0 && (
            <div className="flex justify-center items-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
              <CountdownRenderer endDate={campaign.endDate} />
            </div>
          )} */}

          {/* Campaign Story */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
              Our Story
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              {campaign.description?.split("\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-5 text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Updates */}
          {campaign.updates?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Updates ({campaign.updates.length})
              </h2>
              <div className="space-y-8">
                {campaign.updates.map((update, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                        <FiEdit3 className="text-blue-600 dark:text-blue-400 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {update?.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {update?.content}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(update?.postedAt)?.toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    {index < campaign.updates.length - 1 && (
                      <div className="mt-6 mb-6 border-t border-gray-200 dark:border-gray-700"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
              Comments ({comments.length})
            </h2>

            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                    {user?.username?.charAt(0) || "Y"}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this campaign..."
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    disabled={addCommentMutation.isLoading}
                  />
                  <div className="flex justify-end mt-2">
                    {user ? (
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 cursor-pointer"
                        disabled={
                          !newComment.trim() || addCommentMutation.isLoading
                        }
                      >
                        {addCommentMutation.isLoading ? (
                          <span className="flex items-center">
                            <FiLoader className="animate-spin mr-2" />
                            Posting...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FiMessageSquare className="mr-2" />
                            Post Comment
                          </span>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAuth("login")}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center cursor-pointer"
                      >
                        Login to Comment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {isLoadingComments ? (
              <div className="flex justify-center py-8">
                <FiLoader className="animate-spin text-2xl text-blue-500" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <FiMessageSquare className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.user?.name || "Anonymous"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {comment.text}
                        </p>

                        {/* Reply section would go here */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-8">
            {/* Funding Progress */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Funding Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${campaign.currentAmount?.toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ${campaign.goalAmount?.toLocaleString()} goal
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                      style={{ width: `${percentageFunded}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {percentageFunded}% funded
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {daysLeft > 0 && (
              <div className="flex justify-center items-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6 px-3 md:px-6">
                <CountdownRenderer endDate={campaign.endDate} />
              </div>
            )}

            {/* Donation Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Make a Donation
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="donation-amount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Enter amount ($)
                  </label>
                  <input
                    type="number"
                    id="donation-amount"
                    min="1"
                    value={donationAmount}
                    onChange={(e) =>
                      setDonationAmount(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl font-bold"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[10, 25, 50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-2 px-3 rounded-lg font-medium transition-colors ${donationAmount === amount
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <Payment campaignId={id} amount={donationAmount} />

                {/* <button
                  onClick={handleDonate}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  <FiDollarSign className="mr-2 text-xl" />
                  Donate Now
                </button> */}
              </div>
            </div>

            {/* Campaign Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Campaign Details
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Category
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {campaign.category}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Start Date
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(campaign.startDate)?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    End Date
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(campaign.endDate)?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`font-medium ${campaign.status === "active"
                        ? "text-green-600 dark:text-green-400"
                        : campaign.status === "completed"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      } capitalize`}
                  >
                    {campaign.status}
                  </span>
                </li>
              </ul>

              {/* Social Sharing */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Share this campaign
                </h4>
                <div className="flex space-x-2">
                  {[
                    {
                      icon: <FiFacebook className="text-blue-600" />,
                      label: "Facebook",
                    },
                    {
                      icon: <FiTwitter className="text-blue-400" />,
                      label: "Twitter",
                    },
                    {
                      icon: (
                        <FiLink className="text-gray-600 dark:text-gray-400" />
                      ),
                      label: "Copy Link",
                    },
                  ].map((social) => (
                    <button
                      key={social.label}
                      className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                    >
                      {social.icon}
                      <span>{social.label}</span>
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
