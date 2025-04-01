import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/home/Home";
import EventDetails from "./pages/events/EventDetails";
import UpcomingEvents from "./pages/events/UpcomingEvents";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import OTPVerification from "./pages/auth/otpverification/Otp";
import RazorpayCheckout from "./components/payment/razorpay";
import Cart from "./pages/cart/Cart";
import OrderConfirmation from "./pages/order/OrderConfirmation";
import UserProfile from "./pages/profile/Profile";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/pay" element={<RazorpayCheckout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orderplaced" element={<OrderConfirmation />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/events/upcoming" element={<UpcomingEvents />} />
        <Route path="/events/past" element={<EventDetails />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} /> */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
