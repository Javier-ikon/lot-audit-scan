/**
 * Scan-related types
 * Per Product/scan-response-schema.md, Product/status-classification-rules.md
 */

export type ScanStatus = 'pass' | 'exception';

export type DeviceStatus =
  | 'installed'
  | 'not_installed'
  | 'wrong_rooftop'
  | 'not_reporting'
  | 'no_device'
  | 'customer_registered'
  | 'missing_device';

export type ExceptionReason = Exclude<DeviceStatus, 'installed'>;

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
