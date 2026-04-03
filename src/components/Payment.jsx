import AamarpayForm from "./AamarpayForm";

const Payment = ({ campaignId, amount, platformFee = 0, isAnonymous = false, isAnonymousFromAll = false, donorMessage = '', campaign }) => {
  return (
    <div>
      <AamarpayForm
        campaignId={campaignId}
        amount={amount}
        platformFee={platformFee}
        isAnonymous={isAnonymous}
        isAnonymousFromAll={isAnonymousFromAll}
        donorMessage={donorMessage}
      />
    </div>
  );
};

export default Payment;
