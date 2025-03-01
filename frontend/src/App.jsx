import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
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
import BlogForm from "./pages/blogs/AddBlog";
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
          path="/blogs/add"
          element={
            <ProtectedRoute>
              <BlogForm />
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
