import { Navigate, Outlet } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";


const RequireAuth = () => {
    const [user] = useLocalStorage<any | null>("user", null);

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default RequireAuth;
