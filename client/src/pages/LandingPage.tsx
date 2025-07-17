
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Shield, 
  CreditCard, 
  Clock, 
  Home,
  Wrench,
  Scissors,
  Zap,
  ArrowRight
} from 'lucide-react'

const services = [
  { name: 'Cleaning', icon: Home, price: '€30+' },
  { name: 'Beauty', icon: Scissors, price: '€25+' },
  { name: 'Repairs', icon: Wrench, price: '€50+' },
  { name: 'Plumbing', icon: Zap, price: '€40+' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 parallax-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 fade-in">
              Home Services Made{' '}
              <span className="gradient-text">Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed fade-in-delay">
              Book trusted professionals for all your home needs in Ireland. 
              Clean, reliable, and easy to use.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-16 fade-in-delay-2">
              <div className="flex flex-col sm:flex-row gap-3 p-1 bg-background rounded-xl shadow-sm border hover-lift">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="What do you need help with?"
                    className="pl-10 border-0 focus:ring-0 bg-transparent"
                  />
                </div>
                <Button size="lg" className="px-8 shrink-0 smooth-button">
                  Find Services
                </Button>
              </div>
            </div>

            {/* Popular Services */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-20 fade-in-delay-3">
              {services.map((service, index) => (
                <Card key={service.name} className="hover-lift transition-all duration-300 cursor-pointer border-0 bg-muted/30 scale-in" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <service.icon className="h-8 w-8 text-primary mx-auto mb-3 floating" style={{ animationDelay: `${index * 0.5}s` }} />
                    <h3 className="font-medium text-sm mb-1">{service.name}</h3>
                    <p className="text-xs text-muted-foreground">{service.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-delay-3">
              <Button size="lg" className="px-8 smooth-button hover-lift" asChild>
                <Link to="/services">
                  Browse All Services
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 smooth-button hover-lift" asChild>
                <Link to="/register">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Features */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center fade-in slide-in-left">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vetted Professionals</h3>
              <p className="text-muted-foreground text-sm">
                All service providers are verified and background checked
              </p>
            </div>

            <div className="text-center fade-in-delay">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground text-sm">
                See upfront pricing with no hidden fees
              </p>
            </div>

            <div className="text-center fade-in slide-in-right">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground text-sm">
                30-day warranty on all services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple, fast, and reliable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center fade-in-delay">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-semibold hover-lift floating">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Book</h3>
              <p className="text-muted-foreground text-sm">
                Choose your service and schedule
              </p>
            </div>

            <div className="text-center fade-in-delay-2">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-semibold hover-lift floating" style={{ animationDelay: '0.5s' }}>
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Relax</h3>
              <p className="text-muted-foreground text-sm">
                Professional arrives on time
              </p>
            </div>

            <div className="text-center fade-in-delay-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-semibold hover-lift floating" style={{ animationDelay: '1s' }}>
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Enjoy</h3>
              <p className="text-muted-foreground text-sm">
                Pay securely after completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 fade-in-delay">
            Join thousands of satisfied customers across Ireland
          </p>
          <div className="fade-in-delay-2">
            <Button size="lg" className="px-8 smooth-button hover-lift" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 