import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "usehooks-ts";
import { loadAllSettings } from "../Settings/utils/loadAllSettings";
import { Inputs, AuthMode, handleLogin, toggleAuthMode } from "./utils/LoginHandler";
import { DEFAULT_KEYBINDS, DEFAULT_SOUND, DEFAULT_VIDEO, DEFAULT_NOTIF } from "../../../../utils/defaultSettings";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<AuthMode>("login");

    const navigate = useNavigate();

    const [,setUser] = useLocalStorage<any|null>("user",null);
    const [,setKeybinds] = useLocalStorage("keybinds", DEFAULT_KEYBINDS);
    const [,setSound] = useLocalStorage("sound", DEFAULT_SOUND);
    const [,setVideo] = useLocalStorage("video", DEFAULT_VIDEO);
    const [,setNotif] = useLocalStorage("notif", DEFAULT_NOTIF);
    

    const onSubmit = async (data: Inputs) => {
        setError("");
        try {
            setLoading(true);

            const payload = await handleLogin(data, mode);
            if(mode==="login"){
                const {keybinds, sound, video, notif} = await loadAllSettings();
                setUser(payload.user);
                // make sure rerender so UI is updated with user saved changes
                setKeybinds(keybinds);
                setSound(sound);
                setVideo(video);
                setNotif(notif);
            }
            navigate("/home", {replace:true});
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const toggle = () => {
        setMode(toggleAuthMode(mode));
    }

    return (
        <div className="contentDiv flex flex-col items-center p-2"> 
            <h1 className="pb-0">Login Form</h1>
            <hr className="w-full border-t-2 border-dashed border-white mb-2"></hr>
            <div className="flex flex-col items-center gap-2 w-[60%] m-2">
                <form onSubmit={handleSubmit(onSubmit)} className="p-5 bg-stone-900  w-full rounded-lg">
                    <div className="flex flex-col mb-2">
                        <label htmlFor="email" className="uppercase font-bold">Email</label>
                        <input id="email" type="email" placeholder="email" className="px-1 rounded-md bg-white text-black" {...register("email",{
                            required:"Email is required", pattern:{
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }})}/>
                        {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
                    </div>
                        {mode==="register"&&(
                            <div className="flex flex-col mb-2">
                                <label htmlFor="username" className="uppercase font-bold">Username</label>
                                <input id="username" type="text" placeholder="username" className="px-1 rounded-md bg-white text-black" {...register("username",{
                                    required:"Username is required", pattern:{value:/^[a-zA-Z0-9]{5,51}$/, message: "Username must be between 5 and 50 characters with no special characters."}
                                })}/>
                                {errors.username && <p style={{color: 'red'}}>{errors.username.message}</p>}
                            </div>
                        )}
                    <div className="flex flex-col mb-2">
                        <label htmlFor="Password" className="uppercase font-bold">Password</label>
                        <input id="password" type="password" placeholder="password" className="px-1 rounded-md bg-white text-black" {...register("password", {
                            required: "Password is required", pattern:{
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
                            }})}/>
                            {errors.password && <p style={{color: 'red'}}>{errors.password.message}</p>}
                        {error && <p style={{color: 'red'}}>{error}</p>}
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="pt-3 hover:font-bold transition-all duration-300"> 
                            {loading ? mode==="login"? "Logging in..." : "Sending Verification Email...": mode==="login"? "Login" : "Register"}</button>
                    </div>
                </form>

                <button type="button" onClick={toggle} 
                    className="mt-2 text-sm text-primary-text hover:text-secondary-text transition-all duration-300"> 
                    {mode==="login" ? "Don't have an account? Register" : "Already have an account? Login"} 
                </button>            
            </div>
        </div>
    )
};

export default Login;