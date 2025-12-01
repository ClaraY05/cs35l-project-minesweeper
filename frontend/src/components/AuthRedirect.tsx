import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

interface Props {
    children: JSX.Element;
}

const AuthRedirect = ({ children }: Props) => {
    const [user] = useLocalStorage<any | null>("user", null);

    // If logged in, redirect to /home
    if (user) return <Navigate to="/home" replace />;

    return children;
};

export default AuthRedirect;
