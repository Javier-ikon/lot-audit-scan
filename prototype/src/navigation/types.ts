/**
 * Ikon Lot Scan — Navigation types
 * Per Product/app-flow.md
 */

export type RootStackParamList = {
  Login: undefined;
  DealerGroupSelection: undefined;
  RooftopSelection: { dealerGroupId: string };
  Scanning: { rooftopId: string; scanCount?: number };
  ScanResult: { rooftopId: string; vin: string; scanCount?: number };
  EndAuditConfirm: { rooftopId: string };
  SessionComplete: { rooftopId: string; reportUrl?: string };
};
