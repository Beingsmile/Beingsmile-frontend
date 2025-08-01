import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useCampaignDetails } from '../hooks/useCampaign'
import { FiHeart, FiShare2, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CampaignDetails = () => {
  const { id } = useParams();
  const [donationAmount, setDonationAmount] = useState(50);
  const [newComment, setNewComment] = useState('');

  const {
    data: data,
    isLoading,
    isError,
    error,
  } = useCampaignDetails(id);

  const campaign = data?.campaign;

  // Initialize comments from campaign data
  const [comments, setComments] = useState(campaign?.comments || []);

  useEffect(() => {
    if (campaign?.comments) {
      setComments(campaign.comments);
    }
  }, [campaign]);

  const handleDonate = () => {
    console.log(`Donating $${donationAmount} to campaign ${id}`);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      user: { name: 'Current User', avatar: '' },
      text: newComment,
      date: new Date().toISOString(),
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  if (isLoading) return <div className="text-center py-20">Loading campaign details...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">Error: {error.message}</div>;
  if (!campaign) return <div className="text-center py-20">Campaign not found</div>;

  const percentageFunded = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Campaign Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{campaign.title}</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <span className="flex items-center mr-4">
            <FiUser className="mr-1" />
            <span>by {campaign.creator?.name || 'Anonymous'}</span>
          </span>
          <span className="flex items-center">
            <FiClock className="mr-1" />
            <span>{daysLeft} days left</span>
          </span>
        </div>
      </div>

      {/* Image Slider */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <Slider {...sliderSettings}>
          <div>
            <img 
              src={campaign.coverImage} 
              alt={campaign.title} 
              className="w-full h-96 object-cover"
            />
          </div>
          {campaign.images?.map((image, index) => (
            <div key={index}>
              <img 
                src={image} 
                alt={`${campaign.title} ${index + 1}`} 
                className="w-full h-96 object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Campaign Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About this campaign</h2>
            <div className="prose dark:prose-invert max-w-none">
              {campaign.description?.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Updates */}
          {campaign.updates?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Updates</h2>
              {campaign.updates.map((update, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{update?.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{update?.content}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(update?.postedAt)?.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments</h2>
            
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this campaign..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Post Comment
              </button>
            </form>

            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">{comment.user?.name || 'Anonymous'}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.date)?.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${campaign.currentAmount?.toLocaleString()} raised
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  of ${campaign.goalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${percentageFunded}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {percentageFunded}% funded
              </div>
            </div>

            {/* Donation Form */}
            <div className="mb-6">
              <label htmlFor="donation-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your donation amount ($)
              </label>
              <input
                type="number"
                id="donation-amount"
                min="1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors duration-200 mb-4 flex items-center justify-center"
            >
              <FiDollarSign className="mr-2" />
              Donate Now
            </button>

            {/* Secondary Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center">
                <FiHeart className="mr-2" />
                Save
              </button>
              <button className="flex-1 py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center">
                <FiShare2 className="mr-2" />
                Share
              </button>
            </div>

            {/* Campaign Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Campaign Details</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex justify-between">
                  <span>Category</span>
                  <span className="text-gray-900 dark:text-white capitalize">{campaign.category}</span>
                </li>
                <li className="flex justify-between">
                  <span>Start Date</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(campaign.startDate)?.toLocaleDateString()}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>End Date</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(campaign.endDate)?.toLocaleDateString()}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Status</span>
                  <span className="capitalize text-gray-900 dark:text-white">{campaign.status}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;