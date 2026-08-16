interface PrepareUploadResponse {
  presignedUrl?: unknown;
  pathname?: unknown;
  error?: unknown;
}

export interface PreparedBlobUpload {
  pathname: string;
}

async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }
  } catch {
    // Keep the generic message below.
  }

  return fallback;
}

export async function uploadWithPresignedUrl(
  endpoint: string,
  pathname: string,
  file: File,
  metadata: Readonly<Record<string, unknown>>,
): Promise<PreparedBlobUpload> {
  const prepareResponse = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pathname, metadata }),
  });

  if (!prepareResponse.ok) {
    throw new Error(
      await readErrorMessage(
        prepareResponse,
        "آماده‌سازی آپلود تصویر انجام نشد.",
      ),
    );
  }

  const prepared = (await prepareResponse.json()) as PrepareUploadResponse;
  if (
    typeof prepared.presignedUrl !== "string" ||
    !prepared.presignedUrl.startsWith("https://") ||
    typeof prepared.pathname !== "string" ||
    prepared.pathname !== pathname
  ) {
    throw new Error("آدرس امن آپلود از سرور دریافت نشد.");
  }

  const uploadResponse = await fetch(prepared.presignedUrl, {
    method: "PUT",
    headers: { "content-type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(
      await readErrorMessage(uploadResponse, "ارسال تصویر به Blob انجام نشد."),
    );
  }

  // A successful presigned PUT does not guarantee a stable JSON response body.
  // The server verifies the just-uploaded pathname with head() in the finalize step
  // and returns the canonical Blob URL from that trusted lookup.
  return { pathname };
}
