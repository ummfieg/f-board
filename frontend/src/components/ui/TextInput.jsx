const variantClassNames = {
  box: "h-10 rounded-md border border-gray-300 px-4 text-sm placeholder:text-gray-300 focus:border-black",
  group:
    "h-10 border-b px-4 text-base placeholder:text-base placeholder:text-gray-300 focus:border-black",
  underline:
    "border-b border-black px-1 py-2 text-base placeholder:text-gray-300",
};

const borderClassNames = {
  default: "",
  error: "border-neutral-500",
  transparent: "border-transparent",
};

function TextInput({
  className = "",
  rightElement = null,
  tone = "default",
  variant = "box",
  ...props
}) {
  const inputClassName = [
    "w-full outline-none transition-colors",
    variantClassNames[variant],
    borderClassNames[tone],
    rightElement ? "pr-12" : "",
    className,
  ].join(" ");

  if (!rightElement) {
    return <input className={inputClassName} {...props} />;
  }

  return (
    <div className="relative">
      <input className={inputClassName} {...props} />
      {rightElement}
    </div>
  );
}

export default TextInput;
