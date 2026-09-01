function TabButton({
  active = false,
  children,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const stateClassName = active
    ? "cursor-default border-gray-300 border-b-[#F8F9FA] bg-[#F8F9FA] text-black"
    : disabled
      ? "cursor-not-allowed border-transparent text-gray-300"
      : "cursor-pointer border-transparent text-gray-500 hover:border-gray-200 hover:border-b-[#F8F9FA] hover:bg-[#F8F9FA] hover:text-black";

  return (
    <button
      className={[
        "rounded-t-md border px-4 py-2 text-sm transition-colors",
        stateClassName,
        className,
      ].join(" ")}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default TabButton;
