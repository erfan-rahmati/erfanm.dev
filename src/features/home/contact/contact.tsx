"use client";

import {
  type FormEvent,
  useRef,
  useState,
} from "react";

import { siteContact } from "@/config/site";

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

type CollaborationFormErrors =
  Partial<
    Record<
      | keyof CollaborationRequestFormValues
      | "form",
      string
    >
  >;

type FormSubmissionState =
  | "idle"
  | "validated";

const initialFormValues: CollaborationRequestFormValues = {
  fullName: "",
  phone: "",
  projectTypes: [],
  proposedDuration: "",
  proposedBudgetToman: "",
  description: "",
};

function validateForm(
  values: CollaborationRequestFormValues,
) {
  const errors: CollaborationFormErrors = {};

  const normalizedFullName =
    values.fullName.trim();

  if (!normalizedFullName) {
    errors.fullName =
      "نام و نام خانوادگی را وارد کن.";
  }
  else if (
    normalizedFullName.split(/\s+/).length < 2
  ) {
    errors.fullName =
      "نام و نام خانوادگی را کامل وارد کن.";
  }

  if (!values.phone.trim()) {
    errors.phone =
      "شماره تماس را وارد کن.";
  }
  else if (
    !isValidIranianMobile(values.phone)
  ) {
    errors.phone =
      "شماره موبایل معتبر وارد کن.";
  }

  if (values.projectTypes.length === 0) {
    errors.projectTypes =
      "حداقل یک نوع پروژه را انتخاب کن.";
  }

  if (!values.proposedDuration) {
    errors.proposedDuration =
      "مدت‌زمان پیشنهادی را انتخاب کن.";
  }

  return errors;
}

