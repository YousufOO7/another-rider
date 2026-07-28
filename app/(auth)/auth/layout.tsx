"use client"
// export default async function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   try {

import MobileNav from "@/app/components/main/navigations/MobileNav";
import PublicNav from "@/app/components/main/navigations/PublicNav";
import { useState } from "react";

//     return (
//       <div>
//         <PublicHeader data={companyData} />
//         <MobileNav data={companyData} />
//         <div className="min-h-screen">{children}</div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Failed to load layout data:", error);
//     // Fallback UI
//     return (
//       <>
//         <div className="min-h-screen">{children}</div>
//       </>
//     );
//   }
// }



export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setShowHome] = useState(true);
  return (
    <>
      <PublicNav onBookOnline={() => setShowHome(true)} />
      <MobileNav />
      <main>{children}</main>
    </>
  );
}


