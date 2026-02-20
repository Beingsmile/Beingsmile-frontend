import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const AamarpayForm = ({ campaignId, amount }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    customerName: user?.displayName || user?.data?.name || "",
    customerEmail: user?.email || user?.data?.email || "",
    customerPhone: user?.data?.phone || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.customerName.trim()) {
        throw new Error("Please enter your name");
      }
      if (!formData.customerEmail.trim()) {
        throw new Error("Please enter your email");
      }
      if (!formData.customerPhone.trim()) {
        throw new Error("Please enter your phone number");
      }
      if (formData.customerPhone.length < 10) {
        throw new Error("Please enter a valid phone number");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Call backend to initiate payment
      const response = await fetch(`${apiUrl}/api/payment/aamarpay/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(amount),
          campaignId: campaignId,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const data = await response.json();

      if (data.success && data.payment_url) {
        // Redirect to Aamarpay payment gateway
        window.location.href = data.payment_url;
      } else {
        throw new Error(data.error || "Payment initiation failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Amount:</strong> {amount} BDT
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
          You will be redirected to Aamarpay payment gateway to complete your donation securely.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-tertiary hover:bg-tertiary/90 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        {loading ? "Processing..." : `Donate ${amount} BDT`}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Your donation is secure and encrypted
      </p>
    </form>
  );
};

export default AamarpayForm;
