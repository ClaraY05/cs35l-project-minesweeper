import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";

const Verify = () => {
    const [params] = useSearchParams();
    const [status, setStatus] = useState<"pending"|"ok"|"error">("pending");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // extract token from the link clicked
        const emailToken = params.get("emailToken");
        if (!emailToken) {
            setStatus("error");
            setMessage("Missing token");
            return;
        }
        try{
            // need request body to match emailToken name
            authFetch("http://localhost:8000/api/auth/verify", { method: "POST", body: JSON.stringify({ emailToken }) });
            setStatus("ok");
            setMessage("email verified, redirecting...");
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
