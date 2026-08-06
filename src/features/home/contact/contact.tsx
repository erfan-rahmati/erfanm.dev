"use client";

import { type FormEvent, useRef, useState } from "react";

import { siteContact } from "@/config/site";
import { submitCollaborationRequest } from "./contact.actions";

import {
  collaborationDurationOptions,
  collaborationProjectTypeOptions,
  contactSectionContent,
} from "./contact.data";
import {
  ContactArrowIcon,
  ContactMessageIcon,
  ContactPhoneIcon,
  ContactSectionIcon,
  ContactSendIcon,
  ContactTelegramIcon,
} from "./contact.icons";
import type {
  CollaborationProjectTypeId,
  CollaborationRequestFormValues,
} from "./contact.types";
import {
  formatBudgetInput,
  isValidIranianMobile,
  normalizeIranianMobile,
  sanitizeBudgetInput,
  sanitizePhoneInput,
} from "./contact.utils";

type CollaborationFormErrors = Partial<
  Record<keyof CollaborationRequestFormValues | "form", string>
>;

type FormSubmissionState = "idle" | "submitting" | "success" | "error";

const initialFormValues: CollaborationRequestFormValues = {
  fullName: "",
  phone: "",
  projectTypes: [],
  proposedDuration: "",
  proposedBudgetToman: "",
  description: "",
};

function validateForm(values: CollaborationRequestFormValues) {
  const errors: CollaborationFormErrors = {};

  const normalizedFullName = values.fullName.trim();

  if (!normalizedFullName) {
    errors.fullName = "نام و نام خانوادگی را وارد کن.";
  } else if (normalizedFullName.split(/\s+/).length < 2) {
    errors.fullName = "نام و نام خانوادگی را کامل وارد کن.";
  }

  if (!values.phone.trim()) {
    errors.phone = "شماره تماس را وارد کن.";
  } else if (!isValidIranianMobile(values.phone)) {
    errors.phone = "شماره موبایل معتبر وارد کن.";
  }

  if (values.projectTypes.length === 0) {
    errors.projectTypes = "حداقل یک نوع پروژه را انتخاب کن.";
  }

  if (!values.proposedDuration) {
    errors.proposedDuration = "مدت‌زمان پیشنهادی را انتخاب کن.";
  }

  return errors;
}

