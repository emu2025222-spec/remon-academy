
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f4] text-slate-800 antialiased">
      <Navbar />

      <main className="relative min-w-0 flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
