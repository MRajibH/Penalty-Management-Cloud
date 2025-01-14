import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { PenaltyStats } from "../types";

interface StatsProps {
  stats: PenaltyStats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
      <div className="bg-white rounded-lg shadow p-6 h-32">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Penalties</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalPenalties}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="w-6 h-6 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                width="24px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M18.09 10.5V9h-8.5V4.5A1.5 1.5 0 0 0 8.09 3a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 8.09 6v3h-3v1.5h3v6.2c0 2.36 1.91 4.27 4.25 4.3c2.34-.04 4.2-1.96 4.16-4.3c0-1.59-.75-3.09-2-4.08a4.08 4.08 0 0 0-.7-.47c-.22-.1-.46-.15-.7-.15c-.71 0-1.36.39-1.71 1c-.19.3-.29.65-.29 1c.01 1.1.9 2 2.01 2c.62 0 1.2-.31 1.58-.8c.21.47.31.98.31 1.5c.04 1.5-1.14 2.75-2.66 2.8c-1.53 0-2.76-1.27-2.75-2.8v-6.2h8.5Z"
                />
              </svg>
            </span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              ৳ {stats.totalAmount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              ৳ {stats.pendingAmount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Paid Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              ৳ {stats.paidAmount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
