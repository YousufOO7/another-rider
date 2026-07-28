/* eslint-disable @typescript-eslint/no-explicit-any */
import BackButton from "@/app/utils/common/BackButton";
import PaymentMethod from "./PaymentMethod";
import BookingSummary from "./BookingSummary";

type Props = {
  onBack: () => void;
    onConfirm: () => void;
  vehicleName: string;
  baseRate: number;
  taxesAndFees: number;
  gratuity: number;
  total: number;
  pickup: string;
  dropoff: string;
  passengers: number;
  bags: number;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const SecurePayment = ({ onBack, ...bookingSummaryProps }: Props) => {
  return (
    <div>
      {/* Back */}
      <BackButton onClick={onBack} text="Back to vehicle selection" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-3">Secure Payment</h2>
          <p className="text-xs font-bold text-gray-400">
            Choose a payment method and confirm your booking.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 h-full">
        {/* Left side */}
        <div className="w-full md:w-2/3">
          <PaymentMethod
            payment={bookingSummaryProps.formData.payment}
            billingAddress={bookingSummaryProps.formData.billingAddress}
            pickup={bookingSummaryProps.formData.pickup}
            setFormData={bookingSummaryProps.setFormData}
          />
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/3">
          <BookingSummary {...bookingSummaryProps} />
        </div>
      </div>
    </div>
  );
};

export default SecurePayment;
