import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapsProps {
  selectedArea?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMaps: React.FC<GoogleMapsProps> = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Dublin center coordinates
  const DUBLIN_CENTER = { lat: 53.3498, lng: -6.2603 };

  // Mock service providers in Dublin
  const dublinServiceProviders = [
    {
      name: 'CleanPro Dublin',
      service: 'Home Cleaning',
      location: { lat: 53.3498, lng: -6.2603 },
      rating: 4.8,
      address: 'O\'Connell Street, Dublin 1'
    },
    {
      name: 'FixIt Fast',
      service: 'Home Repairs',
      location: { lat: 53.3344, lng: -6.2575 },
      rating: 4.6,
      address: 'Rathmines, Dublin 6'
    },
    {
      name: 'Green Thumb Gardens',
      service: 'Garden Maintenance',
      location: { lat: 53.3088, lng: -6.2257 },
      rating: 4.9,
      address: 'Dundrum, Dublin 14'
    },
    {
      name: 'MoveRight Dublin',
      service: 'Moving Services',
      location: { lat: 53.3242, lng: -6.3857 },
      rating: 4.7,
      address: 'Inchicore, Dublin 8'
    },
    {
      name: 'Elite Cleaning Services',
      service: 'Home Cleaning',
      location: { lat: 53.3789, lng: -6.2374 },
      rating: 4.5,
      address: 'Drumcondra, Dublin 9'
    },
    {
      name: 'Dublin Handyman',
      service: 'Home Repairs',
      location: { lat: 53.2919, lng: -6.1358 },
      rating: 4.4,
      address: 'Blackrock, Dublin'
    }
  ];

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps');
      };
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMaps();
    } else {
      initializeMap();
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userLoc);
          if (map) {
            addUserLocationMarker(userLoc);
          }
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: DUBLIN_CENTER,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(mapInstance);

    // Add service provider markers
    addServiceProviderMarkers(mapInstance);

    // Add user location if available
    if (userLocation) {
      addUserLocationMarker(userLocation);
    }
  };

  const addServiceProviderMarkers = (mapInstance: any) => {
    const newMarkers = dublinServiceProviders.map((provider) => {
      const marker = new window.google.maps.Marker({
        position: provider.location,
        map: mapInstance,
        title: provider.name,
        icon: {
          url: getMarkerIcon(provider.service),
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; color: #1f2937;">${provider.name}</h3>
            <p style="margin: 0 0 5px 0; color: #6b7280;">${provider.service}</p>
            <p style="margin: 0 0 5px 0; color: #6b7280;">${provider.address}</p>
            <div style="display: flex; align-items: center; margin: 5px 0;">
              <span style="color: #fbbf24;">★</span>
              <span style="margin-left: 5px; color: #6b7280;">${provider.rating}</span>
            </div>
            <button onclick="bookService('${provider.name}')" 
                    style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
              Book Now
            </button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const addUserLocationMarker = (location: { lat: number; lng: number }) => {
    if (!map) return;

    const userMarker = new window.google.maps.Marker({
      position: location,
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="12" fill="#2563eb" stroke="white" stroke-width="3"/>
            <circle cx="15" cy="15" r="6" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(30, 30)
      }
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: '<div style="padding: 10px;"><strong>Your Location</strong></div>'
    });

    userMarker.addListener('click', () => {
      infoWindow.open(map, userMarker);
    });
  };

  const getMarkerIcon = (service: string) => {
    const icons = {
      'Home Cleaning': 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="12" fill="#10b981"/>
          <text x="15" y="20" text-anchor="middle" fill="white" font-size="16">🧹</text>
        </svg>
      `),
      'Home Repairs': 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="12" fill="#f59e0b"/>
          <text x="15" y="20" text-anchor="middle" fill="white" font-size="16">🔧</text>
        </svg>
      `),
      'Garden Maintenance': 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="12" fill="#059669"/>
          <text x="15" y="20" text-anchor="middle" fill="white" font-size="16">🌿</text>
        </svg>
      `),
      'Moving Services': 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="12" fill="#7c3aed"/>
          <text x="15" y="20" text-anchor="middle" fill="white" font-size="16">📦</text>
        </svg>
      `)
    };

    return icons[service as keyof typeof icons] || icons['Home Cleaning'];
  };

  const searchNearbyServices = () => {
    if (!map || !userLocation) return;

    // In a real app, this would make an API call to find nearby services
    const nearbyProviders = dublinServiceProviders.filter(provider => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        provider.location.lat,
        provider.location.lng
      );
      return distance <= 5; // Within 5km
    });

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Add nearby markers
    const newMarkers = nearbyProviders.map((provider) => {
      const marker = new window.google.maps.Marker({
        position: provider.location,
        map: map,
        title: provider.name,
        icon: {
          url: getMarkerIcon(provider.service),
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all nearby services
    if (nearbyProviders.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      nearbyProviders.forEach(provider => {
        bounds.extend(provider.location);
      });
      bounds.extend(userLocation);
      map.fitBounds(bounds);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-4">
        <button
          onClick={searchNearbyServices}
          disabled={!userLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Find Services Near Me
        </button>
        <button
          onClick={() => {
            if (map) {
              map.setCenter(DUBLIN_CENTER);
              map.setZoom(12);
            }
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Show All Dublin
        </button>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-300"
        style={{ minHeight: '400px' }}
      />
      
      {!window.google && (
        <div className="w-full h-96 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <p className="text-gray-600">Loading Google Maps...</p>
            <p className="text-sm text-gray-500 mt-2">
              Note: You'll need to add your Google Maps API key to see the map
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMaps; 