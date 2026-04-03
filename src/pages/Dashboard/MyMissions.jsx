import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { 
  FiPlus, FiEdit2, FiBarChart2, FiGlobe, FiClock, 
  FiAlertTriangle, FiCheckCircle, FiLoader, FiMoreVertical, FiRss 
} from "react-icons/fi";
import { Link } from "react-router";
import { toast } from "react-toastify";

const MyMissions = () => {
  const qc = useQueryClient();

  // Fetch my missions
  const { data, isLoading } = useQuery({
    queryKey: ["myMissions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/campaigns/my-missions");
      return res.data;
    }
  });

  const missions = data?.campaigns || [];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">My Missions</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Manage your campaigns and track impact
          </p>
        </div>
        
        <Link 
          to="/campaigns/create"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2D6A4F] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1B4332] transition-all shadow-lg shadow-[#2D6A4F]/20"
        >
          <FiPlus size={14} />
          Create New Mission
        </Link>
      </div>

      {missions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5F0EA] p-16 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 bg-[#F8FDFB] rounded-xl flex items-center justify-center text-gray-300 mx-auto mb-2 border border-[#E5F0EA]">
            <FiGlobe size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Missions Yet</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-bold uppercase tracking-wide">
            Start a mission today and raise funds for a cause you care about.
          </p>
          <Link 
            to="/campaigns/create"
            className="inline-block px-8 py-3 bg-[#2D6A4F]/10 text-[#2D6A4F] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#2D6A4F]/20 transition-all mt-4"
          >
            Start First Mission
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {missions.map((mission) => (
            <div key={mission._id} className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300 group">
               {/* Cover Image */}
               <div className="w-full md:w-52 aspect-video md:aspect-auto relative overflow-hidden flex-shrink-0">
                  <img src={mission.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border shadow-sm ${
                    mission.status === "active" ? "bg-green-500 text-white border-green-400" :
                    mission.status === "pending" ? "bg-amber-500 text-white border-amber-400" :
                    mission.status === "suspended" ? "bg-red-500 text-white border-red-400" :
                    "bg-gray-500 text-white border-gray-400"
                  }`}>
                    {mission.status}
                  </div>
               </div>

               {/* Content */}
               <div className="flex-1 p-5 lg:p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                     <div className="space-y-1">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight group-hover:text-[#2D6A4F] transition-colors">{mission.title}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mission.category} • {new Date(mission.createdAt).toLocaleDateString()}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <Link 
                           to={`/campaigns/${mission._id}`}
                           className="p-2.5 bg-[#F8FDFB] border border-[#E5F0EA] text-gray-400 hover:text-[#2D6A4F] hover:border-[#2D6A4F]/20 rounded-xl transition-all"
                           title="Preview Page"
                        >
                           <FiGlobe size={14} />
                        </Link>
                        <Link 
                           to={`/dashboard/mission-settings/${mission._id}`}
                           className="p-2.5 bg-[#F8FDFB] border border-[#E5F0EA] text-gray-400 hover:text-[#2D6A4F] hover:border-[#2D6A4F]/20 rounded-xl transition-all"
                           title="Mission Settings"
                        >
                           <FiEdit2 size={14} />
                        </Link>
                     </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                     <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Raised</p>
                           <p className="text-sm font-black text-[#2D6A4F]">৳{mission.currentAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Goal</p>
                           <p className="text-sm font-black text-gray-900">৳{mission.goalAmount.toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="w-full bg-gray-50 rounded-full h-1.5 border border-gray-100 overflow-hidden shadow-inner">
                        <div 
                           className="h-full bg-[#2D6A4F] rounded-full transition-all duration-1000"
                           style={{ width: `${Math.min((mission.currentAmount / mission.goalAmount) * 100, 100)}%` }}
                        />
                     </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-gray-50">
                     <button 
                       className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FDFB] text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#F0FBF4] hover:text-[#2D6A4F] transition-all border border-[#E5F0EA]"
                     >
                       <FiBarChart2 size={12} />
                       Donations ({mission.donations?.length || 0})
                     </button>
                     <Link 
                       to={`/campaigns/${mission._id}#updates`}
                       className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FDFB] text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#F0FBF4] hover:text-[#2D6A4F] transition-all border border-[#E5F0EA]"
                     >
                       <FiRss size={12} />
                       Updates ({mission.updates?.length || 0})
                     </Link>
                     {mission.adminNotice?.isActive && (
                       <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100">
                          <FiAlertTriangle size={12} />
                          Notice
                       </div>
                     )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMissions;
