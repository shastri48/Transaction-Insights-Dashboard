export default function TransactionSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-36 skeleton rounded" />
          <div className="h-2.5 w-24 skeleton rounded" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-4 w-20 skeleton rounded" />
          <div className="flex gap-1.5">
            <div className="h-4 w-16 skeleton rounded-full" />
            <div className="h-4 w-14 skeleton rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
