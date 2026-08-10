const sizeClassNames = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  back: "h-6 w-8",
  floating: "h-10 w-10",
};

const variantClassNames = {
  ghost: "text-black transition-colors hover:text-[#d4d4d4]",
  subtle: "text-black transition-opacity hover:opacity-50",
  floating:
    "rounded-md border border-gray-300 bg-white text-black transition-colors hover:border-black hover:bg-black hover:text-white focus:border-black focus:bg-black focus:text-white focus:outline-none",
};

function IconButton({
  ariaLabel,
  children,
  className = "",
  size = "sm",
  type = "button",
  variant = "ghost",
  ...props
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={[
        "flex cursor-pointer items-center justify-center disabled:cursor-not-allowed",
        variantClassNames[variant],
        sizeClassNames[size],
        className,
      ].join(" ")}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
