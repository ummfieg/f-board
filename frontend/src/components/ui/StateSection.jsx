import StateMessage from "./StateMessage";

const minHeightClassNames = {
  sm: "min-h-[360px]",
  md: "min-h-[420px]",
  lg: "min-h-[520px]",
};

function StateSection({
  as: Component = "section",
  children,
  className = "",
  minHeight = "md",
  tone = "muted",
}) {
  return (
    <Component
      className={[
        "flex items-center justify-center text-center",
        minHeightClassNames[minHeight],
        className,
      ].join(" ")}
    >
      <StateMessage tone={tone}>{children}</StateMessage>
    </Component>
  );
}

export default StateSection;
