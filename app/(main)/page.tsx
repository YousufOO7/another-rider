// "use client"
// import { useState } from "react";
// import HomeRedirect from "../components/main/home/HomeRedirect";
// import PublicNav from "../components/main/navigations/PublicNav";
// import BookingOnlineForm from "../components/main/home/BookingOnlineForm";
// import MobileNav from "../components/main/navigations/MobileNav";

// export default function HomePage() {
//    const [showHome, setShowHome] = useState(true);
//   return (
//     <>
//       <div >
//         <PublicNav onBookOnline={() => setShowHome(true)} />
//         <MobileNav />
//       </div>
//       <div className="md:hidden">
//         <BookingOnlineForm />
//       </div>
//       <div className="hidden md:block">
//          {showHome ? (
//         <HomeRedirect onBookOnline={() => setShowHome(false)} />
//       ) : (
//         <BookingOnlineForm />
//       )}
        
//       </div>
//     </>
//   );
// }


"use client"
import { useState } from "react";
import HomeRedirect from "../components/main/home/HomeRedirect";
import PublicNav from "../components/main/navigations/PublicNav";
// import BookingOnlineForm from "../components/main/home/BookingOnlineForm";
import MobileNav from "../components/main/navigations/MobileNav";

export default function HomePage() {
   const [, setShowHome] = useState(true);
  return (
    <>
      <div >
        <PublicNav onBookOnline={() => setShowHome(true)} />
        <MobileNav />
      </div>
      {/* <div className="md:hidden">
        <BookingOnlineForm />
      </div>
      <div className="hidden md:block">
         {showHome ? (
       
      ) : (
        <BookingOnlineForm />
      )}
      </div> */}
       <HomeRedirect onBookOnline={() => setShowHome(false)} />
    </>
  );
}

