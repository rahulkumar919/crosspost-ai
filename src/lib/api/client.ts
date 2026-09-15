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
 *   - The 401 interceptor below after a successful token refresh
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

// Track whether a token refresh is already in flight to avoid parallel refresh loops
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
    pendingQueue.forEach((p) => {
        if (error || !token) {
            p.reject(error);
        } else {
            p.resolve(token);
        }
    });
    pendingQueue = [];
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
            // Avoid retrying the refresh endpoint itself
            if (originalRequest.url?.includes("/api/refresh-backend-token")) {
                if (typeof window !== "undefined") {
                    sessionStorage.removeItem("crosspost_jwt");
                }
                return Promise.reject(new Error("Session expired. Please sign in again."));
            }

            originalRequest._retry = true;

            if (isRefreshing) {
                // Queue this request until the in-flight refresh completes
                return new Promise<string>((resolve, reject) => {
                    pendingQueue.push({ resolve, reject });
                }).then((freshToken) => {
                    originalRequest.headers.Authorization = `Bearer ${freshToken}`;
                    return apiClient(originalRequest);
                });
            }

            isRefreshing = true;

            try {
                // Ask the Next.js backend to get a fresh token from our Express API
                const refreshRes = await fetch("/api/refresh-backend-token", { method: "POST" });
                const refreshData = (await refreshRes.json()) as { token?: string; retryable?: boolean; error?: string };

                if (!refreshRes.ok) {
                    if (refreshRes.status === 503 && refreshData.retryable) {
                        // Backend cold-starting (Render free tier) — retry up to 3 times with short delays
                        processQueue(null, null);
                        return new Promise((resolve, reject) => {
                            let attempt = 0;
                            const maxAttempts = 3;
                            const delays = [2_000, 4_000, 6_000]; // 2s, 4s, 6s

                            const tryRefresh = async () => {
                                attempt++;
                                try {
                                    const retryRefresh = await fetch("/api/refresh-backend-token", { method: "POST" });
                                    const retryData = (await retryRefresh.json()) as { token?: string; retryable?: boolean };
                                    if (retryRefresh.ok && retryData.token) {
                                        if (typeof window !== "undefined") {
                                            sessionStorage.setItem("crosspost_jwt", retryData.token);
                                        }
                                        originalRequest.headers.Authorization = `Bearer ${retryData.token}`;
                                        resolve(apiClient(originalRequest));
                                    } else if (attempt < maxAttempts && retryData.retryable) {
                                        // Still starting — try again
                                        setTimeout(tryRefresh, delays[attempt] ?? 4_000);
                                    } else {
                                        reject(new Error("AI service is initialising — please wait a moment and try again."));
                                    }
                                } catch (retryErr) {
                                    if (attempt < maxAttempts) {
                                        setTimeout(tryRefresh, delays[attempt] ?? 4_000);
                                    } else {
                                        reject(retryErr);
                                    }
                                }
                            };

                            setTimeout(tryRefresh, delays[0]);
                        });
                    }
                    throw new Error("Token refresh failed");
                }

                const freshToken = refreshData.token!;

                if (typeof window !== "undefined") {
                    sessionStorage.setItem("crosspost_jwt", freshToken);
                }

                processQueue(null, freshToken);
                originalRequest.headers.Authorization = `Bearer ${freshToken}`;
                return apiClient(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                if (typeof window !== "undefined") {
                    sessionStorage.removeItem("crosspost_jwt");
                }
                return Promise.reject(new Error("Session expired — please sign in again."));
            } finally {
                isRefreshing = false;
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
