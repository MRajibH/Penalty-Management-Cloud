export interface Penalty {
  id: string;
  engineerName: string;
  department: Department;
  reason: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'PAID' | 'DISPUTED';
  description?: string;
}

export interface PenaltyStats {
  totalPenalties: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
}

export type Department = 'Frontend' | 'Backend' | 'DevOps' | 'QA' | 'Mobile' | 'Design';

export interface SearchFilters {
  search: string;
  department: Department | 'ALL';
  status: 'ALL' | Penalty['status'];
  dateRange: {
    start: string;
    end: string;
  };
}