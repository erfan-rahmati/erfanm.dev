"use client";

import { useState } from "react";

import { authClient } from "./auth-client";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  return (
    <form
      className="admin-login__form"
      onSubmit={async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const formData = new FormData(
          event.currentTarget,
        );

        try {
          const result =
            await authClient.signIn.email({
              email: String(
                formData.get("email") ?? "",
              ).trim(),
              password: String(
                formData.get("password") ?? "",
              ),
              rememberMe: true,
              callbackURL: "/admin",
            });

          if (result.error) {
            setErrorMessage(
              "ایمیل یا رمز عبور صحیح نیست، یا این حساب اجازه مدیریت ندارد.",
            );
            return;
          }

          const sessionResult =
            await authClient.getSession();
          const roles =
            sessionResult.data?.user.role
              ?.split(",")
              .map((role) => role.trim()) ?? [];

          if (!roles.includes("admin")) {
            await authClient.signOut();
            setErrorMessage(
              "این حساب اجازه ورود به پنل مدیریت را ندارد.",
            );
            return;
          }

          window.location.assign("/admin");
        }
        catch {
          setErrorMessage(
            "ارتباط با سرور برقرار نشد. چند لحظه دیگر دوباره تلاش کن.",
          );
        }
        finally {
          setIsSubmitting(false);
        }
      }}
    >
      <label className="admin-field">
        <span>ایمیل مدیر</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          inputMode="email"
          dir="ltr"
          required
        />
      </label>

      <label className="admin-field">
        <span>رمز عبور</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={12}
          maxLength={128}
          dir="ltr"
          required
        />
      </label>

      {errorMessage ? (
        <p
          className="admin-alert admin-alert--error"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="admin-button admin-button--primary admin-button--wide"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "در حال بررسی..."
          : "ورود به پنل مدیریت"}
      </button>
    </form>
  );
}
