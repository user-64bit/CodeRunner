import { Badge } from "./ui/badge";

interface StatusConfig {
  color: string;
  label: string;
}

export const StatusBadge = ({ status }: { status: string | number }) => {
  const statusMappings: { [key: string]: StatusConfig } = {
    // Queue and Processing statuses
    "1": { color: "bg-blue-100 text-blue-800", label: "In Queue" },
    "2": { color: "bg-purple-100 text-purple-800", label: "Processing" },
    // Success status
    "3": { color: "bg-green-100 text-green-800", label: "Accepted" },
    // Error statuses
    "4": { color: "bg-red-100 text-red-800", label: "Wrong Answer" },
    "5": { color: "bg-orange-100 text-orange-800", label: "Time Limit Exceeded" },
    "6": { color: "bg-yellow-100 text-yellow-800", label: "Compilation Error" },
    // Runtime errors
    "7": { color: "bg-pink-100 text-pink-800", label: "Runtime Error (SIGSEGV)" },
    "8": { color: "bg-pink-100 text-pink-800", label: "Runtime Error (SIGXFSZ)" },
    "9": { color: "bg-pink-100 text-pink-800", label: "Runtime Error (SIGFPE)" },
    "10": { color: "bg-pink-100 text-pink-800", label: "Runtime Error (SIGABRT)" },
    "11": { color: "bg-pink-100 text-pink-800", label: "Runtime Error (NZEC)" },
    "12": { color: "bg-pink-100 text-pink-800", label: "Runtime Error (Other)" },
    // Other statuses
    "13": { color: "bg-gray-100 text-gray-800", label: "Internal Error" },
    "14": { color: "bg-gray-100 text-gray-800", label: "Exec Format Error" },
    // Legacy statuses (if still needed)
    "completed": { color: "bg-green-100 text-green-800", label: "Completed" },
    "pending": { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    "error": { color: "bg-red-100 text-red-800", label: "Error" },
  };

  const getStatusConfig = (status: string | number): StatusConfig => {
    const statusKey = status.toString().toLowerCase();
    return statusMappings[statusKey] || { color: "bg-gray-100 text-gray-800", label: `Unknown (${status})` };
  };

  const { color, label } = getStatusConfig(status);

  return (
    <Badge
      className={`${color} font-semibold hover:opacity-80 transition-opacity duration-200 cursor-pointer hover:text-white`}
    >
      {label}
    </Badge>
  );
};
