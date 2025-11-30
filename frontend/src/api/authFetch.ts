export async function authFetch(url:string, options:RequestInit){
    // browser needs to set it with boundary, so we need to check if the body is a FormData
    const isFormData = options.body instanceof FormData;
    const headers : HeadersInit = {
        ...(options.headers || {}),
        ...(isFormData ? {} : { "Content-Type":"application/json" }),
    };
    const res = await fetch(url,{...options, credentials:"include", headers});
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
            localStorage.removeItem("user");
            window.location.replace("/login"); // TODO: /login currently doesn't exist
            throw new Error("Session expired.")
        }
        throw new Error(payload.error || "Request failed");
    }
    return payload;
}