"use client";

import { useActionState } from "react";
import { deleteProjectAction, type ProjectActionState } from "./project.actions";

const initial: ProjectActionState = { ok: false, message: "" };
export function ProjectDeleteForm({ projectId, projectTitle }: Readonly<{ projectId: string; projectTitle: string }>) {
  const [state, action, pending] = useActionState(deleteProjectAction, initial);
  return <details className="admin-danger-disclosure"><summary>حذف کامل</summary><form action={action} className="admin-inline-form">
    <input type="hidden" name="id" value={projectId} />
    <input name="confirmation" placeholder="حذف دائمی" aria-label="عبارت تأیید حذف" required />
    <button className="admin-button admin-button--danger" disabled={pending}>{pending ? "حذف..." : "حذف دائمی"}</button>
    {state.message ? <span className={`admin-alert ${state.ok ? "admin-alert--success" : "admin-alert--error"}`}>{state.message}</span> : null}
  </form><small>با حذف «{projectTitle}»، رکورد دیتابیس و فایل‌های متصل برای همیشه پاک می‌شوند.</small></details>;
}
