import AamarpayForm from "./AamarpayForm";

const Payment = ({ campaignId, amount }) => {
  return (
    <div className="pt-2">
      <AamarpayForm campaignId={campaignId} amount={amount} />
    </div>
  );
};

export default Payment;
