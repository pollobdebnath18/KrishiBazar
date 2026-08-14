import { Sprout } from "lucide-react";

export default function Logo({
  light = false,
  size = "md",
}: {
  light?: boolean;
  size?: "sm" | "md";
}) {
  const iconBox = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const icon = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const text = size === "sm" ? "text-xl" : "text-2xl";

  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`${iconBox} flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 shadow-md shadow-green-600/25`}
      >
        <Sprout className={`${icon} text-white`} strokeWidth={2.2} />
      </span>
      <span
        className={`${text} font-bold tracking-tight ${
          light ? "text-white" : "text-gray-900"
        }`}
      >
        কৃষি<span className="text-green-600">বাজার</span>
      </span>
    </div>
  );
}