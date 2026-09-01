const sizeClassNames = {
  xs: "px-2 py-1 text-xs",
  inline: "px-0 py-1.5 text-sm",
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  full: "h-10 w-full text-sm font-normal",
};

const variantClassNames = {
  outline:
    "border border-gray-300 text-black hover:bg-black hover:text-white disabled:text-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300",
  text: "font-semibold text-black hover:text-[#d4d4d4] disabled:text-[#d4d4d4]",
};

function Button({
  as: Component = "button",
  children,
  className = "",
  size = "md",
  type = "button",
  variant = "outline",
  ...props
}) {
  const buttonProps = Component === "button" ? { type } : {};

  return (
    <Component
      className={[
        "cursor-pointer rounded-md transition-colors disabled:cursor-not-allowed",
        variantClassNames[variant],
        sizeClassNames[size],
        className,
      ].join(" ")}
      {...buttonProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