function mapServerFieldErrors(
  fieldErrors: Record<string, string[]> | undefined,
) {
  const mappedErrors: CollaborationFormErrors = {};

  if (!fieldErrors) {
    return mappedErrors;
  }

  const supportedFields: readonly (keyof CollaborationRequestFormValues)[] = [
    "fullName",
    "phone",
    "projectTypes",
    "proposedDuration",
    "proposedBudgetToman",
    "description",
  ];

  for (const fieldName of supportedFields) {
    const firstMessage = fieldErrors[fieldName]?.[0];

    if (firstMessage) {
      mappedErrors[fieldName] = firstMessage;
    }
  }

  return mappedErrors;
}

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const submissionIdRef = useRef<string | null>(null);

  const [values, setValues] =
    useState<CollaborationRequestFormValues>(initialFormValues);

  const [errors, setErrors] = useState<CollaborationFormErrors>({});

  const [submissionState, setSubmissionState] =
    useState<FormSubmissionState>("idle");

  const [submissionMessage, setSubmissionMessage] = useState("");

  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const [website, setWebsite] = useState("");

  const clearFieldError = (fieldName: keyof CollaborationRequestFormValues) => {
    setErrors((currentErrors) => {
      if (!currentErrors[fieldName]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[fieldName];

      return nextErrors;
    });

    setSubmissionState("idle");
    setSubmissionMessage("");
    setTrackingCode(null);
    submissionIdRef.current = null;
  };

  const toggleProjectType = (projectTypeId: CollaborationProjectTypeId) => {
    setValues((currentValues) => {
      const isSelected = currentValues.projectTypes.includes(projectTypeId);

      return {
        ...currentValues,
        projectTypes: isSelected
          ? currentValues.projectTypes.filter(
              (selectedProjectTypeId) =>
                selectedProjectTypeId !== projectTypeId,
            )
          : [...currentValues.projectTypes, projectTypeId],
      };
    });

    clearFieldError("projectTypes");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submissionState === "submitting") {
      return;
    }

    const nextErrors = validateForm(values);

    setErrors(nextErrors);
    setSubmissionMessage("");
    setTrackingCode(null);

    if (Object.keys(nextErrors).length > 0) {
      setSubmissionState("idle");

      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });

      return;
    }

    setSubmissionState("submitting");
    const submissionId =
      submissionIdRef.current ?? globalThis.crypto.randomUUID();

    submissionIdRef.current = submissionId;

    try {
      const result = await submitCollaborationRequest({
        submissionId,
        ...values,
        projectTypes: [...values.projectTypes],
        website,
      });

      if (!result.ok) {
        const serverErrors = mapServerFieldErrors(result.fieldErrors);

        setErrors(serverErrors);
        setSubmissionState("error");
        setSubmissionMessage(result.message);

        window.requestAnimationFrame(() => {
          formRef.current
            ?.querySelector<HTMLElement>('[aria-invalid="true"]')
            ?.focus();
        });

        return;
      }

      setValues(initialFormValues);
      setWebsite("");
      submissionIdRef.current = null;
      setErrors({});
      setTrackingCode(result.trackingCode);
      setSubmissionState("success");

      setSubmissionMessage(
        result.telegramDelivered
          ? "درخواست شما با موفقیت ثبت شد.\n\nاطلاعات پروژه دریافت شد و پس از بررسی، در کوتاه‌ترین زمان ممکن (معمولاً کمتر از ۲۴ ساعت) از طریق اطلاعات تماس ثبت‌شده با شما ارتباط می‌گیرم تا درباره جزئیات پروژه و مسیر همکاری صحبت کنیم."
          : "درخواست شما با موفقیت ثبت شد.\n\nاطلاعات پروژه دریافت شد و پس از بررسی، در کوتاه‌ترین زمان ممکن (معمولاً کمتر از ۲۴ ساعت) از طریق اطلاعات تماس ثبت‌شده با شما ارتباط می‌گیرم تا درباره جزئیات پروژه و مسیر همکاری صحبت کنیم.",
      );
    } catch {
      setSubmissionState("error");
      setSubmissionMessage(
        "ارتباط با سرور برقرار نشد، لطفاً چند دقیقه دیگر دوباره تلاش کن",
      );
    }
  };

  const communicationItems = [
    {
      id: "whatsapp",
      label: siteContact.whatsapp.label,
      value: siteContact.whatsapp.displayValue,
      href: siteContact.whatsapp.href,
      icon: <ContactMessageIcon />,
      external: true,
    },
    {
      id: "telegram",
      label: siteContact.telegram.label,
      value: siteContact.telegram.displayValue,
      href: siteContact.telegram.href,
      icon: <ContactTelegramIcon />,
      external: true,
    },
    {
      id: "phone",
      label: siteContact.phone.label,
      value: siteContact.phone.displayValue,
      href: siteContact.phone.href,
      icon: <ContactPhoneIcon />,
      external: false,
    },
  ] as const;

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__background" aria-hidden="true">
        <span className="contact__glow contact__glow--primary" />
        <span className="contact__glow contact__glow--secondary" />
        <span className="contact__grid" />
      </div>

      <div className="contact__container">
        <header className="contact__header">
          <span className="contact__eyebrow">
            <span className="contact__eyebrow-icon">
              <ContactSectionIcon />
            </span>

            {contactSectionContent.eyebrow}
          </span>

          <h2 id="contact-title" className="contact__title">
            {contactSectionContent.title}
          </h2>

          <p className="contact__description">
            {contactSectionContent.description}
          </p>

          <div className="w-full mt-6 flex flex-wrap items-center gap-3">
            {contactSectionContent.trustItems.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <span>{item}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="contact__layout">
          <form
            ref={formRef}
            className="contact__form-card"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="contact__honeypot" aria-hidden="true">
              <label htmlFor="contact-website">وب‌سایت</label>

              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => {
                  setWebsite(event.target.value);
                }}
              />
            </div>
            <div className="contact__form-header">
              <div>
                <h3>{contactSectionContent.formTitle}</h3>

                <p>{contactSectionContent.formDescription}</p>
              </div>

              <span className="contact__form-status" aria-hidden="true">
                فرم اولیه پروژه
              </span>
            </div>

            <div className="contact__form-grid">
              <div className="contact__field">
                <label htmlFor="contact-full-name">
                  نام و نام خانوادگی
                  <span aria-hidden="true">*</span>
                </label>

                <input
                  id="contact-full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(event) => {
                    setValues((currentValues) => ({
                      ...currentValues,
                      fullName: event.target.value,
                    }));

                    clearFieldError("fullName");
                  }}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={
                    errors.fullName ? "contact-full-name-error" : undefined
                  }
                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                />

                {errors.fullName ? (
                  <span id="contact-full-name-error" className="contact__error">
                    {errors.fullName}
                  </span>
                ) : null}
              </div>

              <div className="contact__field">
                <label htmlFor="contact-phone">
                  شماره تماس
                  <span aria-hidden="true">*</span>
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  value={values.phone}
                  onChange={(event) => {
                    setValues((currentValues) => ({
                      ...currentValues,
                      phone: sanitizePhoneInput(event.target.value),
                    }));

                    clearFieldError("phone");
                  }}
                  onBlur={() => {
                    if (isValidIranianMobile(values.phone)) {
                      setValues((currentValues) => ({
                        ...currentValues,
                        phone: normalizeIranianMobile(currentValues.phone),
                      }));
                    }
                  }}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? "contact-phone-error" : undefined
                  }
                  placeholder="09xxxxxxxxx"
                />

                {errors.phone ? (
                  <span id="contact-phone-error" className="contact__error">
                    {errors.phone}
                  </span>
                ) : null}
              </div>

              <fieldset
                className="
                  contact__fieldset
                  contact__fieldset--full
                "
                aria-invalid={Boolean(errors.projectTypes)}
                aria-describedby={
                  errors.projectTypes
                    ? "contact-project-types-error"
                    : undefined
                }
              >
                <legend>
                  نوع پروژه
                  <span aria-hidden="true">*</span>
                </legend>

                <p className="contact__field-help">
                  امکان انتخاب چند گزینه وجود دارد.
                </p>

                <div className="contact__project-options">
                  {collaborationProjectTypeOptions.map((option) => {
                    const isSelected = values.projectTypes.includes(option.id);

                    return (
                      <label
                        key={option.id}
                        className={
                          isSelected
                            ? "contact__option is-selected"
                            : "contact__option"
                        }
                      >
                        <input
                          type="checkbox"
                          name="projectTypes"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => {
                            toggleProjectType(option.id);
                          }}
                        />

                        <span
                          className="contact__option-check"
                          aria-hidden="true"
                        />

                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>

                {errors.projectTypes ? (
                  <span
                    id="contact-project-types-error"
                    className="contact__error"
                  >
                    {errors.projectTypes}
                  </span>
                ) : null}
              </fieldset>

              <fieldset
                className="
                  contact__fieldset
                  contact__fieldset--full
                "
                aria-invalid={Boolean(errors.proposedDuration)}
                aria-describedby={
                  errors.proposedDuration ? "contact-duration-error" : undefined
                }
              >
                <legend>
                  مدت‌زمان پیشنهادی
                  <span aria-hidden="true">*</span>
                </legend>

                <div className="contact__duration-options">
                  {collaborationDurationOptions.map((option) => {
                    const isSelected = values.proposedDuration === option.id;

                    return (
                      <label
                        key={option.id}
                        className={
                          isSelected
                            ? "contact__duration is-selected"
                            : "contact__duration"
                        }
                      >
                        <input
                          type="radio"
                          name="proposedDuration"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => {
                            setValues((currentValues) => ({
                              ...currentValues,
                              proposedDuration: option.id,
                            }));

                            clearFieldError("proposedDuration");
                          }}
                        />

                        <span
                          className="contact__duration-radio"
                          aria-hidden="true"
                        />

                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>

                {errors.proposedDuration ? (
                  <span id="contact-duration-error" className="contact__error">
                    {errors.proposedDuration}
                  </span>
                ) : null}
              </fieldset>

              <div className="contact__field">
                <label htmlFor="contact-budget">
                  بودجه پیشنهادی
                  <small>اختیاری</small>
                </label>

                <div className="contact__budget-field">
                  <input
                    id="contact-budget"
                    name="proposedBudgetToman"
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={formatBudgetInput(values.proposedBudgetToman)}
                    onChange={(event) => {
                      setValues((currentValues) => ({
                        ...currentValues,
                        proposedBudgetToman: sanitizeBudgetInput(
                          event.target.value,
                        ),
                      }));

                      clearFieldError("proposedBudgetToman");
                    }}
                    placeholder="۱۵۰,۰۰۰,۰۰۰"
                  />

                  <span>تومان</span>
                </div>

                <span className="contact__field-help">
                  خالی‌بودن این بخش به معنی توافقی است
                </span>
              </div>

              <div
                className="
                  contact__field
                  contact__field--full
                "
              >
                <label htmlFor="contact-description">
                  توضیحات پروژه
                  <small>اختیاری</small>
                </label>

                <textarea
                  id="contact-description"
                  name="description"
                  rows={6}
                  value={values.description}
                  onChange={(event) => {
                    setValues((currentValues) => ({
                      ...currentValues,
                      description: event.target.value,
                    }));

                    clearFieldError("description");
                  }}
                  placeholder=" درباره ایده، امکانات موردنیاز، مخاطبان یا هر نکته‌ای که فکر می‌کنید در شناخت بهتر پروژه کمک می‌کند، بنویسید "
                />
              </div>
            </div>

            <div className="contact__submit-row">
              <button
                type="submit"
                className="contact__submit"
                disabled={submissionState === "submitting"}
                aria-busy={submissionState === "submitting"}
              >
                <span>
                  {submissionState === "submitting"
                    ? contactSectionContent.submittingLabel
                    : contactSectionContent.submitLabel}
                </span>

                <ContactSendIcon />
              </button>

              <p className="contact__privacy-note">
                اطلاعات شما فقط برای بررسی پروژه استفاده می‌شود و در اختیار شخص
                یا مجموعه دیگری قرار نخواهد گرفت{" "}
              </p>
            </div>

            <div
              className={[
                "contact__submission-message",
                submissionState === "success" ? "is-visible is-success" : "",
                submissionState === "error" ? "is-visible is-error" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role={submissionState === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              <span>{submissionMessage}</span>

              {trackingCode ? (
                <span className="contact__tracking-code">
                  شناسه درخواست :
                  <bdi>{trackingCode}</bdi>
                </span>
              ) : null}
            </div>
          </form>

          <aside
            className="contact__communication-card"
            aria-labelledby="contact-communication-title"
          >
            <div className="contact__communication-heading">
              <span className="contact__communication-mark">ارتباط</span>

              <h3 id="contact-communication-title">
                {contactSectionContent.communicationTitle}
              </h3>

              <p>{contactSectionContent.communicationDescription}</p>
            </div>

            <div className="contact__communication-list">
              {communicationItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="contact__communication-link"
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  aria-label={`${item.label}: ${item.value}`}
                >
                  <span className="contact__communication-icon">
                    {item.icon}
                  </span>

                  <span className="contact__communication-content">
                    <small>{item.label}</small>
                    <strong dir="ltr">{item.value}</strong>
                  </span>

                  <ContactArrowIcon className="contact__communication-arrow" />
                </a>
              ))}
            </div>

            <div className="contact__communication-footer">
              <span aria-hidden="true" />

              <p>
                برای پروژه‌های جدید، ثبت فرم کمک می‌کند اطلاعات اولیه منظم‌تر
                بررسی شوند.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
