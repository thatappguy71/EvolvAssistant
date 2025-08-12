import { useState, useEffect } from 'react';

export interface LocationData {
  country: string;
  region: string;
  city: string;
  timezone: string;
  currency: string;
  countryCode: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // First try to get cached location
        const cachedLocation = localStorage.getItem('userLocation');
        if (cachedLocation) {
          setLocation(JSON.parse(cachedLocation));
          setIsLoading(false);
          return;
        }

        // Use ipapi.co for location detection (free, no API key required)
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to detect location');
        }

        const data = await response.json();
        
        const locationData: LocationData = {
          country: data.country_name || 'Canada',
          region: data.region || '',
          city: data.city || '',
          timezone: data.timezone || 'America/Toronto',
          currency: data.currency || 'CAD',
          countryCode: data.country_code || 'CA'
        };

        // Cache for 24 hours
        localStorage.setItem('userLocation', JSON.stringify(locationData));
        localStorage.setItem('locationTimestamp', Date.now().toString());
        
        setLocation(locationData);
        
        // Update user location in database
        try {
          const response = await fetch('/api/user/location', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationData),
          });
          
          if (!response.ok && response.status !== 401) {
            console.warn('Failed to update user location in database');
          }
        } catch (dbErr) {
          console.warn('Failed to update user location in database:', dbErr);
        }
      } catch (err) {
        // Fallback to Canada if detection fails
        const defaultLocation: LocationData = {
          country: 'Canada',
          region: 'Ontario',
          city: 'Toronto',
          timezone: 'America/Toronto',
          currency: 'CAD',
          countryCode: 'CA'
        };
        setLocation(defaultLocation);
        setError('Using default location (Canada)');
      } finally {
        setIsLoading(false);
      }
    };

    // Check if cached location is still valid (24 hours)
    const timestamp = localStorage.getItem('locationTimestamp');
    const isExpired = !timestamp || (Date.now() - parseInt(timestamp)) > 24 * 60 * 60 * 1000;
    
    if (isExpired) {
      localStorage.removeItem('userLocation');
      localStorage.removeItem('locationTimestamp');
    }

    detectLocation();
  }, []);

  return { location, isLoading, error };
}