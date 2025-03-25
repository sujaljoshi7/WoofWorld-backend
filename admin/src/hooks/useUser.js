import { useState, useEffect } from "react";
import api from "../api"; // Make sure this is the correct path
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const useUser = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                console.error("No token found!");
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get("/api/user/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { user, isLoading }; // Return an object
};

export default useUser; // Ensure you export it correctly
