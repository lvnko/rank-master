import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import './DashboardLayout.css'

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}