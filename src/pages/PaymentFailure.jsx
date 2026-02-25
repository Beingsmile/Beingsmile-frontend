import { useNavigate } from "react-router";
import { useEffect } from "react";

const PaymentFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-50">
        <div className="mb-4 flex justify-center">
          <div className="bg-red-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight font-sans">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6 italic">
          Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Please check your payment details and try again. If you need assistance, please contact our support team.
          </p>
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4">
          Redirecting to home in 5 seconds...
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-tertiary hover:bg-tertiary/90 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
