import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HomeList } from './HomeList';

interface MoviesProps {
    id: number;
    title: string;
    image_path: string;
}

interface UpcomingsProps {
    id: number;
    name: string;
    path_image: string;
}

export const HomeContainer: React.FC = () => {
    const [movies, setMovies] = useState<MoviesProps[]>([]);
    const [load, setLoad] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [upcomings, setUpcomings] = useState<UpcomingsProps[]>([])

    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_MOVIES);
                setMovies(response.data);
            } catch (error) {
                setError('Error al obtener las películas');
            } finally {
                setLoad(false);
            }
        };

        const getUpcomings = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_UPCOMING_MOVIES);
                setUpcomings(response.data.upcomings);
            } catch (error) {
                console.log(error)
            } 
        }
        getUpcomings();
        getMovies();
    }, []);

    if (load) return <p className="font-bold text-whtie text-2xl">Loading...</p>;
    if (error) return <p className="text-red-500 text-center items-center mt-4 font-bold">{error}</p>;

    return <HomeList movies={movies} upcomings={upcomings} />;
};