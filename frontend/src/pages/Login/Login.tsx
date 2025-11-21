import { useState } from "react";
import { useForm } from "react-hook-form";

type Inputs = {
    username: string;
    password: string;
};


function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    let accessToken: string | null = null;

    const onSubmit = async (data: Inputs) => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const payload = await res.json();
            if (!res.ok){
                throw new Error(payload.error || "Invalid username or password");
            }
            accessToken = payload.token;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <> 
            <h2>Login Form</h2>
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
                <button type="submit" disabled={loading}> {loading ? "Logging in..." : "Login"}</button>
            </form>
        </>
    )
};

export default Login;