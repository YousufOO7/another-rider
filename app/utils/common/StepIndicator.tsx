type Props = {
  currentStep: number;
};

const STEPS = ["WHEN & WHERE", "SELECT VEHICLE", "PASSENGER INFO"];

const StepIndicator = ({ currentStep }: Props) => {
  return (
    <div className="-mt-14 mb-4 flex items-center justify-between">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div
            key={step}
            className="relative flex flex-1 flex-col items-center md:flex-row md:items-center"
          >
            {/* Left line (md+) */}
            {index !== 0 && (
              <div
                className={`hidden md:block absolute left-0 top-3 h-px w-5 ${
                  isCompleted ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}

            {/* Right line */}
{index !== STEPS.length - 1 && (
  <>
    {/* Mobile line */}
    <div
      className={`absolute top-[10px] left-1/2 h-px w-full -translate-y-1/2 md:hidden ${
        isCompleted ? "bg-black" : "bg-gray-200"
      }`}
    />

    {/* Desktop line */}
    <div
      className={`absolute top-3 right-0 hidden md:block h-px w-24 lg:w-28 ${
        isCompleted ? "bg-black" : "bg-gray-200"
      }`}
    />
  </>
)}


            {/* Step content */}
            <div className="relative z-10 flex flex-col items-center gap-1 md:flex-row md:gap-2 pr-0 md:pr-4 text-[9px] md:text-[11px] lg:text-xs">
              {/* Circle */}
              <div
                className={`flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full font-semibold ${
                  isActive || isCompleted
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>

              {/* Text */}
              <span
                className={`text-center md:text-left font-medium ${
                  isActive || isCompleted
                    ? "text-black"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
