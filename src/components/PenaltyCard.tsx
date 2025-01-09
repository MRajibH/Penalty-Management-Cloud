import { Calendar, AlertCircle, Briefcase } from 'lucide-react';
import { Penalty } from '../types';

interface PenaltyCardProps {
  penalty: Penalty;
  onStatusChange: (id: string, status: Penalty['status']) => void;
}

export function PenaltyCard({ penalty, onStatusChange }: PenaltyCardProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    DISPUTED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{penalty.engineerName}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Briefcase className="w-4 h-4 mr-1" />
            <span>{penalty.department}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[penalty.status]}`}>
          {penalty.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{penalty.reason}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <span className="mb-1 mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M18.09 10.5V9h-8.5V4.5A1.5 1.5 0 0 0 8.09 3a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 8.09 6v3h-3v1.5h3v6.2c0 2.36 1.91 4.27 4.25 4.3c2.34-.04 4.2-1.96 4.16-4.3c0-1.59-.75-3.09-2-4.08a4.08 4.08 0 0 0-.7-.47c-.22-.1-.46-.15-.7-.15c-.71 0-1.36.39-1.71 1c-.19.3-.29.65-.29 1c.01 1.1.9 2 2.01 2c.62 0 1.2-.31 1.58-.8c.21.47.31.98.31 1.5c.04 1.5-1.14 2.75-2.66 2.8c-1.53 0-2.76-1.27-2.75-2.8v-6.2h8.5Z" />
            </svg>
          </span>
          <span>{penalty.amount.toFixed(2)}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(penalty.date).toLocaleDateString()}</span>
        </div>

        {penalty.description && (
          <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
            {penalty.description}
          </div>
        )}
      </div>

      <div className="mt-4 space-x-2">
        {penalty.status === 'PENDING' && (
          <>
            <button
              onClick={() => onStatusChange(penalty.id, 'PAID')}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Mark as Paid
            </button>
            <button
              onClick={() => onStatusChange(penalty.id, 'DISPUTED')}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Dispute
            </button>
          </>
        )}
      </div>
    </div>
  );
}