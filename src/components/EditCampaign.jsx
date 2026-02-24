import { useState, useEffect } from "react";
import { FiX, FiLayers, FiDollarSign, FiCalendar, FiLoader, FiCheck } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const EditCampaign = ({ campaign, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: campaign.title || "",
        description: campaign.description || "",
        category: campaign.category || "",
        goalAmount: campaign.goalAmount || "",
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.patch(`/campaigns/${campaign._id}`, formData);
            if (response.data.success) {
                toast.success("Campaign updated successfully!");
                onUpdate(response.data.campaign);
                onClose();
            }
        } catch (error) {
            console.error("Update campaign error:", error);
            toast.error(error.response?.data?.message || "Failed to update campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Campaign</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your campaign information</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Campaign Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all resize-none"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FiLayers /> Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all"
                                required
                            >
                                <option value="Medical">Medical</option>
                                <option value="Education">Education</option>
                                <option value="Disaster">Disaster Relief</option>
                                <option value="Charity">General Charity</option>
                                <option value="Animals">Animal Welfare</option>
                            </select>
                        </div>

                        {/* Goal Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FiDollarSign /> Goal Amount ($)
                            </label>
                            <input
                                type="number"
                                name="goalAmount"
                                value={formData.goalAmount}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all"
                                required
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FiCalendar /> End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-tertiary text-white font-bold rounded-xl hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20 flex items-center justify-center"
                        >
                            {loading ? <FiLoader className="animate-spin mr-2" /> : <FiCheck className="mr-2" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaign;
