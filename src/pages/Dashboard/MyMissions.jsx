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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">My Missions</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Manage your fundraising campaigns and track impact
          </p>
        </div>
        
        <Link 
          to="/campaigns/create"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <FiPlus size={16} />
          Create New Mission
        </Link>
      </div>

      {missions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto mb-2 border border-gray-100">
            <FiGlobe size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Missions Launched Yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
            Take the first step towards making a difference. Start a mission today and raise funds for a cause you care about.
          </p>
          <Link 
            to="/campaigns/create"
            className="inline-block px-8 py-3 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all mt-4"
          >
            Start First Mission
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {missions.map((mission) => (
            <div key={mission._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300">
               {/* Cover Image */}
               <div className="w-full md:w-56 aspect-video md:aspect-auto relative overflow-hidden flex-shrink-0">
                  <img src={mission.coverImage} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" alt="" />
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border shadow-sm ${
                    mission.status === "active" ? "bg-green-500 text-white border-green-400" :
                    mission.status === "pending" ? "bg-amber-500 text-white border-amber-400" :
                    mission.status === "suspended" ? "bg-red-500 text-white border-red-400" :
                    "bg-gray-500 text-white border-gray-400"
                  }`}>
                    {mission.status}
                  </div>
               </div>

               {/* Content */}
               <div className="flex-1 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                     <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight">{mission.title}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{mission.category} • Created {new Date(mission.createdAt).toLocaleDateString()}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <Link 
                           to={`/campaigns/${mission._id}`}
                           className="p-2 border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg transition-all"
                           title="Preview Page"
                        >
                           <FiGlobe size={16} />
                        </Link>
                        <Link 
                           to={`/dashboard/mission-settings/${mission._id}`}
                           className="p-2 border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg transition-all"
                           title="Mission Settings"
                        >
                           <FiEdit2 size={16} />
                        </Link>
                     </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Raised</p>
                           <p className="text-sm font-black text-primary mt-0.5">৳{mission.currentAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Goal</p>
                           <p className="text-sm font-black text-gray-900 mt-0.5">৳{mission.goalAmount.toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="w-full bg-gray-50 rounded-full h-2 border border-gray-100 overflow-hidden">
                        <div 
                           className="h-full bg-primary rounded-full transition-all duration-1000"
                           style={{ width: `${Math.min((mission.currentAmount / mission.goalAmount) * 100, 100)}%` }}
                        />
                     </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-gray-50">
                     <button 
                       className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all transition-colors"
                     >
                       <FiBarChart2 size={13} />
                       Donations ({mission.donations?.length || 0})
                     </button>
                     <Link 
                       to={`/campaigns/${mission._id}#updates`}
                       className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all transition-colors"
                     >
                       <FiRss size={13} />
                       Updates ({mission.updates?.length || 0})
                     </Link>
                     {mission.adminNotice?.isActive && (
                       <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                          <FiAlertTriangle size={13} />
                          Admin Notice Active
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
