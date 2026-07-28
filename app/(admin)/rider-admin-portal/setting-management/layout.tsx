import SettingsPage from "@/app/components/dashboard/setting-components/SettingsPage";



export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsPage>{children}</SettingsPage>;
}