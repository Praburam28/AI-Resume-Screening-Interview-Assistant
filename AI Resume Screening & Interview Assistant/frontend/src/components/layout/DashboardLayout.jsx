import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
