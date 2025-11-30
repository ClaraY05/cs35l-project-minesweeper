# How to use authfetch

`authfetch()` works the same as `fetch()` syntacitcally. It accepts the same options. 

However, authfetch resolves Promises for you, and it also handles the res.ok stuff. So you just have to catch any error that it provides,not the standard HTTP request errors.

The error it provides is of type "Error". A standard try/catch will not expect this and you will get a typescript error complaining that err in your catch block is of an unknown type. Cast your local err as type Error to fix this.

![alt text](errorcatchexample.png)