import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-green-50">
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight font-sans">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6 italic">
          Thank you for your generous donation. Your contribution will make a real difference!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            A confirmation has been sent to your email address. You can track your contribution in your profile.
          </p>
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4">
          Redirecting to home in 3 seconds...
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
