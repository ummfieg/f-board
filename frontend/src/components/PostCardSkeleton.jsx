function SkeletonBlock({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "block animate-pulse rounded-md bg-gray-200/70",
        className,
      ].join(" ")}
    />
  );
}

function PostCardSkeleton() {
  return (
    <article
      aria-label="게시글을 불러오는 중"
      className="min-w-0 rounded-md shadow-[0_0_12px_rgba(15,23,42,0.06)]"
    >
      <div className="p-4">
        <div className="flex min-w-0 items-center gap-2">
          <SkeletonBlock className="h-[18px] w-20" />
          <SkeletonBlock className="h-[18px] w-16 rounded-full" />
        </div>

        <div className="mt-3 min-h-[40px] space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>

        <div className="mt-3 h-24 rounded-md border border-gray-200 px-4 py-3">
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-full" />
            <SkeletonBlock className="h-5 w-5/6" />
            <SkeletonBlock className="h-5 w-3/5" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-3 w-8" />
        </div>
      </div>
    </article>
  );
}

export default PostCardSkeleton;
