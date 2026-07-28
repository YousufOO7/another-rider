import { FiArrowLeft } from "react-icons/fi";

interface BackButtonProps {
  onClick: () => void;
  text?: string;
  className?: string;
}

export default function BackButton({
  onClick,
  text = "Back",
  className = "",
}: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={` flex items-center gap-2 text-sm text-gray-500 hover:underline cursor-pointer ${className}`}
    >
      <FiArrowLeft />
      {text}
    </button>
  );
}
