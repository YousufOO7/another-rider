import AdminNavbar from "../components/main/navigations/AdminNavbar";
import AdminSidebarNavigation from "../components/main/navigations/AdminSidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {" "}
      <div className="flex items-center bg-gray-100 dark:bg-background">
        <div>
          <AdminSidebarNavigation />
        </div>
        <div className="mx-5 w-full overflow-hidden">
          <AdminNavbar />
          <div className={`min-h-screen`}>{children}</div>
        </div>
      </div>
    </>
  );
}
