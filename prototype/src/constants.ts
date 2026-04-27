/**
 * App constants
 */

/**
 * Xano API base URL.
 * Replace with your actual Xano instance URL before running.
 * Example: https://your-instance.xano.io/api:groupid
 */
export const XANO_AUTH_BASE    = 'https://xbag-0eaz-gnpd.n7e.xano.io/api:oGWteBqN';
export const XANO_AUDIT_BASE   = 'https://xbag-0eaz-gnpd.n7e.xano.io/api:JoIhxJtJ';
export const XANO_REPORTS_BASE = 'https://xbag-0eaz-gnpd.n7e.xano.io/api:bexh7j9u';

export const MOCK_DEALER_GROUPS = [
  { id: 'dg1', name: 'Friendly Auto Group' },
  { id: 'dg2', name: 'Metro Automotive Group' },
];

export const MOCK_ROOFTOPS = [
  { id: '1', name: 'Friendly Chevrolet - Downtown', dealerGroupId: 'dg1' },
  { id: '2', name: 'Metro Auto Group - North', dealerGroupId: 'dg2' },
  { id: '3', name: 'Valley Motors - East', dealerGroupId: 'dg1' },
];
