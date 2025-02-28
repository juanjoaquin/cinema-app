import axios from 'axios';
import { ChevronDown, CircleUser, Star, Clock, Calendar, Film, LucideCircleDollarSign } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface MovieDetailProp {
    id: number;
    title: string;
    description: string;
    price: number;
    duration: number;
    genre: string;
    rating: number;
    release_date: string;
    image_path: string;
    format: string;
}

export const MovieDetail = () => {
    const [movieById, setMovieById] = useState<MovieDetailProp | null>(null);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [showSchedules, setShowSchedules] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(1);

    const { title } = useParams();
    const decodedTitle = title ? decodeURIComponent(title) : "";
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        const getMovieById = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_MOVIE_ID}/${decodedTitle}`);
                setMovieById(response.data.movie);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/comments/movie/${decodedTitle}`);
                setComments(response.data.comments);
            } catch (error) {
                console.log('Error getting comments', error);
            }
        };

        getMovieById();
        fetchComments();
    }, [decodedTitle]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to post a comment.");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/comments/movie/${decodedTitle}`, {
                rating: newRating,
                comment: newComment,
            } , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewComment("");
            setNewRating(1);
        } catch (error) {
            console.log(error);
        }
    }

    const handleBuyTicketClick = async () => {
        if (movieById) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/schedules/movie/${movieById.id}`);
                setSchedules(response.data);
                setShowSchedules(true);
            } catch (error) {
                console.error('Error fetching schedules', error);
            }
        }
    };

    const handleScheduleSelect = (schedule_id: number) => {
        navigate(`/schedule/${schedule_id}/details`);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <div className="bg-gray-900 min-h-screen py-8">
            {movieById && (
                <div className="container mx-auto px-4">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-4">
                            <div className="relative rounded-lg overflow-hidden shadow-xl">
                                <img
                                    src={movieById.image_path}
                                    alt={movieById.title}
                                    className="w-full h-[500px] object-cover"
                                />
                            </div>
                            
                            <div className="mt-6 bg-gray-800 rounded-lg p-4 space-y-3">
                                <div className="flex items-center text-gray-300">
                                    <Clock className="w-5 h-5 mr-2 text-indigo-400" />
                                    <span>{movieById.duration} minutes</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Calendar className="w-5 h-5 mr-2 text-indigo-400" />
                                    <span>{new Date(movieById.release_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Film className="w-5 h-5 mr-2 text-indigo-400" />
                                    <span>{movieById.format}</span>
                                </div>

                                <div className="flex items-center text-gray-300">
                                    <LucideCircleDollarSign className="w-5 h-5 mr-2 text-green-700/90" />
                                    <span>${movieById.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 mt-6 lg:mt-0">
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h1 className="text-4xl text-white font-bold mb-4">{movieById.title}</h1>
                                
                                <div className="flex items-center mb-6">
                                    <span className="text-yellow-500 font-semibold flex items-center">
                                        <Star className="fill-yellow-500 mr-1" size={20} />
                                        {movieById.rating}
                                    </span>
                                    <span className="mx-3 text-gray-500">|</span>
                                    <span className="text-indigo-400">{movieById.genre}</span>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl text-gray-300 font-medium mb-3">Description</h3>
                                    <p className="text-gray-400 leading-relaxed">{movieById.description}</p>
                                </div>

                                <button
                                    onClick={handleBuyTicketClick}
                                    className="w-full cursor-pointer py-3 rounded-lg bg-indigo-600 text-white font-semibold uppercase hover:bg-indigo-700 transition duration-300"
                                >
                                    Buy Ticket 
                                </button>

                                {showSchedules && (
                                    <div className="mt-6">
                                        <h3 className="text-xl text-white font-medium mb-4">Available Schedules</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {schedules.length > 0 ? (
                                                schedules.map((schedule) => (
                                                    <button
                                                        key={schedule.id}
                                                        onClick={() => handleScheduleSelect(schedule.id)}
                                                        className="bg-gray-700 text-white rounded-lg p-3 hover:bg-gray-600 transition duration-300"
                                                    >
                                                        <div className="text-sm text-gray-300">{new Date(schedule.show_time).toLocaleDateString()}</div>
                                                        <div className="text-lg font-semibold">{schedule.start_time}</div>
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 col-span-full">No schedules available</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 bg-gray-800 rounded-lg p-6">
                                <button
                                    onClick={toggleComments}
                                    className=" cursor-pointer flex items-center justify-between w-full text-xl text-gray-300 font-medium hover:text-indigo-400 transition duration-300"
                                >
                                    <span className='cursor-pointer'>Viewer Comments</span>
                                    <ChevronDown className={`transform transition-transform text-indigo-500 duration-300 cursor-pointer ${showComments ? 'rotate-180' : ''}`} size={24} />
                                </button>

                                {showComments && (
                                    <div className="mt-6 space-y-4">
                                        {comments.length > 0 ? (
                                            comments.map((comment: any) => (
                                                <div key={comment.id} className="border border-gray-700 rounded-lg p-4 hover:border-indigo-500 transition duration-300">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <CircleUser className="text-indigo-400" size={24} />
                                                            <span className="text-indigo-300">{comment.user.name}</span>
                                                            <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center text-yellow-500">
                                                            <span className="font-semibold mr-1">{comment.rating}</span>
                                                            <Star className="fill-yellow-500" size={16} />
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300">{comment.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No comments yet. Be the first to leave one!</p>
                                        )}

                                        {isLoggedIn ? (
                                            <form onSubmit={handleCommentSubmit} className="mt-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <select
                                                        value={newRating}
                                                        onChange={(e) => setNewRating(Number(e.target.value))}
                                                        className="bg-yellow-600 text-white rounded-md px-3 py-2 cursor-pointer"
                                                    >
                                                        {[1, 2, 3, 4, 5].map(num => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={star <= newRating ? 'fill-yellow-500' : 'text-gray-500'}
                                                                size={24}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Share your thoughts about the movie..."
                                                    className="w-full bg-gray-700 text-white rounded-lg p-4 mb-4"
                                                    rows={4}
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-indigo-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                                                >
                                                    Post Comment
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="mt-6 text-center">
                                                <p className="text-gray-400">
                                                    Please <Link to="/auth/login" className="text-indigo-400 hover:underline">log in</Link> or
                                                    <Link to="/auth/register" className="text-indigo-400 hover:underline">create an account</Link> to leave a comment.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail