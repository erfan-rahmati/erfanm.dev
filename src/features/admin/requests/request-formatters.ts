import {
  collaborationDurationOptions,
  collaborationProjectTypeOptions,
} from "@/features/home/contact/contact.data";

export function getProjectTypeLabel(
  value: string,
) {
  return (
    collaborationProjectTypeOptions.find(
      (item) => item.id === value,
    )?.label ?? value
  );
}

export function getDurationLabel(
  value: string,
) {
  return (
    collaborationDurationOptions.find(
      (item) => item.id === value,
    )?.label ?? value
  );
}
