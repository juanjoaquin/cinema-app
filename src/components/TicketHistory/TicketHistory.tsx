import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Ticket, Clock, AlertCircle, Loader2, DollarSign } from 'lucide-react';

interface HistorialProps {
    id: number;
    title: string;
    ticket_id: number;
    price: number;
    status: string;
    seats: {
        id: number;
        row: string;
        number: number;
        room_id: number;
    };
}

export const TicketHistory = () => {
    const [historial, setHistorial] = useState<HistorialProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [refundError, setRefundError] = useState<{ [key: number]: string | null }>({});


    
    const token = localStorage.getItem('token');
    useEffect(() => {
        const getHistorialByUser = async () => {
            if (!token) {
                setError('Please login to view your purchase tickets.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(import.meta.env.VITE_API_HISTORIAL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHistorial(response.data.historial);
                setTotalPrice(response.data.total_price);
            } catch (error) {
                setError('Error retrieving purchase tickets.');
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        getHistorialByUser();
    }, [token]);

    const handleRefund = async (ticket_id: number) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_REFUND}/${ticket_id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setHistorial((prevHistorial) =>
                prevHistorial.map((ticket) =>
                    ticket.ticket_id === ticket_id ? { ...ticket, status: 'canceled' } : ticket
                )
            );

            setRefundError((prev) => ({ ...prev, [ticket_id]: null }));
        } catch (error: any) {
            console.error('Error processing refund:', error);

            if (error.response && error.response.data.error === 'Refund is only available within 10 minutes of purchase.') {
                setRefundError((prev) => ({
                    ...prev,
                    [ticket_id]: 'You can only refund the ticket within 10 minutes of purchase.',
                }));
            } else {
                setRefundError((prev) => ({ ...prev, [ticket_id]: 'Refund failed. Please try again.' }));
            }
        }
    };



    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg">Loading your tickets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-lg text-red-400">{error}</p>
            </div>
        );
    }

    if (historial.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
                <Ticket className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg text-gray-400">No tickets found in your history</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 px-4 mt-4">
                <Ticket className="w-8 h-8 text-indigo-400" />
                <h1 className="text-3xl font-bold text-white">Purchase History</h1>
            </div>
            <div className="grid gap-4 mb-8 px-3">
                {historial.map((history) => (
                    <div key={history.id} className="bg-gray-800/50 rounded-xl p-6 border border-indigo-700/50 hover:border-indigo-500/50 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">{history.title}</h3>
                                <div className="flex items-center gap-2 text-gray-400 mb-4">
                                    <Clock className="w-4 h-4" />
                                    <span>Ticket #{history.ticket_id}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-green-600">${history.price.toFixed(2)}</span>
                                <span className={`px-3 py-1 rounded-full text-sm mt-2 ${history.status === 'paid' ? 'bg-indigo-500/20 text-indigo-400' : history.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{history.status.charAt(0).toUpperCase() + history.status.slice(1)}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                            <p className="text-gray-400 text-sm mb-2">Seat Information:</p>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-gray-700/50 rounded-lg text-white">Row {history.seats.row}</span>
                                <span className="px-3 py-1 bg-gray-700/50 rounded-lg text-white">Seat {history.seats.number}</span>
                                <span className="px-3 py-1 bg-gray-700/50 rounded-lg text-white">Room {history.seats.room_id}</span>
                            </div>
                        </div>
                        <div>

                            <button onClick={() => handleRefund(history.ticket_id)} disabled={history.status !== 'paid'} className={`mt-4 px-2 py-1 rounded-lg font-medium text-red-600 bg-red-800/10 transition-all ${history.status === 'paid' ? 'border border-red-600/60' : 'bg-gray-600 cursor-not-allowed'}`}>
                                {history.status === 'paid' ? 'Refund Ticket' : 'Refunded'}
                            </button>
                            <p className='mt-2 text-xs text-indigo-300'>Refund available within 10 minutes of purchase</p>

                            {refundError[history.ticket_id] && (
                                <p className="mt-2 text-xs text-red-500">{refundError[history.ticket_id]}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className='mt-4 mb-4'>
                <div className='m-3 border border-indigo-500 py-4 px-4 rounded-lg'>
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-gray-300" />
                        <div>
                            <p className="text-gray-400 text-sm">Total Amount Spent</p>
                            <p className="text-3xl font-bold text-indigo-400">${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
