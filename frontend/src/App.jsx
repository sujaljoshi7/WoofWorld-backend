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
import EventPass from "./components/event/pass";
import PastEvents from "./pages/events/PastEvents";
import ProtectedRoute from "./routes/ProtectedRoute";
import DogListing from "./pages/adoption/AllDogs";
import AllDogs from "./pages/adoption/AllDogs";
import AboutUs from "./pages/aboutus/AboutUs";
import Blogs from "./pages/blogs/Blogs";
import ComingSoon from "./pages/coming-soon/ComingSoon";
import Shop from "./pages/shop/Shop";
import BlogDetail from "./pages/blogs/BlogDetail";
import ProductDetail from "./pages/shop/ProductDetail";
import Checkout from "./pages/checkout/Checkout";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import SearchResults from "./pages/search/SearchResults";
import Services from "./pages/services/Services";
import ServiceDetails from "./pages/services/ServiceDetails";
import PastEventDetails from "./pages/events/PastEventDetails";

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
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/orderplaced" element={<OrderConfirmation />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/pass" element={<EventPass />} />
        <Route path="/events/upcoming" element={<UpcomingEvents />} />
        <Route path="/events/past" element={<PastEvents />} />
        <Route path="/events/past/:id" element={<PastEventDetails />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/adoption" element={<AllDogs />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<ComingSoon />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
