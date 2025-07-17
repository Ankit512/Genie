import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import type { Service, ServiceFormData, ServiceCategory } from '../../types/service';

interface ServiceFormProps {
  initialData?: Service;
  onSubmit?: (service: Service) => void;
}

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'cleaning',
  'plumbing',
  'electrical',
  'landscaping',
  'painting',
  'carpentry',
  'appliance_repair',
  'hvac',
  'pest_control',
  'moving',
  'other',
];

export function ServiceForm({ initialData, onSubmit: _onSubmit }: ServiceFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<ServiceFormData>(
    initialData || {
      title: '',
      description: '',
      category: 'other',
      price: {
        amount: 0,
        unit: 'hour',
      },
      availability: {
        days: [],
        startTime: '09:00',
        endTime: '17:00',
      },
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      images: [],
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: name === 'amount' ? Number(value) : value,
      },
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          days: checked
            ? [...prev.availability.days, name]
            : prev.availability.days.filter((day) => day !== name),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          [name]: value,
        },
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = imageFiles.map(async (file) => {
      const storageRef = ref(storage, `services/${user?.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      // Upload images if any
      const uploadedImageUrls = await uploadImages();
      const serviceData = {
        ...formData,
        images: [...formData.images, ...uploadedImageUrls],
      };

      if (initialData?.id) {
        // Update existing service
        await updateDoc(doc(db, 'services', initialData.id), {
          ...serviceData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new service
        await addDoc(collection(db, 'services'), {
          ...serviceData,
          providerId: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      navigate('/provider/services');
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-700 mb-2" htmlFor="title">
          Service Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {SERVICE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="price.amount">
            Price
          </label>
          <input
            id="price.amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.price.amount}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="price.unit">
            Per
          </label>
          <select
            id="price.unit"
            name="unit"
            value={formData.price.unit}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="hour">Hour</option>
            <option value="job">Job</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Availability</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={day}
                checked={formData.availability.days.includes(day)}
                onChange={handleAvailabilityChange}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="capitalize">{day}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="startTime">
              Start Time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.availability.startTime}
              onChange={handleAvailabilityChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="endTime">
              End Time
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.availability.endTime}
              onChange={handleAvailabilityChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-gray-700">Location</label>
        <input
          name="address"
          type="text"
          placeholder="Street Address"
          value={formData.location.address}
          onChange={handleLocationChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <input
            name="city"
            type="text"
            placeholder="City"
            value={formData.location.city}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="state"
            type="text"
            placeholder="State"
            value={formData.location.state}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="zipCode"
            type="text"
            placeholder="ZIP Code"
            value={formData.location.zipCode}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">
          Service Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/provider/services')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
} 