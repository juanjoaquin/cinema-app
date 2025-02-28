import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Film,   PlayCircle,  ArrowLeft, Info } from 'lucide-react';
import axios from 'axios';

interface MovieDetailProps {
    id: number;
    name: string;
    description: string;
    path_image: string;
    genre: string;
}

export const UpcomingDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetailProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/upcoming-movie/${id}`);
                setMovie(response.data);
            } catch (err) {
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-indigo-500/20 rounded-full mb-4"></div>
                    <div className="text-indigo-500 text-xl font-medium">Loading movie details...</div>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
                <Info className="text-red-500 w-16 h-16 mb-4" />
                <div className="text-red-500 text-2xl font-semibold mb-4 text-center">
                    {error || "Movie not found"}
                </div>
                <Link 
                    to="/"
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full transition-colors duration-300"
                >
                    <ArrowLeft size={20} />
                    Back to Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-900">
            <div className="absolute top-6 left-6 z-10">
                <Link 
                    to="/"
                    className="flex items-center gap-2 bg-gray-900/80 text-white px-4 py-2 rounded-full hover:bg-indigo-500 transition-all duration-300 backdrop-blur-sm"
                >
                    <ArrowLeft size={20} />
                    Back to Movies
                </Link>
            </div>

            <div className="relative h-[75vh] w-full overflow-hidden">
                <img
                    src={movie.path_image}
                    alt={movie.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 items-end">
                            
                            <div className="flex-1 space-y-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="px-4 py-1.5 bg-indigo-500 text-white text-sm rounded-full flex items-center gap-2 font-medium">
                                        <Film size={16} />
                                        {movie.genre}
                                    </span>
                                    <span className="px-4 py-1.5 bg-gray-800 text-indigo-400 text-sm rounded-full flex items-center gap-2">
                                        <Clock size={16} />
                                        Coming Soon
                                    </span>
                                </div>
                                
                                <h1 className="text-5xl font-bold text-white tracking-tight">{movie.name}</h1>
                                
                                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                                    {movie.description}
                                </p>
                                

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Additional Details */}
            <div className="container mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Film className="text-indigo-500" />
                            Movie Details
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                <span className="text-gray-400">Genre</span>
                                <span className="text-white font-medium">{movie.genre}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                <span className="text-gray-400">Release Status</span>
                                <span className="text-indigo-400 font-medium">Coming Soon</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-gray-400">ID</span>
                                <span className="text-white font-medium">#{movie.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar className="text-indigo-500" />
                            Release Information
                        </h2>
                        <div className="flex items-center justify-center h-[calc(100%-4rem)]">
                            <div className="text-center">
                                <Clock className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                                <p className="text-gray-300">Release date will be announced soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};