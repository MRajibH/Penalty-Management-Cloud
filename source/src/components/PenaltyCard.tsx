import React from 'react';
import { DollarSign, Calendar, AlertCircle, Briefcase } from 'lucide-react';
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
          <DollarSign className="w-4 h-4 mr-2" />
          <span>${penalty.amount.toFixed(2)}</span>
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