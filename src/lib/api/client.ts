import axios from "axios";

const defaultBaseUrl =
    typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? "https://crosspost-bcakend.onrender.com"
        : "http://localhost:4000";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || defaultBaseUrl,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    timeout: 30_000,
});

/**
 * Attach the backend JWT on every request.
 * Written to sessionStorage by:
 *   - OTP login flow (login/page.tsx after verifyOtp)
 *   - SessionSync component (providers.tsx) after next-auth session loads
 */
apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("crosspost_jwt");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            // Token expired or invalid — clear it so next request re-authenticates
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("crosspost_jwt");
            }
        }
        const message: string =
            error?.response?.data?.error ??
            error?.response?.data?.message ??
            error?.message ??
            "An unexpected error occurred.";
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
