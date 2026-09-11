import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "./StatusBadge";

const routeMeta = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview and real-time campaign performance" },
  "/campaigns": { title: "Campaigns", subtitle: "Manage email drafts, schedules, and broadcasts" },
  "/recipients": { title: "Recipients", subtitle: "Manage your contact list and audience subscriptions" },
  "/admin": { title: "Admin Console", subtitle: "System status, authentication, and authorization controls" }
};

const Header = ({ onOpenMobile }) => {
  const location = useLocation();
  const { user } = useAuth();

  const currentPath = location.pathname;
  let meta = routeMeta[currentPath];

  // Handle dynamic routes such as /campaigns/:id
  if (!meta) {
    if (currentPath.startsWith("/campaigns/")) {
      meta = {
        title: "Campaign Details",
        subtitle: "Audience assignments, content preview, and delivery state"
      };
    } else {
      meta = { title: "Email Campaign System", subtitle: "" };
    }
  }

  const isDetailPage = currentPath.startsWith("/campaigns/") && currentPath !== "/campaigns";

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-xs">
      {/* Left side: Hamburger on mobile + Title & Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          aria-label="Open sidebar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div>
          <div className="flex items-center gap-2">
            {isDetailPage && (
              <Link
                to="/campaigns"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 mr-1"
              >
                <span>&larr;</span> Campaigns
              </Link>
            )}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {meta.title}
            </h2>
          </div>
          {meta.subtitle && (
            <p className="hidden sm:block text-xs text-slate-500 font-normal">
              {meta.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: User information & system state */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Connected</span>
        </div>

        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {user?.name || user?.email?.split("@")[0]}
            </p>
            <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
          <StatusBadge status={user?.role || "user"} size="sm" />
        </div>
      </div>
    </header>
  );
};

export default Header;
