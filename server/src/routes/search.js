import express from 'express';
import axios from 'axios';
import { getServiceById } from '../models/services.js';

const router = express.Router();

// Dublin area coordinates
const DUBLIN_COORDS = {
  lat: 53.3498,
  lng: -6.2603
};

// Dublin neighborhoods with coordinates
const DUBLIN_AREAS = {
  'City Centre': { lat: 53.3498, lng: -6.2603 },
  'Rathmines': { lat: 53.3302, lng: -6.2635 },
  'Dundrum': { lat: 53.2893, lng: -6.2446 },
  'Ballsbridge': { lat: 53.3272, lng: -6.2290 },
  'Sandyford': { lat: 53.2779, lng: -6.2234 },
  'Blackrock': { lat: 53.3015, lng: -6.1778 },
  'Clontarf': { lat: 53.3697, lng: -6.1853 },
  'Howth': { lat: 53.3873, lng: -6.0654 },
  'Swords': { lat: 53.4597, lng: -6.2181 },
  'Tallaght': { lat: 53.2859, lng: -6.3742 }
};

// Search for service providers using Google Places API
router.post('/providers', async (req, res) => {
  try {
    const { serviceId, location, area, userCoords } = req.body;
    
    // Get service details
    const service = getServiceById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Determine search center coordinates
    let searchCenter = DUBLIN_COORDS;
    if (userCoords && userCoords.lat && userCoords.lng) {
      searchCenter = userCoords;
    } else if (area && DUBLIN_AREAS[area]) {
      searchCenter = DUBLIN_AREAS[area];
    }

    // Build search query based on service keywords
    const searchQuery = `${service.keywords[0]} ${area || 'Dublin'}`;
    
    // Call Google Places Text Search API
    const placesResponse = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery: searchQuery,
        locationBias: {
          circle: {
            center: {
              latitude: searchCenter.lat,
              longitude: searchCenter.lng
            },
            radius: 5000 // 5km radius
          }
        },
        includedType: getPlaceType(service.categoryId),
        maxResultCount: 20
      },
      {
        headers: {
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.priceLevel,places.currentOpeningHours'
        }
      }
    );

    // Transform Places results into provider format
    const providers = (placesResponse.data.places || []).map(place => ({
      id: place.id || generateProviderId(),
      name: place.displayName?.text || 'Service Provider',
      address: place.formattedAddress || 'Dublin',
      location: {
        lat: place.location?.latitude || searchCenter.lat,
        lng: place.location?.longitude || searchCenter.lng
      },
      rating: place.rating || 4.5,
      totalReviews: place.userRatingCount || Math.floor(Math.random() * 100) + 10,
      photos: place.photos ? place.photos.slice(0, 3).map(p => p.name) : [],
      distance: calculateDistance(
        place.location?.latitude || searchCenter.lat,
        place.location?.longitude || searchCenter.lng,
        searchCenter.lat,
        searchCenter.lng
      ),
      // Service-specific data
      service: {
        id: service.id,
        name: service.name,
        categoryId: service.categoryId,
        categoryName: service.categoryName,
        basePrice: service.basePrice,
        priceUnit: service.priceUnit,
        duration: service.duration
      },
      // Mock data for MVP
      availability: generateAvailability(),
      verified: Math.random() > 0.3,
      responseTime: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
      completedJobs: Math.floor(Math.random() * 500) + 50
    }));

    // Sort by distance
    providers.sort((a, b) => a.distance - b.distance);

    // If no real results, add mock providers
    if (providers.length < 3) {
      const mockProviders = generateMockProviders(service, searchCenter, 3 - providers.length);
      providers.push(...mockProviders);
    }

    res.json({
      providers,
      total: providers.length,
      service,
      searchArea: area || 'Dublin',
      searchCenter
    });

  } catch (error) {
    console.error('Provider search error:', error.response?.data || error.message);
    
    // Fallback to mock data if API fails
    const service = getServiceById(req.body.serviceId);
    if (service) {
      const mockProviders = generateMockProviders(service, DUBLIN_COORDS, 5);
      return res.json({
        providers: mockProviders,
        total: mockProviders.length,
        service,
        searchArea: req.body.area || 'Dublin',
        searchCenter: DUBLIN_COORDS,
        mock: true
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to search providers',
      message: error.message 
    });
  }
});

// Get nearby providers based on user location
router.post('/nearby', async (req, res) => {
  try {
    const { lat, lng, serviceId, radius = 3000 } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const service = getServiceById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Call Google Places Nearby Search API
    const placesResponse = await axios.post(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        includedTypes: [getPlaceType(service.categoryId)],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius: radius
          }
        }
      },
      {
        headers: {
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount'
        }
      }
    );

    const providers = (placesResponse.data.places || []).map(place => ({
      id: place.id || generateProviderId(),
      name: place.displayName?.text || 'Nearby Provider',
      address: place.formattedAddress || 'Dublin',
      location: {
        lat: place.location?.latitude,
        lng: place.location?.longitude
      },
      rating: place.rating || 4.3,
      totalReviews: place.userRatingCount || 25,
      distance: calculateDistance(
        place.location?.latitude,
        place.location?.longitude,
        lat,
        lng
      ),
      service: {
        id: service.id,
        name: service.name,
        basePrice: service.basePrice
      },
      available: Math.random() > 0.2
    }));

    res.json({
      providers: providers.sort((a, b) => a.distance - b.distance),
      total: providers.length,
      searchRadius: radius
    });

  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({ error: 'Failed to search nearby providers' });
  }
});

// Helper functions
function getPlaceType(categoryId) {
  const typeMap = {
    'cleaning-pest': 'cleaning_service',
    'beauty-wellness': 'beauty_salon',
    'it-services': 'electronics_store'
  };
  return typeMap[categoryId] || 'local_business';
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function generateAvailability() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const availability = {};
  
  days.forEach(day => {
    if (Math.random() > 0.2) {
      availability[day] = {
        available: true,
        slots: ['09:00', '11:00', '14:00', '16:00'].filter(() => Math.random() > 0.3)
      };
    } else {
      availability[day] = { available: false, slots: [] };
    }
  });
  
  return availability;
}

function generateProviderId() {
  return 'mock_' + Math.random().toString(36).substr(2, 9);
}

function generateMockProviders(service, center, count = 5) {
  const mockNames = [
    'Dublin Pro Services',
    'Swift Home Solutions',
    'Expert Care Dublin',
    'Premium Service Pros',
    'Reliable Home Services'
  ];
  
  const mockProviders = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random location within 5km
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 5; // km
    const deltaLat = (distance / 111) * Math.cos(angle);
    const deltaLng = (distance / (111 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);
    
    mockProviders.push({
      id: generateProviderId(),
      name: mockNames[i % mockNames.length],
      address: `${Math.floor(Math.random() * 200) + 1} Example Street, Dublin`,
      location: {
        lat: center.lat + deltaLat,
        lng: center.lng + deltaLng
      },
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 - 5.0
      totalReviews: Math.floor(Math.random() * 200) + 20,
      photos: [],
      distance: distance.toFixed(1),
      service: {
        id: service.id,
        name: service.name,
        categoryId: service.categoryId,
        categoryName: service.categoryName,
        basePrice: service.basePrice,
        priceUnit: service.priceUnit,
        duration: service.duration
      },
      availability: generateAvailability(),
      verified: Math.random() > 0.4,
      responseTime: Math.floor(Math.random() * 25) + 10,
      completedJobs: Math.floor(Math.random() * 300) + 30
    });
  }
  
  return mockProviders;
}

export default router; 