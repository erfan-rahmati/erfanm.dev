"use client";

import { useActionState } from "react";

import {
  deleteArticleAction,
  type ArticleActionState,
} from "./article.actions";

const initialState: ArticleActionState = {
  ok: false,
  message: "",
};

export function ArticleDeleteForm({
  articleId,
  articleTitle,
}: Readonly<{ articleId: string; articleTitle: string }>) {
  const [state, action, isPending] =
    useActionState(
      deleteArticleAction,
      initialState,
    );

  return (
    <details className="admin-danger-disclosure">
      <summary>حذف کامل</summary>
      <form action={action} className="admin-inline-form">
      <input
        type="hidden"
        name="id"
        value={articleId}
      />
      <input
        name="confirmation"
        placeholder="حذف دائمی"
        aria-label="عبارت تأیید حذف دائمی"
        required
      />
      <button
        type="submit"
        className="admin-button admin-button--danger"
        disabled={isPending}
      >
        {isPending ? "حذف..." : "حذف دائمی"}
      </button>
      {state.message ? (
        <span
          className={
            state.ok
              ? "admin-alert admin-alert--success"
              : "admin-alert admin-alert--error"
          }
          role="status"
        >
          {state.message}
        </span>
      ) : null}
      </form>
      <small>با حذف «{articleTitle}»، رکورد دیتابیس و فایل‌های متصل برای همیشه پاک می‌شوند.</small>
    </details>
  );
}
