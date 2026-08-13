function TextActionButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      className={[
        "inline-flex h-5 cursor-pointer items-center p-0 text-sm font-normal leading-5 text-gray-500 transition-colors hover:text-black focus:text-black focus:outline-none disabled:cursor-not-allowed disabled:text-gray-300",
        className,
      ].join(" ")}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default TextActionButton;
