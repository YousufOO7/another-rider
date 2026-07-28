import ManageReserveDynamicPage from "@/app/components/main/Reservation/ManageReserveDynamicPage";
import { Suspense } from "react";

const ManageReservation = () => {
  return (
    <div className="mt-5">
      <Suspense fallback={<div className="p-10">Loading...</div>}>
        <ManageReserveDynamicPage />
      </Suspense>
    </div>
  );
};

export default ManageReservation;
