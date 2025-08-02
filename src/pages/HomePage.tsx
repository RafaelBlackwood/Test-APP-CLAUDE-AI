import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { ROUTES } from '../constants';

const features = [
  {
    name: 'University Search',
    description: 'Discover universities that match your preferences and academic goals.',
    icon: MagnifyingGlassIcon,
    href: ROUTES.UNIVERSITIES,
  },
  {
    name: 'Application Management',
    description: 'Track and manage all your university applications in one place.',
    icon: ClipboardDocumentListIcon,
    href: ROUTES.APPLICATIONS,
  },
  {
    name: 'Program Explorer',
    description: 'Explore degree programs and find the perfect academic fit.',
    icon: AcademicCapIcon,
    href: ROUTES.PROGRAMS,
  },
  {
    name: 'Scholarship Finder',
    description: 'Find scholarships and financial aid opportunities.',
    icon: ChartBarIcon,
    href: ROUTES.SCHOLARSHIPS,
  },
];

const stats = [
  { name: 'Universities', value: '500+' },
  { name: 'Programs', value: '10,000+' },
  { name: 'Students Helped', value: '50,000+' },
  { name: 'Success Rate', value: '85%' },
];

export function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Journey to
            <span className="text-primary-600 block">Higher Education</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover universities, manage applications, and track your progress 
            all in one comprehensive platform designed for your success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="btn btn-primary btn-lg"
            >
              Get Started Free
            </Link>
            <Link
              to={ROUTES.UNIVERSITIES}
              className="btn btn-outline btn-lg"
            >
              Explore Universities
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for University Applications
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides all the tools and resources you need to 
            successfully navigate the university application process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.href}
              className="group relative p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {feature.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 rounded-2xl py-12 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Students Worldwide
          </h2>
          <p className="text-primary-100 text-lg">
            Join thousands of students who have successfully navigated their university journey with us.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-primary-100">
                {stat.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes university applications simple and stress-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              1. Discover
            </h3>
            <p className="text-gray-600">
              Search and filter universities based on your preferences, 
              location, programs, and budget.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
              <ClipboardDocumentListIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              2. Apply
            </h3>
            <p className="text-gray-600">
              Manage all your applications, documents, and deadlines 
              in one organized dashboard.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
              <CheckBadgeIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              3. Succeed
            </h3>
            <p className="text-gray-600">
              Track your progress, receive updates, and celebrate 
              your acceptance to your dream university.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students who are already using our platform 
            to achieve their higher education goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="btn btn-primary btn-lg"
            >
              Create Account
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="btn btn-outline btn-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}