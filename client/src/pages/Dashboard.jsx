import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import campaignApi from "../api/campaignApi";
import recipientApi from "../api/recipientApi";
import StatusBadge from "../components/StatusBadge";
import ErrorState from "../components/ErrorState";
import { CardSkeleton, Spinner } from "../components/Loading";

const Dashboard = () => {
  const { user } = useAuth();

  const [campaigns, setCampaigns] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const [campaignRes, recipientRes] = await Promise.all([
        campaignApi.getCampaigns(),
        recipientApi.getRecipients()
      ]);

      setCampaigns(campaignRes?.data?.campaigns || []);
      setRecipients(recipientRes?.data?.recipients || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load dashboard metrics"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute real statistics from actual backend responses
  const totalCampaigns = campaigns.length;
  const draftCampaigns = campaigns.filter((c) => c.status === "draft").length;
  const scheduledCampaigns = campaigns.filter((c) => c.status === "scheduled").length;
  const completedCampaigns = campaigns.filter((c) => c.status === "completed").length;

  const totalRecipients = recipients.length;
  const subscribedRecipients = recipients.filter((r) => r.isSubscribed).length;

  const upcomingCampaigns = campaigns
    .filter((c) => c.status === "scheduled" && c.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  const recentCampaigns = campaigns.slice(0, 5);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-7 w-48 bg-slate-200 animate-pulse rounded-lg" />
            <div className="h-4 w-64 bg-slate-200 animate-pulse rounded-md mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error && !campaigns.length && !recipients.length) {
    return <ErrorState message={error} onRetry={() => loadDashboardData()} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-sm border border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
            Real-time Workspace
          </span>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name || user?.email?.split("@")[0]}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Here is your live email delivery and campaign performance summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 shadow-xs hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
          >
            <Spinner size="sm" className={refreshing ? "text-indigo-400" : "hidden"} />
            <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>

          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition active:scale-98"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Create Campaign</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          System Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {/* Total Campaigns */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
            <p className="text-xs font-medium text-slate-500">Total Campaigns</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalCampaigns}</p>
            <p className="mt-1 text-[11px] text-slate-400">All registered broadcasts</p>
          </div>

          {/* Draft */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
            <p className="text-xs font-medium text-slate-500">Drafts</p>
            <p className="mt-2 text-2xl font-bold text-slate-700">{draftCampaigns}</p>
            <p className="mt-1 text-[11px] text-slate-400">Ready for editing</p>
          </div>

          {/* Scheduled */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
            <p className="text-xs font-medium text-slate-500">Scheduled</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{scheduledCampaigns}</p>
            <p className="mt-1 text-[11px] text-slate-400">Queue awaiting cron</p>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
            <p className="text-xs font-medium text-slate-500">Completed</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{completedCampaigns}</p>
            <p className="mt-1 text-[11px] text-slate-400">Successfully sent</p>
          </div>

          {/* Total Recipients */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
            <p className="text-xs font-medium text-slate-500">Total Recipients</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalRecipients}</p>
            <p className="mt-1 text-[11px] text-slate-400">Active audience contacts</p>
          </div>

          {/* Subscribed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
            <p className="text-xs font-medium text-slate-500">Subscribed</p>
            <p className="mt-2 text-2xl font-bold text-teal-600">{subscribedRecipients}</p>
            <p className="mt-1 text-[11px] text-slate-400">Eligible to receive</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Campaigns & Scheduled */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Campaigns (2 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Recent Campaigns</h3>
              <p className="text-xs text-slate-500">Latest campaigns created in this account</p>
            </div>
            <Link
              to="/campaigns"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentCampaigns.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No campaigns created yet.</p>
                <Link
                  to="/campaigns"
                  className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Create your first campaign
                </Link>
              </div>
            ) : (
              recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 hover:bg-slate-50/70 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="truncate text-sm font-semibold text-slate-900 hover:text-indigo-600 transition"
                      >
                        {campaign.name}
                      </Link>
                      <StatusBadge status={campaign.status} size="sm" />
                    </div>
                    <p className="truncate text-xs text-slate-500 mt-1">
                      Subject: {campaign.subject}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-slate-400">
                    <span>{formatDate(campaign.createdAt)}</span>
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Scheduled Campaigns (1 col) */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-900">Upcoming Broadcasts</h3>
            <p className="text-xs text-slate-500">Scheduled for automatic dispatch</p>
          </div>

          <div className="p-4 space-y-3">
            {upcomingCampaigns.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500">No scheduled campaigns right now.</p>
              </div>
            ) : (
              upcomingCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 transition hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {camp.name}
                    </p>
                    <StatusBadge status="scheduled" size="sm" />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-blue-700">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDate(camp.scheduledAt)}</span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link
                      to={`/campaigns/${camp.id}`}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View details &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;