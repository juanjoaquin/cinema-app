import React from 'react';
import { Calendar, Clock, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingsProps {
    id: number;
    name: string;
    description: string;
    path_image: string;
    genre: string;
}

interface UpcomingsListProps {
    upcomings: UpcomingsProps[];
}

export const UpcomingsList: React.FC<UpcomingsListProps> = ({ upcomings }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {upcomings.map((movie, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                    >
                        <div className="relative">
                            <img
                                src={movie.path_image}
                                alt={movie.name}
                                className="w-full h-72 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 p-4">
                                <div className="flex items-center space-x-2">
                                    <Film size={16} className="text-gray-400" />
                                    <span className="text-sm font-medium text-gray-300">{movie.genre}</span>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <div className="flex items-center bg-gray-900/80 rounded-full px-3 py-1">
                                    <Clock size={14} className="text-indigo-400 mr-1" />
                                    <span className="text-xs font-medium text-indigo-400">Coming Soon</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{movie.name}</h3>
                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">{movie.description}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-indigo-400">
                                    <Calendar size={16} className="mr-1" />
                                    <span className="text-xs">2025</span>
                                </div>
                                <Link to={`/upcoming-movie/${movie.id}`}>
                                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer">
                                        Learn More
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};