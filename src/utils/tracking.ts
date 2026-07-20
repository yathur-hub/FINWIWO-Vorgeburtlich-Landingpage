export type DataLayerEvent = Record<string, unknown> & {
  event: string;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export const TRACKING_FORM_NAME = "prenatal_registration_landingpage";

export type ConsultationType = "phone" | "video_call" | "in_person";

export function normalizeConsultationType(
  value: string | null | undefined
): ConsultationType | null {
  switch (value) {
    case "Telefon":
      return "phone";
    case "Video-Call":
      return "video_call";
    case "Persönlich":
      return "in_person";
    default:
      return null;
  }
}

export function pushToDataLayer(payload: DataLayerEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}
