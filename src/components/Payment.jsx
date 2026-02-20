import AamarpayForm from "./AamarpayForm";

const Payment = ({ campaignId, amount }) => {
  return (
    <section className="py-4 rounded-xl bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <AamarpayForm campaignId={campaignId} amount={amount} />
        </div>
      </div>
    </section>
  );
};

export default Payment;
