import { useLocation } from "@/hooks/useLocation";

export function LocationIndicator() {
  const { location, isLoading, error } = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span>Detecting location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <span>🌍</span>
        <span>Using default location</span>
      </div>
    );
  }

  if (!location) return null;

  const flagEmoji = {
    CA: '🇨🇦',
    US: '🇺🇸',
    UK: '🇬🇧',
    GB: '🇬🇧',
    AU: '🇦🇺',
  }[location.countryCode] || '🌍';

  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <span>{flagEmoji}</span>
      <span>{location.city ? `${location.city}, ${location.country}` : location.country}</span>
    </div>
  );
}