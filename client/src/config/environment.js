import shared from '@platform/shared';

/**
 * Returns validated public frontend configuration (never exposes server secrets).
 */
export function getClientConfig() {
  return shared.parseClientEnv({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
  });
}
