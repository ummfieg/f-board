import { MagnifyingGlassIcon, XMarkIcon } from "../icons";
import IconButton from "./IconButton";
import TextInput from "./TextInput";

function SearchInput({
  ariaLabel,
  className = "",
  onClear,
  value,
  ...props
}) {
  return (
    <label className={["relative block", className].join(" ")}>
      <span className="sr-only">{ariaLabel}</span>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <TextInput
        className="pl-10 pr-9"
        type="text"
        value={value}
        variant="box"
        {...props}
      />
      {value ? (
        <IconButton
          ariaLabel="검색어 지우기"
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60"
          onClick={onClear}
          size="xs"
          variant="subtle"
        >
          <XMarkIcon className="h-3.5 w-3.5" />
        </IconButton>
      ) : null}
    </label>
  );
}

export default SearchInput;
