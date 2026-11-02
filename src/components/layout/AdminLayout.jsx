import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="admin-layout">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="admin-layout__main">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
