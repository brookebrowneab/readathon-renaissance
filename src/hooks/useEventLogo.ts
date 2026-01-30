import { useActiveEvent } from "./useActiveEvent";
import fallbackLogo from "@/assets/logo.svg";

/**
 * Hook to get the current event's logo URL.
 * Falls back to the static logo.svg if no custom logo is set.
 */
export function useEventLogo() {
  const { data: event, isLoading } = useActiveEvent();
  
  // Use the custom logo from the event if available, otherwise fall back to static logo
  const logoUrl = event?.logo_url || fallbackLogo;
  
  return {
    logoUrl,
    isLoading,
    hasCustomLogo: !!event?.logo_url,
  };
}
