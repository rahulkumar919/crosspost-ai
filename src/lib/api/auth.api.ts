import apiClient from "./client";

interface SignupInput {
    email: string;
    password: string;
    name?: string;
}

interface AuthResponse {
    token: string;
    user: { id: string; email: string; name: string | null };
}

interface SendOtpResponse {
    success: boolean;
    name: string | null;
}

export async function signup(input: SignupInput): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/signup", input);
    return res.data;
}

/**
 * Step 1 — Validate email + password and send an OTP to the user's email.
 * Returns the user's name for the greeting on the OTP screen.
 */
export async function sendOtp(email: string, password: string): Promise<SendOtpResponse> {
    const res = await apiClient.post<SendOtpResponse>("/auth/send-otp", { email, password });
    return res.data;
}

/**
 * Step 2 — Verify the 6-digit OTP and get a JWT back.
 */
export async function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/verify-otp", { email, otp });
    return res.data;
}
