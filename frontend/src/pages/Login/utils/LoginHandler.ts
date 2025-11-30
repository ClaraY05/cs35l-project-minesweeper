export type Inputs = {
    username?: string;
    password: string;
    email: string;
};

export type AuthMode = "login" | "register";

interface AuthResponse {
    user: any;
    error?: string;
}

export const handleLogin = async (
    data: Inputs,
    mode: AuthMode
): Promise<AuthResponse> => {
    const endpoint = mode === "login" 
        ? "http://localhost:8000/api/auth/login" 
        : "http://localhost:8000/api/auth/register";
    
    const dataBody = mode === "login" 
        ? { email: data.email, password: data.password }
        : { email: data.email, password: data.password, username: data.username };
    
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataBody)
    });

    const payload = await res.json();
    if (!res.ok) {
        throw new Error(payload.error || "Invalid username or password");
    }

    return payload;
};

export const toggleAuthMode = (currentMode: AuthMode): AuthMode => {
    return currentMode === "login" ? "register" : "login";
};

