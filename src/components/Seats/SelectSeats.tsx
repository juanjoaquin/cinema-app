import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Armchair, ArrowRightCircleIcon, Info } from "lucide-react";

interface Seat {
  id: number;
  number: number;
  row: string;
  status: boolean;
}

export const SelectSeats = () => {
  const { schedule_id } = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/schedule/${schedule_id}/details`
        );
        setSeats(response.data.seats);
      } catch (error) {
        console.log(error);
      }
    };
    fetchScheduleDetails();
  }, [schedule_id]);

  const toggleSeatSelection = (seat_id: number) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat_id)
        ? prevSelectedSeats.filter((id) => id !== seat_id)
        : [...prevSelectedSeats, seat_id]
    );
  };

  const handleReserveSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Debes seleccionar al menos un asiento.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No estás autenticado. Inicia sesión.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ticket`,
        {
          schedule_id: schedule_id,
          seat_id: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );
  
      const reservedTickets = response.data.tickets.map((t: any) => t.id);
  
      alert("Reserva exitosa");
  
      setTimeout(() => {
        navigate("/payment", { state: { selectedTickets: reservedTickets } });
      }, 1000);
    } catch (error) {
      console.error("Error al reservar los asientos:", error);
      alert("Error al reservar los asientos.");
    }
  };



  return (
    <div className="bg-gray-900 text-white p-8 lg:max-w-7xl lg:mx-auto lg:flex lg:gap-8">
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4 text-center">Select your seats</h2>
        <p className="text-center text-sm text-gray-400 mb-4">
          Choose your best seat from the seating layout below.
        </p>
  
        <div className="flex flex-col items-center">
          <div className="w-full">
            <div className="h-2 bg-indigo-500 rounded-lg mb-3 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            <p className="text-center text-sm text-gray-400 uppercase">Screen</p>
          </div>
  
          <div className="grid grid-cols-4 mt-6 gap-4">
            {seats.map((seat) => (
              <div key={seat.id} className="relative flex justify-center items-center">
                <Armchair
                  className={`w-10 h-10 cursor-pointer transition-colors duration-200 ${
                    !seat.status
                      ? "text-red-900 cursor-not-allowed"
                      : selectedSeats.includes(seat.id)
                      ? "text-green-600"
                      : "text-gray-400 hover:text-green-500"
                  }`}
                  onClick={() => seat.status && toggleSeatSelection(seat.id)}
                />
                <span className="absolute mt-12 text-xs">{seat.number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
  
      <div className="lg:w-1/3">
        <div className="flex flex-col flex-wrap gap-4 mt-10 bg-gray-600/20 px-4 py-4 rounded-lg">
          <div>
            <h3 className="mb-2 text-lg font-medium text-gray-300">Select seats</h3>
            {selectedSeats.length > 0 ? (
              selectedSeats.map((seatId) => {
                const seat = seats.find((s) => s.id === seatId);
                return (
                  <div key={seatId} className="flex items-center justify-between mt-2 bg-gray-700 rounded px-3 py-2">
                    <span>Seat {seat?.row}{seat?.number}</span>
                    <button
                      onClick={() => toggleSeatSelection(seatId)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No seats selected</p>
            )}
          </div>
  
          {/* Estado de los asientos */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded-t-lg flex items-center justify-center">
              <Armchair className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-sm text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-900/50 rounded-t-lg flex items-center justify-center">
              <Armchair className="w-5 h-5 text-green-300" />
            </div>
            <span className="text-sm text-gray-300">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-900/50 rounded-t-lg flex items-center justify-center">
              <Armchair className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm text-gray-300">Taken</span>
          </div>
  
          <div className="flex gap-2">
            <Info className="text-gray-400" />
            <p className="text-gray-400 text-sm">
              Selected seats can be cancelled in the period of 10 minutes after buying it.
            </p>
          </div>
  
          <div className="flex justify-center mt-2">
            <button
              className="px-8 w-full py-3 bg-indigo-600 text-white rounded-lg font-medium 
              indigo:bg-blue-700 transition-colors duration-200 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:hover:bg-indigo-600
              shadow-lg shadow-indigo-500/20 cursor-pointer"
              onClick={handleReserveSeats}
              disabled={selectedSeats.length === 0}
            >
              Confirm selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default SelectSeats;
