import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav/Nav'
import { HomeContainer } from './components/Home/HomeContainer'
import { MovieDetail } from './components/Home/MovieDetail'
import { SelectSeats } from './components/Seats/SelectSeats'
import Payment from './components/Payment/Payment'
import { Register } from './components/auth/Register'
import { Login } from './components/auth/Login'
import { ProtectedRoutes } from './components/guards/ProtectedRoutes'
import { UpcomingMovies } from './components/UpcomingMovies/UpcomingMovies'
import { UpcomingDetail } from './components/UpcomingMovies/UpcomingDetail'
import { TicketHistory } from './components/TicketHistory/TicketHistory'
import { Location } from './components/Location/Location'

function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>

      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />


      
      <Route path="/" element={<HomeContainer />} />

      <Route path="/movie/:title" element={<MovieDetail />} />
      <Route path="/schedule/:schedule_id/details" element={<ProtectedRoutes> <SelectSeats /> </ProtectedRoutes>} />
      <Route path="/payment" element={<ProtectedRoutes> <Payment /> </ProtectedRoutes>} />

      <Route path="/movies/upcoming-movies" element={<UpcomingMovies />} />
      <Route path="/upcoming-movie/:id" element={<UpcomingDetail />} />

      <Route path="/tickets/my-tickets" element={<TicketHistory />} />

      <Route path="/location" element={<Location />} />




      
      </Routes>
    </BrowserRouter>
  )
}

export default App
