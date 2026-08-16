import Link from "next/link";
import { notFound } from "next/navigation";

import {
  formatAdminDate,
  formatToman,
} from "@/features/admin/admin-formatters";
import {
  addRequestNoteAction,
  updateRequestStatusAction,
} from "@/features/admin/requests/request.actions";
import {
  getRequestStatusLabel,
  REQUEST_STATUS_OPTIONS,
} from "@/features/admin/requests/request.constants";
import {
  getDurationLabel,
  getProjectTypeLabel,
} from "@/features/admin/requests/request-formatters";
import { getAdminCollaborationRequest } from "@/server/collaboration/admin-collaboration.repository";

export default async function AdminRequestDetailPage({
  params,
}: PageProps<"/admin/requests/[id]">) {
  const { id } = await params;
  const result =
    await getAdminCollaborationRequest(id);

  if (!result) {
    notFound();
  }

  const { request, notes, events } = result;

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            {request.trackingCode}
          </span>
          <h1>{request.fullName}</h1>
          <p>
            ثبت‌شده در {formatAdminDate(request.createdAt)}
          </p>
        </div>
        <Link
          href="/admin/requests"
          className="admin-button"
        >
          بازگشت به درخواست‌ها
        </Link>
      </header>

      <div className="admin-detail-grid">
        <div className="admin-detail-column">
          <section className="admin-panel">
            <h2>اطلاعات درخواست</h2>
            <dl className="admin-description-list">
              <div>
                <dt>نام و نام خانوادگی</dt>
                <dd>{request.fullName}</dd>
              </div>
              <div>
                <dt>شماره تماس</dt>
                <dd dir="ltr">
                  <a href={`tel:${request.phone}`}>
                    {request.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>نوع پروژه</dt>
                <dd>
                  {request.projectTypes
                    .map(getProjectTypeLabel)
                    .join("، ")}
                </dd>
              </div>
              <div>
                <dt>بازه زمانی پیشنهادی</dt>
                <dd>
                  {getDurationLabel(
                    request.proposedDuration,
                  )}
                </dd>
              </div>
              <div>
                <dt>بودجه پیشنهادی</dt>
                <dd>
                  {formatToman(
                    request.proposedBudgetToman,
                  )}
                </dd>
              </div>
              <div>
                <dt>توضیحات</dt>
                <dd>
                  {request.description ||
                    "توضیحی ثبت نشده است."}
                </dd>
              </div>
              <div>
                <dt>وضعیت اعلان تلگرام</dt>
                <dd>
                  {request.telegramDeliveryStatus}
                </dd>
              </div>
            </dl>
          </section>

          <section className="admin-panel admin-form-stack">
            <div>
              <h2>یادداشت‌های داخلی</h2>
              <p>
                این یادداشت‌ها فقط در پنل مدیریت دیده
                می‌شوند.
              </p>
            </div>
            <form
              action={addRequestNoteAction}
              className="admin-form-stack"
            >
              <input
                type="hidden"
                name="requestId"
                value={request.id}
              />
              <label className="admin-field">
                <span>یادداشت جدید</span>
                <textarea
                  name="body"
                  minLength={2}
                  maxLength={2000}
                  required
                />
              </label>
              <button
                type="submit"
                className="admin-button admin-button--primary"
              >
                ثبت یادداشت
              </button>
            </form>

            {notes.length > 0 ? (
              <ul className="admin-timeline">
                {notes.map((note) => (
                  <li key={note.id}>
                    <p>{note.body}</p>
                    <small>
                      {note.authorName ?? "مدیر"} ·{" "}
                      {formatAdminDate(note.createdAt)}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty">
                هنوز یادداشتی ثبت نشده است.
              </p>
            )}
          </section>
        </div>

        <aside className="admin-detail-column">
          <section className="admin-panel admin-form-stack">
            <h2>وضعیت پیگیری</h2>
            <form
              action={updateRequestStatusAction}
              className="admin-form-stack"
            >
              <input
                type="hidden"
                name="requestId"
                value={request.id}
              />
              <label className="admin-field">
                <span>وضعیت فعلی</span>
                <select
                  name="status"
                  defaultValue={request.status}
                >
                  {REQUEST_STATUS_OPTIONS.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.label}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <button
                type="submit"
                className="admin-button admin-button--primary"
              >
                ذخیره وضعیت
              </button>
            </form>
          </section>

          <section className="admin-panel">
            <h2>تاریخچه وضعیت</h2>
            {events.length > 0 ? (
              <ul className="admin-timeline">
                {events.map((event) => (
                  <li key={event.id}>
                    <p>
                      {event.previousStatus
                        ? getRequestStatusLabel(
                            event.previousStatus,
                          )
                        : "—"}
                      {" ← "}
                      {event.nextStatus
                        ? getRequestStatusLabel(
                            event.nextStatus,
                          )
                        : "—"}
                    </p>
                    <small>
                      {event.actorName ?? "مدیر"} ·{" "}
                      {formatAdminDate(
                        event.createdAt,
                      )}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty">
                هنوز تغییری ثبت نشده است.
              </p>
            )}
          </section>

          <details className="admin-panel">
            <summary>اطلاعات فنی محدود</summary>
            <dl className="admin-description-list">
              <div>
                <dt>IP Hash</dt>
                <dd dir="ltr">
                  {request.ipHash || "—"}
                </dd>
              </div>
              <div>
                <dt>User Agent</dt>
                <dd dir="ltr">
                  {request.userAgent || "—"}
                </dd>
              </div>
              <div>
                <dt>خطای تلگرام</dt>
                <dd dir="ltr">
                  {request.telegramLastError || "—"}
                </dd>
              </div>
            </dl>
          </details>
        </aside>
      </div>
    </main>
  );
}
