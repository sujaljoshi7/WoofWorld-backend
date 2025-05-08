import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Dashboard1 from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/Users";
import ViewUser from "./pages/view_user";
import AddEventCategory from "./pages/events/AddEventCategory";
import ViewEventCategories from "./pages/events/ViewCategories";
import ViewEvents from "./pages/events/Events";
import AddEvent from "./pages/events/AddEvent";
import EventDetails from "./pages/events/ViewEvent";
import EditEvent from "./pages/events/EditEvent";
import AddBlog from "./pages/blogs/AddBlog";
import EditBlog from "./pages/blogs/EditBlog";
import ViewBlogs from "./pages/blogs/Blogs";
import BlogDetails from "./pages/blogs/ViewBlog";
import ViewAdoption from "./pages/adoption/Adoption";
import AdoptionDetails from "./pages/adoption/ViewAdoption";
import AddAdoption from "./pages/adoption/AddAdoption";
import AddBreed from "./pages/adoption/AddBreed";
import EditAdoption from "./pages/adoption/EditAdoption";
import ViewServiceCategories from "./pages/services/ViewCategories";
import AddServiceCategory from "./pages/services/AddServiceCategory";
import ViewServices from "./pages/services/Services";
import AddService from "./pages/services/AddService";
import ServiceDetails from "./pages/services/ViewService";
import EditService from "./pages/services/EditService";
import AddProductCategory from "./pages/products/AddProductCategory";
import ViewProductCategories from "./pages/products/ViewCategories";
import ViewProducts from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import ProductDetails from "./pages/products/ViewProduct";
import AddAboutUs from "./pages/companydetails/AddAboutus";
import AboutUs from "./pages/companydetails/AboutUs";
import ViewBreeds from "./pages/adoption/ViewBreeds";
import ComingSoon from "./pages/ComingSoon";
import HeroSection from "./pages/homepage/herosection/HeroSection";
import AddHero from "./pages/homepage/herosection/AddHero";
import EditHero from "./pages/homepage/herosection/EditHero";
import PartnerCompanies from "./pages/homepage/partnercompanies/PartnerCompanies";
import AddPartnerCompany from "./pages/homepage/partnercompanies/AddPartnerCompany";
import EditPartnerCompany from "./pages/homepage/partnercompanies/EditPartnerCompany";
import NavbarItems from "./pages/homepage/navbar/NavbarItems";
import AddNavbarItems from "./pages/homepage/navbar/AddNavbarItem";
import EditNavbarItems from "./pages/homepage/navbar/EditNavbarItem";
import ViewOrders from "./pages/orders/orders";
import OrderDetails from "./pages/orders/order-details";
import ServiceForm from "./components/ServiceForm";
import EventDashboard from "./pages/events/EventDashboard";
import AddPastEventImages from "./pages/events/AddPastEventsImages";
import Notifications from "./pages/notification/Notifications";

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
        <Route
          path="/invoice/:id"
          element={
            <ProtectedRoute>
              <ViewUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/v2"
          element={
            <ProtectedRoute>
              <Dashboard1 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-user/:id"
          element={
            <ProtectedRoute>
              <ViewUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <ViewEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/past/:id"
          element={
            <ProtectedRoute>
              <AddPastEventImages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/sales"
          element={
            <ProtectedRoute>
              <EventDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/add/"
          element={
            <ProtectedRoute>
              <AddEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/category"
          element={
            <ProtectedRoute>
              <ViewEventCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/category/add"
          element={
            <ProtectedRoute>
              <AddEventCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <ViewBlogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/add"
          element={
            <ProtectedRoute>
              <AddBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/edit/:id"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <BlogDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption"
          element={
            <ProtectedRoute>
              <ViewAdoption />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption/add"
          element={
            <ProtectedRoute>
              <AddAdoption />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption/breeds"
          element={
            <ProtectedRoute>
              <ViewBreeds />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption/breed/add"
          element={
            <ProtectedRoute>
              <AddBreed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption/:id"
          element={
            <ProtectedRoute>
              <AdoptionDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption/edit/:id"
          element={
            <ProtectedRoute>
              <EditAdoption />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/category/"
          element={
            <ProtectedRoute>
              <ViewServiceCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/category/add"
          element={
            <ProtectedRoute>
              <AddServiceCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ViewServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/add"
          element={
            <ProtectedRoute>
              <AddService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <ServiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/edit/:id"
          element={
            <ProtectedRoute>
              <EditService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/category"
          element={
            <ProtectedRoute>
              <ViewProductCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/category/add"
          element={
            <ProtectedRoute>
              <AddProductCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ViewProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companyinfo/aboutus"
          element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companyinfo/aboutus/edit"
          element={
            <ProtectedRoute>
              <AddAboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/herosection"
          element={
            <ProtectedRoute>
              <HeroSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/herosection/add"
          element={
            <ProtectedRoute>
              <AddHero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/herosection/edit/:id"
          element={
            <ProtectedRoute>
              <EditHero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/partnercompany"
          element={
            <ProtectedRoute>
              <PartnerCompanies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/partnercompany/add"
          element={
            <ProtectedRoute>
              <AddPartnerCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/partnercompany/edit/:id"
          element={
            <ProtectedRoute>
              <EditPartnerCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/navbar"
          element={
            <ProtectedRoute>
              <NavbarItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/navbar/add"
          element={
            <ProtectedRoute>
              <AddNavbarItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage/navbar/edit/:id"
          element={
            <ProtectedRoute>
              <EditNavbarItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <ViewOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companyinfo/partnercompany"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companyinfo/contactdetails"
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
