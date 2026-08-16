import Link from "next/link";

import {
  formatAdminDate,
  formatAdminNumber,
} from "@/features/admin/admin-formatters";
import {
  getRequestStatusLabel,
  REQUEST_STATUS_OPTIONS,
  type CollaborationRequestStatus,
} from "@/features/admin/requests/request.constants";
import { getProjectTypeLabel } from "@/features/admin/requests/request-formatters";
import { listAdminCollaborationRequests } from "@/server/collaboration/admin-collaboration.repository";

function isRequestStatus(
  value: string | undefined,
): value is CollaborationRequestStatus {
  return REQUEST_STATUS_OPTIONS.some(
    (item) => item.id === value,
  );
}

function createRequestsHref(
  page: number,
  query: string,
  status?: CollaborationRequestStatus,
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query) params.set("q", query);
  if (status) params.set("status", status);
  return `/admin/requests?${params.toString()}`;
}

export default async function AdminRequestsPage({
  searchParams,
}: PageProps<"/admin/requests">) {
  const params = await searchParams;
  const query =
    typeof params.q === "string"
      ? params.q.slice(0, 120)
      : "";
  const statusValue =
    typeof params.status === "string"
      ? params.status
      : undefined;
  const status = isRequestStatus(statusValue)
    ? statusValue
    : undefined;
  const pageValue = Number(
    typeof params.page === "string"
      ? params.page
      : "1",
  );

  const result =
    await listAdminCollaborationRequests({
      page: Number.isSafeInteger(pageValue)
        ? pageValue
        : 1,
      query,
      ...(status ? { status } : {}),
    });

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            سرنخ‌های همکاری
          </span>
          <h1>درخواست‌های مشاوره</h1>
          <p>
            {formatAdminNumber(result.total)} درخواست در
            این فهرست وجود دارد.
          </p>
        </div>
      </header>

      <form className="admin-filter-form">
        <input
          name="q"
          defaultValue={query}
          placeholder="نام، موبایل یا کد پیگیری"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
        >
          <option value="">همه وضعیت‌ها</option>
          {REQUEST_STATUS_OPTIONS.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="admin-button"
        >
          اعمال فیلتر
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>متقاضی</th>
              <th>نوع پروژه</th>
              <th>وضعیت</th>
              <th>زمان ثبت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="admin-table__title">
                    <strong>{request.fullName}</strong>
                    <small>
                      {request.phone} ·{" "}
                      {request.trackingCode}
                    </small>
                  </div>
                </td>
                <td>
                  {request.projectTypes
                    .slice(0, 2)
                    .map(getProjectTypeLabel)
                    .join("، ")}
                </td>
                <td>
                  <span
                    className={`admin-status admin-status--${request.status}`}
                  >
                    {getRequestStatusLabel(
                      request.status,
                    )}
                  </span>
                </td>
                <td>
                  {formatAdminDate(
                    request.createdAt,
                  )}
                </td>
                <td>
                  <div className="admin-table__actions">
                    <Link
                      href={`/admin/requests/${request.id}`}
                    >
                      مشاهده و مدیریت
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {result.items.length === 0 ? (
          <p className="admin-empty">
            درخواستی مطابق این فیلتر پیدا نشد.
          </p>
        ) : null}
      </div>

      <nav
        className="admin-pagination"
        aria-label="صفحه‌بندی درخواست‌ها"
      >
        {result.page > 1 ? (
          <Link
            href={createRequestsHref(
              result.page - 1,
              query,
              status,
            )}
          >
            صفحه قبل
          </Link>
        ) : null}
        <span>
          صفحه {formatAdminNumber(result.page)} از{" "}
          {formatAdminNumber(result.pageCount)}
        </span>
        {result.page < result.pageCount ? (
          <Link
            href={createRequestsHref(
              result.page + 1,
              query,
              status,
            )}
          >
            صفحه بعد
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
