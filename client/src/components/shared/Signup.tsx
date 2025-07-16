import React, { useState } from 'react';
import api from '../../api/config';

const PROVIDER_SERVICES = [
  { id: 'cleaning-pest', label: 'Cleaning & Pest Control' },
  { id: 'beauty-wellness', label: 'Beauty & Wellness' },
  { id: 'it-services', label: 'IT Services' },
];

export default function Signup() {
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    consentedGDPR: false,
    vettingAgreement: false,
    bio: '',
    services: [] as string[],
    certificates: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Google Maps Autocomplete (dummy for now)
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, address: e.target.value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleServiceChange = (id: string) => {
    setForm((prev) => {
      const services = prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id];
      return { ...prev, services };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, certificates: Array.from(e.target.files) });
    }
  };

  const validate = () => {
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) return 'Valid email required';
    if (!form.password || form.password.length < 6) return 'Password min 6 chars';
    if (!form.name) return 'Name required';
    if (!form.phone) return 'Phone required';
    if (!form.address) return 'Address required';
    if (!form.consentedGDPR) return 'GDPR consent required';
    if (role === 'provider') {
      if (!form.services.length) return 'Select at least one service';
      if (!form.vettingAgreement) return 'Vetting agreement required';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (
      !form.email ||
      !form.password ||
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.consentedGDPR
    ) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      let res;
      if (role === 'customer') {
        res = await api.post('/api/auth/register/customer', {
          email: form.email,
          password: form.password,
          name: form.name,
          phone: form.phone,
          address: form.address,
          consentedGDPR: form.consentedGDPR,
        });
      } else {
        const data = new FormData();
        data.append('email', form.email);
        data.append('password', form.password);
        data.append('name', form.name);
        data.append('phone', form.phone);
        data.append('address', form.address);
        data.append('bio', form.bio);
        data.append('consentedGDPR', form.consentedGDPR ? 'true' : '');
        data.append('vettingAgreement', form.vettingAgreement ? 'true' : '');
        data.append('services', JSON.stringify(form.services));
        for (const file of form.certificates) {
          data.append('certificates', file);
        }
        res = await api.post('/api/auth/register/provider', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setSuccess('Registration successful! Please check your email.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-6 mb-4">
          <label>
            <input
              type="radio"
              name="role"
              value="customer"
              checked={role === 'customer'}
              onChange={() => setRole('customer')}
            />{' '}
            Customer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="provider"
              checked={role === 'provider'}
              onChange={() => setRole('provider')}
            />{' '}
            Provider
          </label>
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full border p-3 rounded"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address (with Maps autocomplete)"
          className="w-full border p-3 rounded"
          value={form.address}
          onChange={handleAddressChange}
          required
        />
        {role === 'provider' && (
          <>
            <div>
              <label className="block font-medium mb-1">Services you offer:</label>
              <div className="flex flex-wrap gap-3">
                {PROVIDER_SERVICES.map((s) => (
                  <label key={s.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={form.services.includes(s.id)}
                      onChange={() => handleServiceChange(s.id)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Upload Certificates (PDF/JPG/PNG):</label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>
            <textarea
              name="bio"
              placeholder="Short bio (optional)"
              className="w-full border p-3 rounded"
              value={form.bio}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="vettingAgreement"
                checked={form.vettingAgreement}
                onChange={handleChange}
              />
              I agree to the vetting process and terms
            </label>
          </>
        )}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="consentedGDPR"
            checked={form.consentedGDPR}
            onChange={handleChange}
          />
          I consent to the use of my data as per GDPR
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
} 