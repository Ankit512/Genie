// MVP Service Categories and Sub-services
export const serviceCategories = [
  {
    id: 'cleaning-pest',
    name: 'Cleaning & Pest Control',
    icon: '🧹',
    description: 'Professional cleaning and pest control services',
    services: [
      {
        id: 'full-clean',
        name: 'Full Home Cleaning',
        description: 'Complete home cleaning service including all rooms',
        basePrice: 50,
        priceUnit: 'per hour',
        duration: 120, // minutes
        keywords: ['cleaning', 'home cleaning', 'house cleaning', 'deep clean']
      },
      {
        id: 'deep-clean',
        name: 'Deep Cleaning',
        description: 'Intensive cleaning for kitchens, bathrooms, and hard-to-reach areas',
        basePrice: 70,
        priceUnit: 'per hour',
        duration: 180,
        keywords: ['deep cleaning', 'intensive cleaning', 'spring cleaning']
      },
      {
        id: 'insta-help',
        name: 'Insta Help Cleaning',
        description: 'Quick cleaning service for urgent needs',
        basePrice: 40,
        priceUnit: 'per hour',
        duration: 60,
        keywords: ['quick cleaning', 'emergency cleaning', 'instant cleaning']
      },
      {
        id: 'pest-control',
        name: 'Pest Control',
        description: 'Professional pest removal and prevention',
        basePrice: 80,
        priceUnit: 'per visit',
        duration: 90,
        keywords: ['pest control', 'exterminator', 'pest removal', 'insects']
      }
    ]
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    icon: '💆',
    description: 'Beauty, grooming, and wellness services for all',
    services: [
      {
        id: 'haircut-style',
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling at your home',
        basePrice: 35,
        priceUnit: 'per service',
        duration: 45,
        keywords: ['haircut', 'hair styling', 'barber', 'hairdresser']
      },
      {
        id: 'massage-therapy',
        name: 'Massage Therapy',
        description: 'Relaxing massage therapy in the comfort of your home',
        basePrice: 60,
        priceUnit: 'per hour',
        duration: 60,
        keywords: ['massage', 'spa', 'relaxation', 'therapy', 'wellness']
      },
      {
        id: 'grooming-all',
        name: 'Grooming Services',
        description: 'Complete grooming services including nails, facial, and more',
        basePrice: 45,
        priceUnit: 'per service',
        duration: 90,
        keywords: ['grooming', 'manicure', 'pedicure', 'facial', 'beauty']
      },
      {
        id: 'makeup-service',
        name: 'Makeup Services',
        description: 'Professional makeup for events and occasions',
        basePrice: 55,
        priceUnit: 'per service',
        duration: 60,
        keywords: ['makeup', 'cosmetics', 'beauty', 'makeover']
      }
    ]
  },
  {
    id: 'it-services',
    name: 'IT Services',
    icon: '💻',
    description: 'Technical support and IT services',
    services: [
      {
        id: 'device-setup',
        name: 'Device Setup',
        description: 'Setup and configuration of computers, phones, and smart devices',
        basePrice: 40,
        priceUnit: 'per device',
        duration: 60,
        keywords: ['device setup', 'computer setup', 'phone setup', 'installation']
      },
      {
        id: 'wifi-fix',
        name: 'WiFi & Network Fixes',
        description: 'Troubleshoot and fix WiFi and network connectivity issues',
        basePrice: 50,
        priceUnit: 'per visit',
        duration: 90,
        keywords: ['wifi', 'internet', 'network', 'router', 'connectivity']
      },
      {
        id: 'software-install',
        name: 'Software Installation',
        description: 'Install and configure software applications',
        basePrice: 30,
        priceUnit: 'per hour',
        duration: 60,
        keywords: ['software', 'installation', 'apps', 'programs', 'setup']
      },
      {
        id: 'tech-support',
        name: 'General Tech Support',
        description: 'General technical support and troubleshooting',
        basePrice: 45,
        priceUnit: 'per hour',
        duration: 60,
        keywords: ['tech support', 'IT support', 'computer repair', 'troubleshooting']
      }
    ]
  }
];

// Helper functions
export const getAllServices = () => {
  const allServices = [];
  serviceCategories.forEach(category => {
    category.services.forEach(service => {
      allServices.push({
        ...service,
        categoryId: category.id,
        categoryName: category.name
      });
    });
  });
  return allServices;
};

export const getServiceById = (serviceId) => {
  for (const category of serviceCategories) {
    const service = category.services.find(s => s.id === serviceId);
    if (service) {
      return {
        ...service,
        categoryId: category.id,
        categoryName: category.name
      };
    }
  }
  return null;
};

export const getCategoryById = (categoryId) => {
  return serviceCategories.find(cat => cat.id === categoryId);
};

export const searchServices = (query) => {
  const searchTerm = query.toLowerCase();
  const results = [];
  
  serviceCategories.forEach(category => {
    // Check if category matches
    if (category.name.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'category',
        data: category
      });
    }
    
    // Check services
    category.services.forEach(service => {
      if (
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.keywords.some(keyword => keyword.includes(searchTerm))
      ) {
        results.push({
          type: 'service',
          data: {
            ...service,
            categoryId: category.id,
            categoryName: category.name
          }
        });
      }
    });
  });
  
  return results;
}; 