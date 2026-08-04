import "server-only";

import { randomBytes } from "node:crypto";

export function createCollaborationTrackingCode(
  now = new Date(),
) {
  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const randomPart = randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `CR-${datePart}-${randomPart}`;
}