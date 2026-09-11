import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const {
    user,
    logout
  } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Email Campaign System
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            ADMIN
          </span>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Welcome
            {user?.name
              ? `, ${user.name}`
              : ""}
          </h2>

          <p className="mt-2 text-slate-600">
            Admin authentication is working.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Campaigns
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                —
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Recipients
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                —
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Email Logs
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                —
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;