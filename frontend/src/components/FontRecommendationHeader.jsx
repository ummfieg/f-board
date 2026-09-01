import FontInfoPopover from "./FontInfoPopover";

function FontRecommendationHeader({
  className = "",
  emptyMessage = "",
  font,
  isLogoAnimated = false,
  reason = "",
}) {
  const hasFont = Boolean(font);
  const tags = font?.tags ?? [];

  return (
    <div
      className={[
        "grid min-h-[148px] grid-cols-[1fr_auto] items-start gap-5 overflow-visible pr-2",
        className,
      ].join(" ")}
    >
      <div className="ml-auto flex h-full w-[68%] flex-col">
        <div className="flex min-h-7 flex-wrap items-center gap-2">
          {hasFont ? (
            <>
              <FontInfoPopover font={font} />
              {tags.map((tag) => (
                <span
                  className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-black"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </>
          ) : null}
        </div>

        <div className="mt-3 flex min-h-20 items-center overflow-visible pr-1">
          {hasFont ? (
            <p className="thin-transparent-scrollbar max-h-20 overflow-y-auto text-left text-sm leading-relaxed text-black">
              {reason}
            </p>
          ) : (
            <p className="w-full text-right text-sm leading-relaxed text-[#d4d4d4]">
              {emptyMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex h-full flex-col">
        <div className="min-h-7" />
        <div className="mt-3 flex min-h-20 items-center overflow-visible">
          <span
            className={[
              "shrink-0 font-['Zodiak'] text-[28pt] font-extrabold italic leading-none text-black",
              isLogoAnimated ? "animate-tilt-once" : "",
            ].join(" ")}
          >
            f
          </span>
        </div>
      </div>
    </div>
  );
}

export default FontRecommendationHeader;
