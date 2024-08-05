import './App.css';

import { Route, Routes } from 'react-router-dom';

import Home from './components/general/Home';
import SearchResults from './components/general/SearchResults';
import MoviePage from './components/movie/MoviePage';
import ErrorPage from './utils/ErrorPage'

import RequireAuth from './utils/RequireAuth';
import PersistLogin from './utils/PersistLogin';
import Layout from './components/general/Layout';

import UserProfile from './components/account/UserProfile';
import BookingHistory from './components/account/BookingHistory';

import Showtimes from './components/checkout/Showtimes';
import SeatSelection from './components/checkout/SeatSelection';
import TicketSelection from './components/checkout/TicketSelection';
import OrderSummary from './components/checkout/OrderSummary';
import OrderConfirmation from './components/checkout/OrderConfirmation';

import AdminDashboard from './components/admin/AdminDashboard'
import AdminPanel from './components/admin/AdminPanel';

import Verification from './components/account/Verification';
import ResetPassword from './components/account/ResetPassword';

const CLEARANCE = {
    'admin': 1,
    'user': 2
}

export default function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>

                {/* Public Routes */}
                <Route path="/" exact element={<Home />} />
                <Route path="/home" element={<Home />} />

                {/* Change later so that /search is not a public endpoint */}
                <Route path="/search/:title?" element={<SearchResults />} />

                {/* Dynamically generated urls for each movie */}
                <Route path="/movie/:title" element={<MoviePage />} />

                <Route path="/verification" element={<Verification />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route element={<PersistLogin />}>
                    {/* Protected User Routes */}
                    <Route element={<RequireAuth clearance={CLEARANCE.user} />}>
                        <Route path='/user-profile' element={<UserProfile />} />
                        <Route path='/booking-history' element={<BookingHistory />} />
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route element={<RequireAuth clearance={CLEARANCE.admin} />}>
                        <Route path='/admin-panel' element={<AdminPanel />} />
                        <Route path='/admin-dashboard' element={<AdminDashboard />} />
                    </Route>

                    {/* Protected Checkout Route */}
                    <Route element={<RequireAuth clearance={CLEARANCE.user} />}>
                        <Route path="/movie/:title/showtimes" element={<Showtimes />} />
                        <Route path="/movie/:title/seating" element={<SeatSelection />} />
                        <Route path="/movie/:title/tickets" element={<TicketSelection />} />
                        <Route path="/movie/:title/summary" element={<OrderSummary />} />
                        <Route path="/movie/:title/confirmation" element={<OrderConfirmation />} />
                    </Route>
                </Route>

                {/* Incorrect Route Name */}
                <Route path='*' element={<ErrorPage />} />
            </Route>
        </Routes>
    );
}