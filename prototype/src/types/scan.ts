/**
 * Scan-related types
 * Per Product/scan-response-schema.md, Product/status-classification-rules.md
 */

export type ScanStatus = 'pass' | 'exception';
export type ExceptionReason =
  | 'wrong_rooftop'
  | 'not_reporting'
  | 'customer_registered'
  | 'lookup_failed';

export interface ScanResult {
  Serial: string;
  Activated: string;
  LastReportDate: string;
  Company: string;
  Group: string;
  Notes: string;
  status: ScanStatus;
  requiredAction?: string;
  reason?: ExceptionReason;
}
