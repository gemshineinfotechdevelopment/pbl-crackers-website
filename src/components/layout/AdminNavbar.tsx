import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Package, FolderTree, ShoppingBag, Users, Settings, Tag, BarChart3, Image, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import companyLogo from "@/assets/logo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Categories", icon: FolderTree, href: "/admin/categories" },
  { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  { label: "Content", icon: Settings, href: "/admin/content" },
  { label: "Price List", icon: FileText, href: "/admin/price-list" },
];

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <nav className="lg:hidden sticky top-0 z-50 border-b border-blue-900/40 bg-[#1D4ED8] text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        <Link to="/admin" className="flex items-center gap-3">
          <img src={companyLogo} alt="PBL Crackers" className="h-10 object-contain bg-white/10 rounded p-0.5" />
          <span className="font-display font-bold text-white hidden sm:inline text-lg leading-none">Admin Panel</span>
          <span className="font-display font-bold text-white sm:hidden text-lg leading-none">Admin</span>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-white hover:bg-white/15 rounded-lg transition-colors"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-0 z-[60] ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer content */}
        <div
          className={`absolute top-0 left-0 h-full w-[75vw] max-w-[300px] bg-gradient-to-b from-[#1E40AF] via-[#1D4ED8] to-[#1E3A8A] text-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-black/10">
            <div className="flex items-center gap-2">
              <img src={companyLogo} alt="PBL Crackers" className="h-9 object-contain bg-white/10 rounded p-0.5" />
              <span className="font-display font-bold text-white text-base">Admin Panel</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-white hover:bg-white/15 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-1.5 overflow-y-auto scrollbar-thin flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#2563EB] text-white font-bold border-l-4 border-[#FFD400]"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-[#FFD400]" : "text-blue-200")} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-blue-900/40 mt-auto bg-black/10">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center px-3 py-2.5 mb-3 rounded-lg text-sm font-medium text-blue-200 hover:text-[#FFD400] hover:bg-white/10 transition-colors"
            >
              ← Back to Store
            </Link>

            <Button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              variant="default"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold border-none"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
