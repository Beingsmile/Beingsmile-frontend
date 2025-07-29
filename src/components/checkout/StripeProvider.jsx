import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// const clientSecret = import.meta.env.VITE_STRIPE_PK;

export default function StripeProvider() {
//   const options = {
//     clientSecret: clientSecret,
//     appearance: { theme: "stripe" },
//   };
const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2500 }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[95vh]">
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
    {clientSecret ? (
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        ) : (
          <div className="text-center text-red-500 font-semibold">
            Unable to load payment details. Please try again later.
          </div>
        )}</>
  );
}