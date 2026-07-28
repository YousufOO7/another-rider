import Label from "@/app/utils/common/Label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onNext: () => void;
};

const FindMyReservation = ({onNext}: Props) => {
  return (
    <div className="max-w-xl lg:w-3xl mx-auto  md:mt-20  rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 items-start">
        <h2 className="text-lg font-bold uppercase">Find My Reservation</h2>
      </div>

      <div className="grid grid-cols-1 md:flex md:justify-between gap-4 my-8">
         <div>
            <Label text="Conformation Number" className="font-bold mb-2 text-gray-500" required />
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter your conformation number"
                className=""
              />
            </div>
          </div>
         <div>
            <Label text="Last Name" className="font-bold mb-2 text-gray-500" required />
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your last name"
                className=""
              />
            </div>
          </div>
         <div>
            <Label text="Email" className="font-bold mb-2 text-gray-500" required />
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className=""
              />
            </div>
          </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse justify-between items-center mt-6 space-y-4 md:space-y-0">
        <Button onClick={onNext} className="w-full md:w-40 cursor-pointer rounded-none">
             Find Reservation
        </Button>
        <Button variant={"outline"} className="w-full md:w-24 cursor-pointer rounded-none">
             Cancel
        </Button>
      </div>
    </div>
  );
};

export default FindMyReservation;
