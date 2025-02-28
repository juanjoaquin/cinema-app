import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface MoviesProps {
    id: number;
    title: string;
    image_path: string;
}

interface HomeListProps {
    movies: MoviesProps[];
    upcomings: UpcomingsProps[];
}

interface UpcomingsProps {
    id: number;
    name: string;
    path_image: string;
}

export const HomeList: React.FC<HomeListProps> = ({ movies, upcomings }) => {
    const navigate = useNavigate();

    const handleSelectMovie = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMovieId = e.target.value;
        if (selectedMovieId) {
            navigate(`/movie/${encodeURIComponent(selectedMovieId)}`);
        }
    };

    return (
        <div>


            <div className="px-4 mt-4 lg:max-w-7xl lg:mx-auto">
                <h2 className="text-4xl font-bold mb-2 text-white">Movies at Cinema</h2>
                <p className="text-gray-400 mb-4">Latest releases and popular titles</p>
            </div>

            <div className="px-4 py-2 mb-4 lg:max-w-7xl lg:mx-auto">
                <label className="text-gray-200 text-lg font-semibold mb-2 block">Select a Movie</label>
                <p className="text-gray-400 mb-4">Find your movie</p>

                <select
                    className=" border border-indigo-700 bg-gray-800/80  text-white p-2 rounded-md w-full md:w-1/3"
                    onChange={handleSelectMovie}
                    defaultValue=""
                >
                    <option value="" disabled>Select a movie...</option>
                    {movies.map((movie) => (
                        <option key={movie.id} value={movie.title}>
                            {movie.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4 px-4  md:sm:grid-cols-3 lg:grid-cols-4 lg:max-w-7xl lg:mx-auto ">
                {movies.map((movie) => (
                    <div key={movie.id} className=" border border-indigo-700/60 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
                        <Link to={`/movie/${encodeURIComponent(movie.title)}`}>
                            <img src={movie.image_path} alt={movie.title} className="w-full h-72 object-cover" />
                            <h3 className="text-gray-300 text-center font-semibold p-3">{movie.title}</h3>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="px-4 py-2 lg:max-w-7xl lg:mx-auto mt-4">
                <h2 className="text-3xl font-bold mb-2 text-white ">Coming soon</h2>
                <p className="text-gray-400 mb-4">Upcoming new titles</p>
            </div>

            <div className="grid grid-cols-2 gap-4 px-4  md:sm:grid-cols-3 lg:grid-cols-4 lg:max-w-7xl lg:mx-auto">
                {upcomings.map((upcoming) => (
                    <div key={upcoming.id} className="bg-transparent border border-indigo-700/60 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 mb-4">
                        <Link to={`/movies/upcoming-movies`}>
                            <img src={upcoming.path_image} alt={upcoming.name} className="w-full h-72 object-cover" />
                            <h3 className="text-gray-300 text-center font-semibold p-3">{upcoming.name}</h3>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeList;
