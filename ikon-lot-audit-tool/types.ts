
export enum AppScreen {
  LOGIN,
  ROOFTOP_SELECTION,
  START_AUDIT,
  SCANNING,
  LOADING,
  STATUS_DISPLAY,
  REPORT,
  SESSION_COMPLETE
}

export enum VehicleStatus {
  OK = 'OK',
  NEEDS_ATTENTION = 'NEEDS_ATTENTION',
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR'
}

export interface Rooftop {
  id: string;
  city: string;
  name: string;
}

export interface VehicleInfo {
  vin: string;
  imei?: string;
  dealer?: string;
  lastReport?: string;
  status: VehicleStatus;
  issue?: string;
  description: string;
}

export interface AuditSession {
  rooftop: Rooftop | null;
  auditor: {
    name: string;
    email: string;
  };
  startDate: Date | null;
  scannedVehicles: VehicleInfo[];
}
