import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

const CheckoutForm = ({ clientSecret, campaignId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPaymentStatus(null);
    setErrorMessage("");

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      setLoading(false);
      return;
    }

    try {
      // Confirm card payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.data?.email || "",
              name: isAnonymous ? "Anonymous" : (user?.data?.name || ""),
            },
          },
        });

      if (confirmError) {
        console.error("Payment confirmation failed:", confirmError);
        setPaymentStatus("error");
        setErrorMessage(confirmError.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment successful:", paymentIntent);
        setPaymentStatus("success");

        // Redirect to campaign page after a short delay
        setTimeout(() => {
          navigate(`/campaigns/${campaignId}`, {
            state: {
              paymentSuccess: true,
              donationAmount: amount
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setPaymentStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (paymentStatus === "success") {
    return (
      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Thank you for your ${amount} donation. Redirecting...
        </p>
      </div>
    );
  }

  // Error state
  if (paymentStatus === "error") {
    return (
      <div className="space-y-4">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
            Payment Failed
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {errorMessage}
          </p>
          <button
            onClick={() => setPaymentStatus(null)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Payment form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Donor Message */}
      <div>
        <label
          htmlFor="donor-message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Add a message (optional)
        </label>
        <textarea
          id="donor-message"
          value={donorMessage}
          onChange={(e) => setDonorMessage(e.target.value)}
          placeholder="Share why you're supporting this campaign..."
          className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="3"
          maxLength="500"
        />
      </div>

      {/* Anonymous Donation Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
        />
        <label
          htmlFor="anonymous"
          className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          Make this donation anonymous
        </label>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Information
        </label>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center ${loading || !stripe
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          }`}
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          `Donate $${amount}`
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        🔒 Secured by Stripe. Your payment information is encrypted.
      </p>
    </form>
  );
};

export default CheckoutForm;
