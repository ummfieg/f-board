const variantClassNames = {
  edge: "text-sm",
  page: "h-8 min-w-8 rounded-md border px-2 text-sm",
};

function PaginationButton({
  children,
  className = "",
  disabled = false,
  isActive = false,
  type = "button",
  variant = "page",
  ...props
}) {
  const stateClassName = isActive
    ? "cursor-default border-black bg-white text-black"
    : disabled
      ? "cursor-not-allowed border-transparent text-gray-300"
      : variant === "edge"
        ? "cursor-pointer text-black hover:text-gray-400"
        : "cursor-pointer border-transparent text-gray-300 hover:bg-[#F8F9FA] hover:text-black";

  return (
    <button
      className={[
        "transition-colors",
        variantClassNames[variant],
        stateClassName,
        className,
      ].join(" ")}
      disabled={disabled || isActive}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default PaginationButton;
