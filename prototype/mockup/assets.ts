/**
 * Mockup assets — re-export shim.
 *
 * The canonical source of these data URIs is prototype/src/assets.ts, so the
 * production prototype and the mockup harness consume the same encoded SVGs.
 *
 * Kept here so existing 'import' paths in *.mockup.tsx files keep working.
 */

export { logoUri, userIconUri, lockIconUri, eyeIconUri } from '../src/assets';
