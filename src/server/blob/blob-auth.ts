import "server-only";

const BLOB_CONFIGURATION_PATTERNS = [
  /OIDC is enabled for this project, but not for the .* environment/u,
  /No blob credentials found/u,
  /no storeId was found/u,
  /BLOB_STORE_ID/u,
  /Invalid `(?:token|BLOB_READ_WRITE_TOKEN)`/u,
  /No read-write token found/u,
  /Access denied, please provide a valid token/u,
] as const;

export function isBlobConfigurationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    BLOB_CONFIGURATION_PATTERNS.some((pattern) =>
      pattern.test(error.message),
    )
  );
}
