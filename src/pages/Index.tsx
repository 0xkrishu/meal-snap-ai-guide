import React from "react";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Snap Your Meal. <br />
              <span className="text-green-600">Know What You Eat.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload a photo of your food and get instant AI-powered nutrition insights.
            </p>
            <Link 
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 border-t border-green-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-green-50 rounded-lg shadow-md border border-green-100">
              <div className="text-green-600 text-4xl mb-4">
                <Rocket />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-gray-600">Get nutrition insights in seconds with our AI-powered analysis.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-green-50 rounded-lg shadow-md border border-green-100">
              <div className="text-green-600 text-4xl mb-4">
                <Rocket />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Nutrition Data</h3>
              <p className="text-gray-600">Access comprehensive nutrition information, including calories, macros, and more.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-green-50 rounded-lg shadow-md border border-green-100">
              <div className="text-green-600 text-4xl mb-4">
                <Rocket />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Health Tips</h3>
              <p className="text-gray-600">Receive tailored recommendations to improve your diet and overall health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-green-100">
        <p>&copy; {new Date().getFullYear()} FoodLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
