import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "usehooks-ts";

type Inputs = {
    username?: string;
    password: string;
    email: string
};

type AuthMode = "login" | "register";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<AuthMode>("login");

    const navigate = useNavigate();

    // const [,setToken] = useLocalStorage<string|null>("token",null);
    const [,setUser] = useLocalStorage<any|null>("user",null);

    const onSubmit = async (data: Inputs) => {
        setError("");
        try {
            setLoading(true);

            const endpoint = mode==="login" ? "http://localhost:8000/api/auth/login" : "http://localhost:8000/api/auth/register";
            const dataBody = mode==="login" ? {email:data.email, password:data.password} : {email:data.email, password:data.password, username:data.username}
            
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(dataBody)
            });

            const payload = await res.json();
            if (!res.ok){
                throw new Error(payload.error || "Invalid username or password");
            }
            // setToken(payload.token);
            setUser(payload.user);
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
        <button type="button" onClick={() => navigate("/")}> Home </button>
            <h2>Login Form</h2>
            <button type="button" onClick={toggle}>
                {mode==="login" ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input id="email" type="email" placeholder="email" {...register("email",{
                        required:"Email is required", pattern:{
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address"
                        }})}/>
                    {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
                </div>
                {
                    mode==="register"&&(
                        <div>
                            <input id="username" type="text" placeholder="username" {...register("username",{
                                required:"Username is required", pattern:{value:/^[a-zA-Z0-9]{5,51}$/, message: "Username must be between 5 and 50 characters with no special characters."}
                            })}/>
                            {errors.username && <p style={{color: 'red'}}>{errors.username.message}</p>}
                        </div>
                    )
                }
                <div>
                    <input id="password" type="password" placeholder="password" {...register("password", {
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