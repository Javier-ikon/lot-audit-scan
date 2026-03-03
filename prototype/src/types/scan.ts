/**
 * Scan-related types
 * Per Product/scan-response-schema.md, Product/status-classification-rules.md
 */

export type ScanStatus = 'pass' | 'exception';

export interface ScanResult {
  Serial: string;
  Activated: string;
  LastReportDate: string;
  Company: string;
  Group: string;
  Notes: string;
  status: ScanStatus;
  requiredAction?: string;
}
