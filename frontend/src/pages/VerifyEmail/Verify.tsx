import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";

const Verify = () => {
    const [params] = useSearchParams();
    const [status, setStatus] = useState<"pending"|"ok"|"error">("pending");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("token");
        if (!token) {
            setStatus("error");
            setMessage("Missing token");
            return;
        }
        try{
            authFetch("http://localhost:8000/api/auth/verify", { method: "POST" });
            setStatus("ok");
            setMessage("email verified, you can log in now");
            navigate("/", {replace:true});
        } catch (err:any){
            setStatus("error");
            setMessage(err.message);
        }
    }, [params]);

    return (
        <div>
            {status !== "pending" && <p>{message}</p>}
        </div>
    );
};

export default Verify;
