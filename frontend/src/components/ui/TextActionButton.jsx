const sizeClassNames = {
  xs: "h-4 text-xs leading-4",
  sm: "h-5 text-sm leading-5",
};

const variantClassNames = {
  muted: "text-gray-500 hover:text-black focus:text-black disabled:text-gray-300",
  subtle: "text-gray-400 hover:text-black focus:text-black disabled:text-gray-300",
  primary: "text-black hover:text-gray-400 focus:text-gray-400 disabled:text-gray-300",
};

function TextActionButton({
  children,
  className = "",
  size = "sm",
  type = "button",
  variant = "muted",
  ...props
}) {
  return (
    <button
      className={[
        "inline-flex cursor-pointer items-center p-0 font-normal transition-colors focus:outline-none disabled:cursor-not-allowed",
        sizeClassNames[size],
        variantClassNames[variant],
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
