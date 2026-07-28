"use client";
import { useState } from "react";
import MobileNav from "../components/main/navigations/MobileNav";
import PublicNav from "../components/main/navigations/PublicNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setShowHome] = useState(true);

  return (
    <div>
      <PublicNav onBookOnline={() => setShowHome(true)} />
      <MobileNav />
      <main>{children}</main>
    </div>
  );
}
