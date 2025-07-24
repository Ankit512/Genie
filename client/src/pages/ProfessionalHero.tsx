import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Euro, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Smartphone,
  Home,
  Heart
} from 'lucide-react';

const ProfessionalHero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">Genie</h1>
      </div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Sparkles className="h-3 w-3 mr-1" />
            Join Ireland's Growing Service Network
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Be the Genie
            <span className="text-blue-600 block">Grant Wishes, Earn More</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Turn your expertise into reputable services that create magic moments for customers across Ireland. 
            Every service you provide grants someone's wish while building your income.
          </p>
          
          <p className="text-md text-gray-700 mb-6">
            New here? <span className="font-semibold">Create an account.</span> Already registered? <span className="font-semibold">Sign in.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link to="/professional/application">
                Start Earning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
              <Link to="/professional/login">
                Already a Professional? Sign In
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">€2,500+</div>
              <div className="text-gray-600">Average Monthly Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Professional Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Services in High Demand
          </h2>
          <p className="text-lg text-gray-600">
            Join our network and start providing these popular services across Ireland
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cleaning & Pest Control */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  Cleaning & Pest Control
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Full home cleaning (1-2 rooms)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Bathroom/kitchen deep clean
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Insta Help (quick hourly tasks)
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                Avg. €25-45/hour
              </div>
            </CardContent>
          </Card>

          {/* Beauty & Wellness */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  Beauty & Wellness
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Haircut/grooming
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Massage (basic/full body)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Facial/manicure
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                Avg. €35-65/hour
              </div>
            </CardContent>
          </Card>

          {/* IT Services */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  IT Services
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Device setup/troubleshooting
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  WiFi/network fixes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Software installs/updates
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                Avg. €40-70/hour
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Genie?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to succeed as a professional service provider
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">Work when you want, where you want</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Euro className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Payments</h3>
              <p className="text-gray-600">Get paid within 24 hours of job completion</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Growing Customer Base</h3>
              <p className="text-gray-600">Access to thousands of customers across Ireland</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Setup</h3>
              <p className="text-gray-600">Get approved and start earning in under 48 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Professional Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Ireland's most trusted service platform and start earning today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link to="/professional/application">
                Sign Up as Professional
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/professional/login">
                Already have an account?
              </Link>
            </Button>
          </div>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Are you a customer?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHero;
