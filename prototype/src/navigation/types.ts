/**
 * Ikon Lot Scan — Navigation types
 * Per Product/app-flow.md
 *
 * Phase 1: rooftopId removed from Scanning/ScanResult/EndAuditConfirm/SessionComplete —
 * those screens read session state from AppContext instead of nav params.
 * DealerGroupSelection and RooftopSelection remain registered but are dormant in Phase 1.
 */

export type RootStackParamList = {
  Login: undefined;
  DealerGroupSelection: undefined;
  RooftopSelection: { dealerGroupId: number };
  // Skipped if an open session is found
  ResumeSession: { session: Record<string, unknown>; scanCount: number };
  StartSession: undefined;
  Scanning: { scanCount?: number; exceptionCount?: number; lastScanStatus?: 'pass' | 'exception' };
  ScanResult: { vin: string; scanCount?: number; exceptionCount?: number; scanData?: Record<string, string> };
  EndAuditConfirm: { scanCount?: number; exceptionCount?: number } | undefined;
  SessionComplete: { sessionId?: number | null } | undefined;
};
