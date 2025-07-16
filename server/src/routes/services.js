import express from 'express';
import { serviceCategories, getAllServices, getServiceById, getCategoryById, searchServices } from '../models/services.js';

const router = express.Router();

// Get all service categories
router.get('/categories', (req, res) => {
  res.json({
    categories: serviceCategories,
    total: serviceCategories.length
  });
});

// Get specific category with services
router.get('/categories/:categoryId', (req, res) => {
  const category = getCategoryById(req.params.categoryId);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json(category);
});

// Get all services (flattened)
router.get('/all', (req, res) => {
  const services = getAllServices();
  res.json({
    services,
    total: services.length
  });
});

// Get specific service
router.get('/service/:serviceId', (req, res) => {
  const service = getServiceById(req.params.serviceId);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  res.json(service);
});

// Search services
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }
  
  const results = searchServices(query);
  
  res.json({
    query,
    results,
    total: results.length
  });
});

// Calculate service price
router.post('/calculate-price', (req, res) => {
  const { serviceId, duration, urgent, weekend } = req.body;
  
  const service = getServiceById(serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  let price = service.basePrice;
  
  // Apply modifiers
  if (urgent) price *= 1.5;
  if (weekend) price *= 1.2;
  
  // If service is per hour and duration is provided
  if (service.priceUnit === 'per hour' && duration) {
    price = price * (duration / 60); // duration in minutes
  }
  
  res.json({
    serviceId,
    serviceName: service.name,
    basePrice: service.basePrice,
    calculatedPrice: Math.round(price),
    priceUnit: service.priceUnit,
    modifiers: {
      urgent,
      weekend
    }
  });
});

export default router; 