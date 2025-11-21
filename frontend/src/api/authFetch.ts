import { useLocalStorage } from "usehooks-ts";

export async function authFetch(url:string, options:RequestInit){
    const [,setToken] = useLocalStorage<string|null>("token",null);
    const [,setUser] = useLocalStorage<any|null>("user",null);

    const token = localStorage.getItem('token');
    if(!token){
        throw new Error("No authentication token found");
    }

    const headers : HeadersInit = {
        ...(options.headers || {}),
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`
    };
    const res = await fetch(url,{...options, headers});
    const payload = await res.json();
    if(!res.ok){
        if(res.status===401||res.status===403){
            setToken(null);
            setUser(null);
            throw new Error("Session expired.")
        }
        throw new Error(payload.error || "Request failed");
    }
    return payload;
}