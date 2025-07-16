import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleMaps from "../components/GoogleMaps";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="rounded-2xl bg-white p-8 shadow-lg">
    <div className="mb-4 text-5xl text-primary-500">{icon}</div>
    <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface HowItWorksStepProps {
  icon: string;
  step: number;
  title: string;
  description: string;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ icon, step, title, description }) => (
  <div className="text-center">
    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-500 text-4xl text-white">
      {icon}
    </div>
    <p className="mb-2 font-bold text-primary-500">Step {step}</p>
    <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ServiceSearch = () => {
  const [location, setLocation] = useState("Dublin");
  const [service, setService] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/services?location=${location}&service=${service}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mt-8 flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-2xl md:flex-row"
    >
      <input
        type="text"
        value={service}
        onChange={(e) => setService(e.target.value)}
        placeholder="What service do you need?"
        className="w-full flex-grow rounded-lg border border-gray-300 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required
      />
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full rounded-lg border border-gray-300 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 md:w-auto"
      >
        <option value="Dublin">Dublin</option>
        <option value="City Centre">City Centre</option>
        <option value="Temple Bar">Temple Bar</option>
        <option value="Rathmines">Rathmines</option>
        <option value="Dundrum">Dundrum</option>
      </select>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-primary-600 md:w-auto"
      >
        Search
      </button>
    </form>
  );
};

export function LandingPage() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Quality Home Services in Dublin
            </h1>
            <p className="mb-8 text-lg md:text-xl">
              Book trusted professionals for all your home needs
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Link
                to="/register"
                className="rounded-lg bg-white text-primary-500 px-6 py-3 font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="rounded-lg border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-primary-500 transition-colors"
              >
                Login
              </Link>
            </div>
            <ServiceSearch />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Why Choose Genie?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon="✓"
              title="Vetted Professionals"
              description="All our service providers are background-checked and verified"
            />
            <FeatureCard
              icon="💰"
              title="Transparent Pricing"
              description="See prices upfront before booking any service"
            />
            <FeatureCard
              icon="⭐"
              title="Quality Guarantee"
              description="100% satisfaction guarantee on all services"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <HowItWorksStep
              icon="🔍"
              step={1}
              title="Search & Select"
              description="Choose from our wide range of home services"
            />
            <HowItWorksStep
              icon="📅"
              step={2}
              title="Book & Schedule"
              description="Pick a convenient time that works for you"
            />
            <HowItWorksStep
              icon="✨"
              step={3}
              title="Relax & Enjoy"
              description="Our professionals will take care of everything"
            />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Find Services Near You
          </h2>
          <GoogleMaps />
        </div>
      </section>
    </div>
  );
} 