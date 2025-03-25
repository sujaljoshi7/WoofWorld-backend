import { react, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import axios from "axios";
import componentMap from "./routes/ComponentMap";
import api from "./api";
import NotFoundPage from "./pages/NotFound/NotFound";

function App() {
  const [routes, setRoutes] = useState([]);

  const fetchNavbarItems = async () => {
    // setIsLoadingNavbarItems(true);
    try {
      const response = await api.get("/api/navbar/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }
      const navbarItems = response.data.filter(
        (navItem) => navItem.status === 1
      );

      // Process the data to create nested structure
      const structuredNavbar = processNavbarData(navbarItems);

      setRoutes(structuredNavbar);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      // setIsLoadingNavbarItems(false);
    }
  };

  const processNavbarData = (items) => {
    const menu = [];
    const itemMap = {};

    // Pehle sab items ko ek object ke andar store karo
    items.forEach((item) => {
      itemMap[item.id] = { ...item, subItems: [] };
    });

    // Ab parent-child relation create karo
    items.forEach((item) => {
      if (item.dropdown_parent) {
        if (itemMap[item.dropdown_parent]) {
          itemMap[item.dropdown_parent].subItems.push(itemMap[item.id]);
        }
      } else {
        menu.push(itemMap[item.id]); // Ye parent hai, direct menu me daal do
      }
    });

    return menu;
  };

  useEffect(() => {
    fetchNavbarItems();
  }, []);

  return (
    <BrowserRouter>
      {/* <Routes> */}
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/dashboard" element={<Login />} /> */}
      {/* <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route> */}
      {/* </Routes> */}

      {routes.length > 0 ? (
        <Routes>
          {routes.map((route) => {
            const Component = componentMap[route.component] || NotFoundPage;
            return (
              <Route key={route.url} path={route.url} element={<Component />} />
            );
          })}
          <Route path="*" element={<NotFoundPage />} /> {/* Fallback Route */}
        </Routes>
      ) : (
        <p>Loading...</p> // Show loading while fetching routes
      )}
    </BrowserRouter>
  );
}

export default App;
