import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"

type Inputs = {
    username?: string;
    password: string;
    email: string
};

type AuthMode = "login" | "register";

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<AuthMode>("login");

    const navigate = useNavigate();

    const onSubmit = async (data: Inputs) => {
        setError("");
        try {
            setLoading(true);

            const endpoint = mode==="login" ? "http://localhost:8000/api/auth/login" : "http://localhost:8000/api/auth/register";
            const dataBody = mode==="login" ? {email:data.email, password:data.password} : {email:data.email, password:data.password, username:data.username}
            
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataBody)
            });

            const payload = await res.json();
            if (!res.ok){
                throw new Error(payload.error || "Invalid username or password");
            }
            localStorage.setItem('token',payload.token);
            localStorage.setItem('user', JSON.stringify(payload.user));
            navigate("/", {replace:true});
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
            <h2>{mode==="login" ? "Login Form" : "Register Form"}</h2>
            <button type="button" onClick={toggle}>
                {mode==="login" ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input id="email" type="email" {...register("email",{
                        required:"Email is required", pattern:{
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address"
                        }})}/>
                    {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
                </div>
                {
                    mode==="register"&&(
                        <div>
                            <input id="username" type="text" {...register("username",{
                                required:"Username is required", minLength:{value:5, message: "Username must be at least 5 characters"}
                            })}/>
                            {errors.username && <p style={{color: 'red'}}>{errors.username.message}</p>}
                        </div>
                    )
                }
                <div>
                    <input id="password" type="password" {...register("password", {
                        required: "Password is required", pattern:{
                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
                        }
                    })
                    }/>
                    {errors.password && <p style={{color: 'red'}}>{errors.password.message}</p>}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
                <div>
                    <button type="submit" disabled={loading}> {loading ? mode==="login"? "Logging in..." : "Signing up...": mode==="login"? "Login" : "Register"}</button>
                </div>
            </form>
        </>
    )
};

export default Login;