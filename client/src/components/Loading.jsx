export const Spinner = ({ size = "md", className = "" }) => {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3"
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeMap[size] || sizeMap.md} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PageLoading = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
        <Spinner size="md" className="text-indigo-600" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export const Skeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse rounded bg-slate-200/80 ${className}`} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};

export default PageLoading;
