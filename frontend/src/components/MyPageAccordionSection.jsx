import StateMessage from "./ui/StateMessage";

const maxHeightClassNames = {
  posts: "max-h-[360px]",
  fonts: "max-h-[320px]",
};

function MyPageAccordionSection({
  children,
  emptyMessage,
  icon,
  isEmpty,
  isLoading,
  loadingMessage,
  maxHeight = "posts",
  title,
  withBottomBorder = false,
}) {
  return (
    <details className={["group", withBottomBorder ? "border-b border-gray-300" : ""].join(" ")}>
      <summary className="flex h-10 cursor-pointer list-none items-center justify-between px-4 text-sm text-black transition-colors hover:bg-[#F8F9FA] group-open:bg-[#F8F9FA]">
        <span className="flex items-center gap-2 font-bold">
          <span className="flex w-4 items-center justify-center">{icon}</span>
          {title}
        </span>
        <span className="text-xs text-[#d4d4d4] group-open:rotate-90">
          &gt;
        </span>
      </summary>
      <ul
        className={[
          "thin-transparent-scrollbar overflow-y-auto border-t border-gray-200 px-4 py-3",
          maxHeightClassNames[maxHeight],
        ].join(" ")}
      >
        {isLoading ? (
          <StateMessage as="li" className="py-1.5">
            {loadingMessage}
          </StateMessage>
        ) : isEmpty ? (
          <StateMessage as="li" className="py-1.5">
            {emptyMessage}
          </StateMessage>
        ) : (
          children
        )}
      </ul>
    </details>
  );
}

export default MyPageAccordionSection;
