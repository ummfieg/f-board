const toneClassNames = {
  muted: "text-[#d4d4d4]",
  error: "text-neutral-600",
};

function StateMessage({
  as: Component = "p",
  children,
  className = "",
  tone = "muted",
}) {
  return (
    <Component
      className={[
        "text-sm font-normal",
        toneClassNames[tone],
        className,
      ].join(" ")}
    >
      {children}
    </Component>
  );
}

export default StateMessage;
