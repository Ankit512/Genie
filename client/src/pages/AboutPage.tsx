import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  CheckCircle, 
  Star,
  MapPin,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react'

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/api/placeholder/150/150",
    bio: "Former tech executive with 15+ years in marketplace platforms. Passionate about connecting people with quality services."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/api/placeholder/150/150",
    bio: "Full-stack developer and system architect. Previously at Google and Uber, specializing in scalable marketplace solutions."
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Operations",
    image: "/api/placeholder/150/150",
    bio: "Operations expert with background in service logistics. Ensures smooth experiences for both customers and providers."
  },
  {
    name: "David Kim",
    role: "Head of Design",
    image: "/api/placeholder/150/150",
    bio: "UX/UI designer focused on creating intuitive, accessible experiences. Previously at Airbnb and Spotify."
  }
]

const values = [
  {
    icon: Heart,
    title: "Quality First",
    description: "We rigorously vet all service providers to ensure you receive exceptional quality every time."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Building a trusted community where customers and providers can connect with confidence."
  },
  {
    icon: Award,
    title: "Innovation",
    description: "Constantly improving our platform with the latest technology to make booking services effortless."
  },
  {
    icon: CheckCircle,
    title: "Reliability",
    description: "Dependable service delivery with transparent pricing and guaranteed satisfaction."
  }
]

const stats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "2K+", label: "Verified Providers" },
  { number: "100K+", label: "Services Completed" },
  { number: "4.9", label: "Average Rating" }
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">Genie</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're on a mission to make quality home services accessible to everyone. 
              Connect with trusted professionals in your area with just a few clicks.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Genie, we believe everyone deserves access to quality home services. 
                Our platform connects customers with verified, skilled professionals who 
                are passionate about their craft.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We're building more than just a marketplace – we're creating a community 
                where trust, quality, and convenience come together to transform how 
                people access home services.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span>Transparent Pricing</span>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <Card className="p-8 bg-primary/5 border-primary/10">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
                      <p className="text-sm text-muted-foreground">
                        To be the most trusted home services platform globally
                      </p>
                    </div>
                    <div className="text-center">
                      <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Our Promise</h3>
                      <p className="text-sm text-muted-foreground">
                        Exceptional service experiences, every time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and help us build a platform 
              that truly serves our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're a diverse group of professionals passionate about connecting 
              people with quality services and building technology that makes life easier.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Genie for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/services">
                Browse Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">
                Sign Up Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 