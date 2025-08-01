import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import axioInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router";
// import { useContext } from "react";
// import { AuthContext } from "../contexts/AuthProvider";
// import Login from "../components/Login";

const StartCampaign = () => {
  // const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({});

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const watchImages = watch("images");

  // const addImage = () => {
  //   const newImage = watch("newImage");
  //   if (newImage?.trim()) {
  //     setValue("images", [...watchImages, newImage.trim()]);
  //     setValue("newImage", "");
  //   }
  // };

  // const removeImage = (index) => {
  //   setValue(
  //     "images",
  //     watchImages.filter((_, i) => i !== index)
  //   );
  // };

  const { mutateAsync } = useMutation({
    mutationFn: (campaignData) =>
      axioInstance.post("/campaigns/create", campaignData),
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      endDate: new Date(data.endDate).toISOString(), // Convert to ISO format
    };
    setLoading(true);
    await mutateAsync(formattedData)
      .then((response) => {
        const campaignId = response?.data?.campaign?._id;
        toast.success("Campaign created successfully!");
        navigate(`/campaigns/${campaignId}`); // Redirect after successful creation
      })
      .catch((error) => {
        toast.error("Failed to create campaign: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create Campaign
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Campaign Title*
              </label>
              <input
                id="title"
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              <div className="flex justify-between mt-1">
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {watch("title")?.length || 0}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description*
              </label>
              <textarea
                id="description"
                rows={5}
                {...register("description", {
                  required: "Description is required",
                  maxLength: {
                    value: 5000,
                    message: "Description cannot exceed 5000 characters",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              <div className="flex justify-between mt-1">
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {watch("description")?.length || 0}/5000
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category*
              </label>
              <select
                id="category"
                {...register("category", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="other">Others</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="environment">Environment</option>
                <option value="animals">Animals</option>
                <option value="community">Community</option>
                <option value="art">Art</option>
                <option value="technology">Technology</option>
              </select>
            </div>

            {/* Goal Amount */}
            <div>
              <label
                htmlFor="goalAmount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Funding Goal ($)*
              </label>
              <input
                type="number"
                id="goalAmount"
                {...register("goalAmount", {
                  required: "Goal amount is required",
                  min: {
                    value: 1,
                    message: "Goal must be at least $1",
                  },
                  valueAsNumber: true,
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.goalAmount
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.goalAmount && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.goalAmount.message}
                </p>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cover Image URL*
              </label>
              {/* <input
                  type="url"
                  id="coverImage"
                  {...register("coverImage", {
                    required: "Cover image is required",
                    pattern: {
                      value: /^(https?:\/\/).+$/i,
                      message: "Please enter a valid URL",
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.coverImage
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                /> */}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setValue("coverImage", reader.result); // base64 string
                  };
                  reader.readAsDataURL(file);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.coverImage
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />

              {watch("coverImage") && (
                <img
                  src={watch("coverImage")}
                  alt="Preview"
                  className="mt-2 h-32 w-auto rounded border"
                />
              )}
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.coverImage.message}
                </p>
              )}
            </div>

            {/* Additional Images */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Images
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    {...register("newImage", {
                      pattern: {
                        value: /^(https?:\/\/).+$/i,
                        message: "Please enter a valid URL",
                      },
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
                {errors.newImage && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.newImage.message}
                  </p>
                )} */}

            {/* Image previews */}
            {/* <div className="mt-3 space-y-2">
                  {watchImages?.map((img, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="truncate flex-1 text-sm text-gray-600 dark:text-gray-300">
                        {img}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div> */}

            {/* End Date Field */}
            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                End Date*
              </label>
              <input
                type="datetime-local"
                id="endDate"
                {...register("endDate", {
                  required: "End date is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    return (
                      selectedDate > new Date() ||
                      "End date must be in the future"
                    );
                  },
                })}
                min={new Date().toISOString().slice(0, 16)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="cursor-pointer w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {(loading) ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Create Campaign"
            )}
                
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartCampaign;
