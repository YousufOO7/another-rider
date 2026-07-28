import AccountPage from "@/app/components/main/profile-component/AccountPage";



export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountPage>{children}</AccountPage>;
}