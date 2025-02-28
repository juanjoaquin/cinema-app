import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { UpcomingsList } from './UpcomingsList';


 interface UpcomingsProps {
    id: number;
    name: string;
    description: string;
    path_image: string;
    genre: string;
}


export const UpcomingMovies = () => {

    const [upcomings, setUpcoming] = useState<UpcomingsProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUpcomings = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_UPCOMING_MOVIES);
                setUpcoming(response.data.upcomings);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getUpcomings();
    }, [])

    if (loading) return <div className='text-white font-bold text-2xl'>Loading...</div>

    return (
        <div>
            <h2 className="text-2xl text-center text-gray-300 font-semibold mt-4">Upcoming Movies</h2>
            <UpcomingsList upcomings={upcomings } />
            </div>
    )
}
