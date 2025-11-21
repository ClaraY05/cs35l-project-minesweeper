export async function authFetch(url:string, options:RequestInit){
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw new Error("Session expired.")
        }
        throw new Error(payload.error || "Request failed");
    }
    return payload;
}