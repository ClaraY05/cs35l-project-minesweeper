import { useState } from "react";
import { useForm } from "react-hook-form";

type Inputs = {
    username: string;
    password: string;
};

type AuthMode = "login" | "register";

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<AuthMode>("login");

    // let accessToken: string | null = null;

    const onSubmit = async (data: Inputs) => {
        setError("");
        try {
            setLoading(true);

            const endpoint = mode==="login" ? "http://localhost:8000/api/auth/login" : "http://localhost:8000/api/auth/register";
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const payload = await res.json();
            if (!res.ok){
                throw new Error(payload.error || "Invalid username or password");
            }
            localStorage.setItem('token',payload.token);
            if(payload.user){
                localStorage.setItem('user', JSON.stringify(payload.user));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const toggle = () =>{
        if (mode==="login"){
            setMode("register");
        }
        else{
            setMode("login");
        }
    }

    return (
        <>
            <h2>Login Form</h2>
            <button type="button" onClick={toggle}>
                {mode==="login" ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input id="username" type="email" {...register("username",{
                    required:"Email is required", pattern:{
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address"
                    }})}/>
                <input id="password" type="password" {...register("password", {
                    required: "Password is required", pattern:{
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Password must be at least 8 characters"
                    }
                })
                }/>
                <button type="submit" disabled={loading}> {loading ? mode==="login"? "Logging in..." : "Signing up...": mode==="login"? "Login" : "Register"}</button>
            </form>
        </>
    )
};

export default Login;