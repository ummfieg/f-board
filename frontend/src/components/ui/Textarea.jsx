const sizeClassNames = {
  comment: "h-20 px-4 py-3 text-sm placeholder:text-sm",
  post: "h-52 px-5 py-4 text-base",
};

function Textarea({
  className = "",
  size = "post",
  withThinScrollbar = false,
  ...props
}) {
  return (
    <textarea
      className={[
        withThinScrollbar ? "thin-transparent-scrollbar overflow-y-auto" : "",
        "w-full resize-none rounded-md border border-gray-300 leading-relaxed outline-none transition-colors placeholder:text-gray-300 focus:border-black",
        sizeClassNames[size],
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export default Textarea;
