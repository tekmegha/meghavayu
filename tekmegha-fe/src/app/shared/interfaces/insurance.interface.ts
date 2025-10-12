// Insurance Policy Interface
export interface InsurancePolicy {
  tm_ins_id: number;
  policy_issue_date: string;
  exp_date: string;
  who_issued_policy: string;
  name: string; // Customer name
  vehicle_type: string;
  type: string; // Policy type
  vehicle_no: string;
  policy_no: string;
  od: string;
  net: number;
  gross: number;
  reference: string;
  reference_2: string;
  mb_no: string;
  mail_id: string;
  payment_mode: string;
  company: string; // Insurance company
  cc_gvw_seating: string;
  remark: string;
}

// Filter options for insurance list
export interface InsuranceFilter {
  searchTerm?: string;
  company?: string;
  policyType?: string;
  issuedBy?: string;
  status?: 'all' | 'active' | 'expired' | 'expiring-soon';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Insurance statistics
export interface InsuranceStats {
  totalPolicies: number;
  activePolicies: number;
  expiredPolicies: number;
  expiringSoon: number;
  totalPremium: number;
  averagePremium: number;
}

