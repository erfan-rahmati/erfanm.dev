import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";

import { serverEnvironment } from "@/config/env.server";

type HeaderReader = Readonly<{
  get(name: string): string | null;
}>;

function normalizeIpAddress(
  value: string | null,
) {
  const firstAddress = value
    ?.split(",")
    .at(0)
    ?.trim();

  if (!firstAddress) {
    return null;
  }

  const withoutBrackets =
    firstAddress.startsWith("[") &&
    firstAddress.includes("]")
      ? firstAddress.slice(
          1,
          firstAddress.indexOf("]"),
        )
      : firstAddress;

  const withoutIpv6Zone =
    withoutBrackets.split("%").at(0)?.trim();

  if (
    !withoutIpv6Zone ||
    isIP(withoutIpv6Zone) === 0
  ) {
    return null;
  }

  return withoutIpv6Zone.toLowerCase();
}

export function getRequestIpAddress(
  requestHeaders: HeaderReader,
) {
  const candidateHeaders = [
    requestHeaders.get(
      "x-forwarded-for",
    ),
    requestHeaders.get("x-real-ip"),
    requestHeaders.get(
      "cf-connecting-ip",
    ),
  ];

  for (
    const candidateHeader of
    candidateHeaders
  ) {
    const normalizedIpAddress =
      normalizeIpAddress(
        candidateHeader,
      );

    if (normalizedIpAddress) {
      return normalizedIpAddress;
    }
  }

  return null;
}

export function createRequestIpHash(
  ipAddress: string | null,
) {
  if (!ipAddress) {
    return null;
  }

  return createHmac(
    "sha256",
    serverEnvironment.REQUEST_SECURITY_SECRET,
  )
    .update(ipAddress, "utf8")
    .digest("hex");
}