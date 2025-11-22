export async function authFetch(url:string, options:RequestInit){
    const storedToken = localStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken) : null;
    if(!token){
        throw new Error("No authentication token found");
    }

    const headers : HeadersInit = {
        ...(options.headers || {}),
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`
    };
    const res = await fetch(url,{...options, headers});
    const content_type = res.headers.get("content-type");
    let payload;
    if(content_type?.includes("application/json")){
        payload = await res.json();
    }
    else{
        const text = await res.text();
        payload = {error:text};
    }
    if(!res.ok){
        if(res.status===401||res.status===403){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            throw new Error("Session expired.")
        }
        throw new Error(payload.error || "Request failed");
    }
    return payload;
}