import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router";
import { FiCheckCircle, FiAlertCircle, FiLoader, FiUser, FiMail, FiShield } from "react-icons/fi";

const CheckoutForm = ({ clientSecret, campaignId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
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

    if (!stripe || !elements) { setLoading(false); return; }
    const card = elements.getElement(CardElement);
    if (card == null) { setLoading(false); return; }

    try {
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: user?.data?.email || "",
            name: isAnonymous ? "Anonymous" : (user?.data?.name || ""),
          },
        },
      });

      if (confirmError) {
        setPaymentStatus("error");
        setErrorMessage(confirmError.message || "Payment failed. Please try again.");
      } else if (paymentIntent?.status === "succeeded") {
        setPaymentStatus("success");
        setTimeout(() => {
          navigate(`/campaigns/${campaignId}`, { state: { paymentSuccess: true, donationAmount: amount } });
        }, 2000);
      }
    } catch (error) {
      setPaymentStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100">
        <FiCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
        <h3 className="text-base font-black text-green-700 uppercase tracking-tight mb-1">Payment Successful!</h3>
        <p className="text-sm text-gray-500">Thank you for your ৳{amount} donation. Redirecting...</p>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="space-y-4">
        <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-3" />
          <h3 className="text-base font-black text-red-700 uppercase tracking-tight mb-1">Payment Failed</h3>
          <p className="text-sm text-gray-500 mb-4">{errorMessage}</p>
          <button
            onClick={() => setPaymentStatus(null)}
            className="px-6 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Donor Message */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Leave a Message <span className="text-gray-300 normal-case tracking-normal font-medium">(optional)</span>
        </label>
        <textarea
          value={donorMessage}
          onChange={(e) => setDonorMessage(e.target.value)}
          placeholder="Share why you're supporting this mission..."
          className="w-full bg-neutral border border-gray-100 focus:border-primary/30 focus:bg-white px-4 py-3 rounded-xl text-sm text-gray-700 placeholder-gray-300 outline-none transition-all resize-none"
          rows="2"
          maxLength="500"
        />
      </div>

      {/* Anonymous Toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-4 h-4 accent-primary cursor-pointer"
        />
        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
          Donate anonymously
        </span>
      </label>

      {/* Card Element */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Card Details</label>
        <div className="bg-neutral border border-gray-100 focus-within:border-primary/30 focus-within:bg-white rounded-xl px-4 py-3 transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  color: "#111827",
                  "::placeholder": { color: "#d1d5db" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <><FiLoader className="animate-spin" /> Processing...</>
        ) : (
          `Donate ৳${amount}`
        )}
      </button>

      <p className="text-[10px] text-center text-gray-300 font-medium flex items-center justify-center gap-1.5">
        <FiShield className="text-primary" /> Secured by Stripe. Your payment is encrypted.
      </p>
    </form>
  );
};

export default CheckoutForm;
