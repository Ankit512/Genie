import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import type { Service } from '../../types/service';

export function ServiceList() {
  const { user } = useAuthContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'services'),
      where('providerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const serviceList: Service[] = [];
        snapshot.forEach((doc) => {
          serviceList.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(serviceList);
        setLoading(false);
      },
      (err) => {
        setError('Failed to load services');
        setLoading(false);
        console.error('Error loading services:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Services</h2>
        <Link
          to="/provider/services/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You haven't added any services yet.</p>
          <Link
            to="/provider/services/new"
            className="mt-4 inline-block text-blue-500 hover:text-blue-600"
          >
            Add your first service
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {service.images[0] && (
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">
                    ${service.price.amount}/{service.price.unit}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                    {service.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/provider/services/${service.id}/edit`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </Link>
                  {deleteConfirm === service.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-gray-500 hover:text-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(service.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 