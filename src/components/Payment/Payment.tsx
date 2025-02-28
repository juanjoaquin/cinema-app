import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";

export const Payment = () => {
  const location = useLocation();
  const { selectedTickets } = location.state || { selectedTickets: [] };
  const navigate = useNavigate();

  const paymentSchema = z.object({
    payment_method: z.enum(["credit_card", "debit_card"]),
    card_name: z.string().min(1, "Card Name is required"),
    card_number: z.string().min(1, "Card number is required"),
    card_expiration: z.string().min(1, "Card expiration is required"),
    card_cvv: z.string().length(3, "Card CVV must be 3 digits"),
  });

  type PaymentForm = z.infer<typeof paymentSchema>;

  const [paymentData, setPaymentData] = useState<PaymentForm>({
    payment_method: "credit_card",
    card_name: "",
    card_number: "",
    card_expiration: "",
    card_cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    // Validar con Zod
    const result = paymentSchema.safeParse(paymentData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    if (selectedTickets.length === 0) {
      setErrors({ general: "No hay tickets seleccionados para pagar." });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/payment`, {
        ticket_id: selectedTickets,
        ...paymentData,
      });

      setMessage("Pago realizado con éxito");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error en el pago:", error);
      setErrors({ general: "Error al procesar el pago." });
    }
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Payment form</h2>

      <div className="px-4 space-y-6 mb-4 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600">
        <div className="flex justify-between items-center">
          <p className="uppercase text-sm text-gray-400">Cinema Card</p>
          <span className="text-lg font-semibold text-gray-200 uppercase">Visa</span>
        </div>

        <div className="mt-4">
          <span className="text-xl font-semibold text-gray-200">**** **** **** 8342</span>
        </div>

        <div className="pb-4 mt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">George Williams</span>
            <span className="text-sm text-gray-300">09/28</span>
          </div>
        </div>
      </div>

      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      
      <div className="space-y-2">


        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-indigo-300 text-sm" htmlFor="payment_method">Select a card</label>
          <select
            id="payment_method"
            name="payment_method"
            value={paymentData.payment_method}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white mb-4 border border-indigo-800/40"
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
          </select>

          <label className="block mb-2 text-indigo-300 text-sm" htmlFor="card_name">Cardholder's Name</label>

          <input
            id="card_name"
            type="text"
            name="card_name"
            placeholder="Cardholder's Name"
            value={paymentData.card_name}
            onChange={handleChange}
            className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-indigo-800/40"
          />
          {errors.card_name && <p className="text-red-500">{errors.card_name}</p>}

          <label className="block mb-2 text-indigo-300 text-sm" htmlFor="card_number">Cardholder's Number</label>

          <input
            id="card_number"
            type="text"
            name="card_number"
            placeholder="Card Number"
            value={paymentData.card_number}
            onChange={handleChange}
            className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-indigo-800/40"
          />
          {errors.card_number && <p className="text-red-500">{errors.card_number}</p>}

          <div className="flex gap-2 justify-between">
            <label className="block mb-2 text-indigo-300 text-sm" htmlFor="card_expiration">Expire Date</label>
            <label className="block mb-2 text-indigo-300 text-sm" htmlFor="card_cvv">CVV</label>

          </div>

          <div className="flex gap-2">

            <div className="w-1/2">
              <input
                id="card_expiration"
                type="text"
                name="card_expiration"
                placeholder="MM/YY"
                value={paymentData.card_expiration}
                onChange={handleChange}
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-indigo-800/40"
              />
              {errors.card_expiration && <p className="text-red-500">{errors.card_expiration}</p>}
            </div>
            <div className="w-1/2">
              <input
                id="card_cvv"
                type="text"
                name="card_cvv"
                placeholder="CVV"
                value={paymentData.card_cvv}
                onChange={handleChange}
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-indigo-800/40"
              />
              {errors.card_cvv && <p className="text-red-500">{errors.card_cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-indigo-500 to-indigo-700 cursor-pointer hover:bg-indigo-800 text-white font-bold py-2 rounded mt-4 uppercase"
          >
            Pay now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
