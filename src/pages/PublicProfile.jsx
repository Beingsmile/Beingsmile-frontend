import { useParams, Link } from "react-router";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../contexts/AuthProvider";
import { 
  FiUser, FiMail, FiCheckCircle, FiHeart, FiActivity, 
  FiExternalLink, FiShare2, FiGlobe, FiLinkedin, FiTwitter, 
  FiFacebook, FiLoader, FiShield, FiAlertCircle, FiZap
} from "react-icons/fi";
import { toast } from "react-toastify";

const PublicProfile = () => {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.data?.role === 'admin';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // We'll search for the user by slug on the backend
        const res = await axiosInstance.get(`/auth/public/${slug}`);
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        toast.error("Profile not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral flex flex-col items-center justify-center gap-4">
        <FiLoader className="animate-spin text-5xl text-primary" />
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Authenticating Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center text-3xl mb-6 shadow-xl shadow-red-100">
          <FiAlertCircle />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Profile <span className="text-primary">Ghosted</span></h1>
        <p className="text-gray-500 font-medium mt-2 mb-8 max-w-sm">The humanitarian hero you are looking for has been not found or has a private profile.</p>
        <Link to="/" className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">Back to Safety</Link>
      </div>
    );
  }

  const socialLinks = user.publicProfile?.socialLinks || {};

  return (
    <div className="bg-neutral min-h-screen pb-24">
      {/* Dynamic Header */}
      <div className="h-64 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white bg-gradient-to-t from-gray-900 to-transparent">
          <div className="max-w-7xl mx-auto flex justify-end">
             <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Profile link shared!");
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-xl border border-white/20 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
             >
               <FiShare2 /> Share Profile
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Essential Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-gray-200 border-8 border-white text-center">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-neutral mx-auto">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-black uppercase">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                </div>
                {user.identity?.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center text-xl shadow-xl border-4 border-white animate-bounce-subtle">
                    <FiCheckCircle />
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-1">{user.name}</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center justify-center gap-2">
                <FiZap className="text-primary" /> {user.userType} Hero
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-neutral p-4 rounded-2xl border border-gray-50 flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Missions</span>
                  <span className="text-sm font-black text-gray-900">{user.metrics?.campaignCount || 0}</span>
                </div>
                <div className="bg-neutral p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Impact Rank</span>
                   <span className="text-sm font-black text-gray-900">#42</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" className="w-10 h-10 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                    <FiFacebook />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" className="w-10 h-10 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                    <FiTwitter />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" className="w-10 h-10 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                    <FiLinkedin />
                  </a>
                )}
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" className="w-10 h-10 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                    <FiGlobe />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                 <FiShield /> Trust Status
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                   <div className={`w-3 h-3 rounded-full ${user.identity?.isVerified ? 'bg-primary shadow-[0_0_10px_var(--primary)]' : 'bg-gray-300'}`} />
                   <div className="flex-1">
                     <p className="text-[10px] font-black uppercase text-gray-900 tracking-widest">
                       {user.identity?.isVerified ? 'Officially Verified' : 'Standard Supporter'}
                     </p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Identity Validated by Admin</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 opacity-50">
                   <div className="w-3 h-3 rounded-full bg-gray-300" />
                   <div className="flex-1">
                     <p className="text-[10px] font-black uppercase text-gray-900 tracking-widest text-gray-400">Smiles Distributed</p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">System validation in progress</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Mission Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-gray-200 border-8 border-white">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                <FiActivity className="text-xl" /> The Mission Statement
              </h2>
              <p className="text-xl md:text-2xl font-medium text-gray-900 leading-[1.6] mb-12 italic border-l-4 border-primary pl-8">
                "{user.bio || 'This hero prefers to let their actions speak louder than words.'}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Humanitarian Impact</p>
                    <p className="text-3xl font-black text-gray-900 uppercase">
                      <span className="text-primary">$</span>{user.metrics?.totalDonated || 0}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Fundraising Power</p>
                    <p className="text-3xl font-black text-gray-900 uppercase">
                      <span className="text-primary">$</span>{user.metrics?.totalRaised || 0}
                    </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral rounded-[3rem] p-12 border border-gray-100 text-center">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-sm border border-gray-100">
                  <FiHeart className="text-2xl" />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Join the Cause</h4>
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Ready to support {user.name.split(' ')[0]}'s next mission?</h3>
               <Link to="/campaigns/browse" className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-gray-200">
                 Explore Missions <FiExternalLink />
               </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
