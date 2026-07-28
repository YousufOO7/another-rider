import RequiredStar from "../common/RequiredStar";

interface LabelProps {
  text?: string;
  required?: boolean;
  className?: string;
}

export default function Label({
  text,
  required = false,
  className = "",
}: LabelProps) {
  return (
    <label className={`text-xs  flex items-center gap-1 ${className}`}>
      {text}
      {required && <RequiredStar />}
    </label>
  );
}
