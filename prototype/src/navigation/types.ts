/**
 * Ikon Lot Scan — Navigation types
 * Per Product/app-flow.md
 */

export type RootStackParamList = {
  Login: undefined;
  RooftopSelection: undefined;
  Scanning: { rooftopId: string };
  ScanResult: { rooftopId: string; vin: string };
  EndAuditConfirm: { rooftopId: string };
  SessionComplete: { rooftopId: string };
};
