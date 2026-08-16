import type {
  collaborationRequestStatusEnum,
} from "@/db/schema";

export type CollaborationRequestStatus =
  (typeof collaborationRequestStatusEnum.enumValues)[number];

export const REQUEST_STATUS_OPTIONS = [
  {
    id: "new",
    label: "جدید",
  },
  {
    id: "reviewing",
    label: "در حال بررسی",
  },
  {
    id: "contacted",
    label: "تماس گرفته شد",
  },
  {
    id: "accepted",
    label: "پذیرفته‌شده",
  },
  {
    id: "rejected",
    label: "ردشده",
  },
  {
    id: "archived",
    label: "آرشیوشده",
  },
] as const satisfies readonly {
  id: CollaborationRequestStatus;
  label: string;
}[];

export function getRequestStatusLabel(
  status: CollaborationRequestStatus,
) {
  return (
    REQUEST_STATUS_OPTIONS.find(
      (item) => item.id === status,
    )?.label ?? status
  );
}
