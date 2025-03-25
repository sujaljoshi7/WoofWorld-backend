import api from "../api"; // Ensure correct path
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
        console.error("No refresh token found!");
        return false;
    }

    try {
        const response = await api.post("/api/token/refresh/", { refresh: refreshToken });
        const newAccessToken = response.data.access;

        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        console.log("Access token refreshed successfully!");
        return true;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return false;
    }
};
