import crypto from 'crypto';

/**
 * Generates a secure random token
 * @param length Length in bytes (default 16)
 * @returns Hex string token
 */
export function generateToken(length = 16): string {
  return crypto.randomBytes(length).toString('hex');
}
