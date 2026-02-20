import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function StripeProvider({ campaignId, amount }) {
  //   const options = {
  //     clientSecret: clientSecret,
  //     appearance: { theme: "stripe" },
  //   };
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!campaignId || !amount) {
      setError("Campaign ID and amount are required");
      return;
    }

    setLoading(true);
    setError("");

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    fetch(`${apiUrl}/api/payment/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount,
        campaignId: campaignId
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        console.error("Payment intent creation error:", err);
        setError(err.message || "Unable to initialize payment");
      })
      .finally(() => setLoading(false));
  }, [campaignId, amount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[20vh]">
        <div className="relative">
          <div className="w-28 h-28 border-8 border-tertiary border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="absolute inset-0 flex items-center justify-center text-tertiary font-semibold text-xl">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="text-center text-red-500 font-semibold p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      ) : clientSecret ? (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            campaignId={campaignId}
            amount={amount}
          />
        </Elements>
      ) : (
        <div className="text-center text-gray-500 font-semibold">
          Initializing payment...
        </div>
      )}
    </>
  );
}