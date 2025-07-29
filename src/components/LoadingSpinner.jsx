import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-gray-100"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
