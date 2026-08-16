interface FinalizeUploadResponse {
  ok?: unknown;
  blob?: {
    url?: unknown;
    pathname?: unknown;
  };
  error?: unknown;
}

export interface FinalizedAdminBlob {
  url: string;
  pathname: string;
}

export async function finalizeAdminUpload(
  endpoint: string,
  payload: Readonly<Record<string, unknown>>,
): Promise<FinalizedAdminBlob> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let body: FinalizeUploadResponse | null = null;

  try {
    body = (await response.json()) as FinalizeUploadResponse;
  } catch {
    // Handled by the generic error below.
  }

  if (!response.ok) {
    if (
      body &&
      typeof body.error === "string" &&
      body.error.trim().length > 0
    ) {
      throw new Error(body.error);
    }

    throw new Error("ثبت تصویر آپلودشده تکمیل نشد.");
  }

  if (
    body?.ok !== true ||
    typeof body.blob?.url !== "string" ||
    !body.blob.url.startsWith("https://") ||
    typeof body.blob.pathname !== "string" ||
    body.blob.pathname.length < 1
  ) {
    throw new Error("پاسخ نهایی Blob برای تصویر معتبر نیست.");
  }

  return {
    url: body.blob.url,
    pathname: body.blob.pathname,
  };
}
