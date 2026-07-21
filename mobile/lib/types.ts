export interface Jurisdiction {
  id: number;
  name: string;
  level: string;
  parent_id: number | null;
  state_code: string | null;
  region: string | null;
  data_status: string;
  confidence: number | null;
}

export interface Position {
  id: number;
  title: string;
  position_type: string;
  jurisdiction_id: number;
  body_id: number | null;
  jurisdiction_name: string | null;
  jurisdiction_level: string | null;
  body_name: string | null;
  person_name: string | null;
  person_party: string | null;
  is_vacant: boolean;
  data_status: string;
  confidence: number | null;
  rank_level: number | null;
}

export interface SearchRecord {
  id: number;
  type: string;
  label: string;
  subtitle: string;
  keywords: string;
  data: Record<string, unknown>;
}

export interface Metrics {
  generatedAt: string;
  counts: Record<string, number>;
  coverage: {
    positionsFilled: number;
    positionsUnfilled: number;
    positionsVacant: number;
    positionsVerified: number;
    fillRate: number;
    verificationRate: number;
  };
  breakdowns: {
    positionsByLevel: Record<string, number>;
    positionsByType: Record<string, number>;
    positionsByStatus: Record<string, number>;
    contactsByType: Record<string, number>;
    jurisdictionsByLevel: Record<string, number>;
  };
  stateStats: Array<{
    id: number;
    name: string;
    state_code: string | null;
    districts: number;
    positions: number;
    dms_total: number;
    dms_filled: number;
    data_status: string;
  }>;
  latestCollection: {
    id: number;
    run_date: string;
    run_type: string;
    scope: string | null;
    records_added: number;
    records_updated: number;
    records_flagged: number;
    status: string;
    next_target: string | null;
    notes: string | null;
  } | null;
}

export interface Dataset {
  meta: {
    name: string;
    description: string;
    version: string;
    generatedAt: string;
  };
  metrics: Metrics;
  jurisdictions: Jurisdiction[];
  positions: Position[];
  searchIndex: SearchRecord[];
}
