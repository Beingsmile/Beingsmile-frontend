import StripeProvider from "./checkout/StripeProvider";

const Payment = () => {
  return (
     <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <StripeProvider />
        </div>
      </div>
    </section>
  );
};

export default Payment;
