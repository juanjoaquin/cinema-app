import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export const Location = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Visit Our Cinema</h1>
          <p className="text-gray-400 text-lg">Experience movies in the heart of the city</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093743!2d144.9630577153178!3d-37.816279742014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577b5d5035d8223!2sCinema%20Example!5e0!3m2!1sen!2sus!4v1643114142839!5m2!1sen!2sus"
              className="w-full h-[400px] lg:h-[500px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          <div className="bg-gray-800 border border-indigo-700/60 rounded-xl p-8 shadow-2xl">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Location Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <MapPin className="text-red-500 w-6 h-6" />
                    <div>
                      <p className="text-white">332 Collins St</p>
                      <p className="text-gray-400">Melbourne, VIC 3000</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Clock className="text-blue-500 w-6 h-6" />
                    <div>
                      <p className="text-white">Opening Hours</p>
                      <p className="text-gray-400">10:00 AM - 11:00 PM Daily</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Phone className="text-green-500 w-6 h-6" />
                    <div>
                      <p className="text-white">Contact</p>
                      <p className="text-gray-400">+61 3 3241 7323</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Mail className="text-indigo-500 w-6 h-6" />
                    <div>
                      <p className="text-white">Email</p>
                      <p className="text-gray-400">cinema@cinema.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Getting Here</h3>
                <div className="space-y-2 text-gray-400">
                  <p>🚇 5 minutes walk from Central Station</p>
                  <p>🚌 Bus stops on Movie Street & Cinema Avenue</p>
                  <p>🚗 Parking available in the basement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;