export function Contact() {
  const formRef =
    useRef<HTMLFormElement>(null);

  const [
    values,
    setValues,
  ] = useState<CollaborationRequestFormValues>(
    initialFormValues,
  );

  const [
    errors,
    setErrors,
  ] = useState<CollaborationFormErrors>({});

  const [
    submissionState,
    setSubmissionState,
  ] = useState<FormSubmissionState>("idle");

  const clearFieldError = (
    fieldName: keyof CollaborationRequestFormValues,
  ) => {
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
  };

  const toggleProjectType = (
    projectTypeId: CollaborationProjectTypeId,
  ) => {
    setValues((currentValues) => {
      const isSelected =
        currentValues.projectTypes.includes(
          projectTypeId,
        );

      return {
        ...currentValues,
        projectTypes: isSelected
          ? currentValues.projectTypes.filter(
              (selectedProjectTypeId) =>
                selectedProjectTypeId !==
                projectTypeId,
            )
          : [
              ...currentValues.projectTypes,
              projectTypeId,
            ],
      };
    });

    clearFieldError("projectTypes");
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nextErrors =
      validateForm(values);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmissionState("idle");

      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>(
            '[aria-invalid="true"]',
          )
          ?.focus();
      });

      return;
    }

    const normalizedPhone =
      normalizeIranianMobile(values.phone);

    setValues((currentValues) => ({
      ...currentValues,
      phone: normalizedPhone,
    }));

    setSubmissionState("validated");
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
    <section
      id="contact"
      className="contact"
      aria-labelledby="contact-title"
    >
      <div
        className="contact__background"
        aria-hidden="true"
      >
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

          <h2
            id="contact-title"
            className="contact__title"
          >
            {contactSectionContent.title}
          </h2>

          <p className="contact__description">
            {contactSectionContent.description}
          </p>
        </header>

        <div className="contact__layout">
          <form
            ref={formRef}
            className="contact__form-card"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="contact__form-header">
              <div>
                <h3>
                  {contactSectionContent.formTitle}
                </h3>

                <p>
                  {
                    contactSectionContent.formDescription
                  }
                </p>
              </div>

              <span
                className="contact__form-status"
                aria-hidden="true"
              >
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
                  aria-invalid={
                    Boolean(errors.fullName)
                  }
                  aria-describedby={
                    errors.fullName
                      ? "contact-full-name-error"
                      : undefined
                  }
                  placeholder="مثلاً عرفان رحمتی"
                />

                {errors.fullName ? (
                  <span
                    id="contact-full-name-error"
                    className="contact__error"
                  >
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
                      phone: sanitizePhoneInput(
                        event.target.value,
                      ),
                    }));

                    clearFieldError("phone");
                  }}
                  onBlur={() => {
                    if (
                      isValidIranianMobile(
                        values.phone,
                      )
                    ) {
                      setValues(
                        (currentValues) => ({
                          ...currentValues,
                          phone:
                            normalizeIranianMobile(
                              currentValues.phone,
                            ),
                        }),
                      );
                    }
                  }}
                  aria-invalid={
                    Boolean(errors.phone)
                  }
                  aria-describedby={
                    errors.phone
                      ? "contact-phone-error"
                      : undefined
                  }
                  placeholder="09354055150"
                />

                {errors.phone ? (
                  <span
                    id="contact-phone-error"
                    className="contact__error"
                  >
                    {errors.phone}
                  </span>
                ) : null}
              </div>

              <fieldset
                className="
                  contact__fieldset
                  contact__fieldset--full
                "
                aria-invalid={
                  Boolean(errors.projectTypes)
                }
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
                  {collaborationProjectTypeOptions.map(
                    (option) => {
                      const isSelected =
                        values.projectTypes.includes(
                          option.id,
                        );

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
                              toggleProjectType(
                                option.id,
                              );
                            }}
                          />

                          <span
                            className="contact__option-check"
                            aria-hidden="true"
                          />

                          <span>
                            {option.label}
                          </span>
                        </label>
                      );
                    },
                  )}
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
                aria-invalid={
                  Boolean(errors.proposedDuration)
                }
                aria-describedby={
                  errors.proposedDuration
                    ? "contact-duration-error"
                    : undefined
                }
              >
                <legend>
                  مدت‌زمان پیشنهادی
                  <span aria-hidden="true">*</span>
                </legend>

                <div className="contact__duration-options">
                  {collaborationDurationOptions.map(
                    (option) => {
                      const isSelected =
                        values.proposedDuration ===
                        option.id;

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
                              setValues(
                                (currentValues) => ({
                                  ...currentValues,
                                  proposedDuration:
                                    option.id,
                                }),
                              );

                              clearFieldError(
                                "proposedDuration",
                              );
                            }}
                          />

                          <span
                            className="contact__duration-radio"
                            aria-hidden="true"
                          />

                          <span>
                            {option.label}
                          </span>
                        </label>
                      );
                    },
                  )}
                </div>

                {errors.proposedDuration ? (
                  <span
                    id="contact-duration-error"
                    className="contact__error"
                  >
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
                    value={formatBudgetInput(
                      values.proposedBudgetToman,
                    )}
                    onChange={(event) => {
                      setValues(
                        (currentValues) => ({
                          ...currentValues,
                          proposedBudgetToman:
                            sanitizeBudgetInput(
                              event.target.value,
                            ),
                        }),
                      );

                      clearFieldError(
                        "proposedBudgetToman",
                      );
                    }}
                    placeholder="۱۵۰,۰۰۰,۰۰۰"
                  />

                  <span>تومان</span>
                </div>

                <span className="contact__field-help">
                  خالی‌بودن این بخش به معنی توافقی است.
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
                      description:
                        event.target.value,
                    }));

                    clearFieldError("description");
                  }}
                  placeholder="درباره هدف پروژه، امکانات موردنیاز یا شرایط فعلی آن توضیح بده."
                />
              </div>
            </div>

            <div className="contact__submit-row">
              <button
                type="submit"
                className="contact__submit"
              >
                <span>
                  {contactSectionContent.submitLabel}
                </span>

                <ContactSendIcon />
              </button>

              <p className="contact__privacy-note">
                اطلاعات فرم فقط برای بررسی درخواست
                همکاری استفاده خواهد شد.
              </p>
            </div>

            <div
              className={
                submissionState === "validated"
                  ? "contact__submission-message is-visible"
                  : "contact__submission-message"
              }
              role="status"
              aria-live="polite"
            >
              فرم بدون خطا تکمیل شده است؛ هنوز
              اطلاعاتی ارسال نشده و اتصال امن به
              PostgreSQL و Telegram در مرحله Backend
              انجام می‌شود.
            </div>
          </form>

          <aside
            className="contact__communication-card"
            aria-labelledby="contact-communication-title"
          >
            <div className="contact__communication-heading">
              <span className="contact__communication-mark">
                ارتباط
              </span>

              <h3 id="contact-communication-title">
                {
                  contactSectionContent.communicationTitle
                }
              </h3>

              <p>
                {
                  contactSectionContent.communicationDescription
                }
              </p>
            </div>

            <div className="contact__communication-list">
              {communicationItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="contact__communication-link"
                  target={
                    item.external
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    item.external
                      ? "noreferrer"
                      : undefined
                  }
                  aria-label={`${item.label}: ${item.value}`}
                >
                  <span className="contact__communication-icon">
                    {item.icon}
                  </span>

                  <span className="contact__communication-content">
                    <small>{item.label}</small>
                    <strong dir="ltr">
                      {item.value}
                    </strong>
                  </span>

                  <ContactArrowIcon className="contact__communication-arrow" />
                </a>
              ))}
            </div>

            <div className="contact__communication-footer">
              <span aria-hidden="true" />

              <p>
                برای پروژه‌های جدید، ثبت فرم کمک
                می‌کند اطلاعات اولیه منظم‌تر بررسی
                شوند.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}