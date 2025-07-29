import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
// import { AuthContext } from "../contexts/AuthProvider";
// import PropTypes from "prop-types";
// import axios from "axios";
// import { LocationContext } from "../contexts/LocationProvider";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
//   const { user, setRefetchUser, refetchUser } = useContext(AuthContext);
//   const API = useContext(LocationContext);
//   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }

    try {
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: "user?.email",
              name: "user?.displayName",
            },
          },
        });

      if (confirmError) {
        console.log("Payment confirmation failed:", confirmError);
      } else {
        console.log("Payment successful:", paymentIntent);
        // axios
        //   .put(`${API}/update-badges`, {
        //     userId: user.objectId,
        //   })
        //   .then((res) => {
        //     console.log(res);
        //     setRefetchUser(refetchUser+1)
        //     toast.success("Payment successful! You have become a premium member! ", {
        //       position: "top-left",
        //       autoClose: 2000,
        //     });
        //     navigate('/');
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //     toast.error(`Payment failed! You have become a premium member! ${e}`, {
        //       position: "top-left",
        //       autoClose: 3500,
        //     });
        //   });
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    } finally {
      setLoading(false);
      // const newUser = user;
      // setUser(newUser);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      ></CardElement>
      <button
        type="submit"
        disabled={!stripe}
        className={`py-1 mt-4 px-4 rounded-lg font-bold transition-all duration-300 hover:bg-white hover:text-primary ${loading ? 'bg-gray-500' : "bg-tertiary "}`}
      >
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
