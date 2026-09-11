import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <span className="mt-5 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
          403 Forbidden
        </span>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Access Denied
        </h1>

        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          You don't have sufficient privileges to access this area. Administrative routes require an authenticated account with the <code className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-800">admin</code> role.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition active:scale-98"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;