# Subdomain-Proxy

This is a simple Node.js application that uses a proxy to redirect requests based on the subdomain to a certain port on the same server.

## How it works

The application uses the express and http-proxy modules to handle HTTP requests. The app.use() method handles all types of HTTP requests for any route. It uses the req.headers.host property to get the subdomain from the request's hostname. The subdomain is then used to match the path in the paths object, where the key is the subdomain and the value is the target URL. If the subdomain is found in the paths object, the request is proxied to the target URL, otherwise, it is proxied to the default path (paths.root).

The server also listen to the 'upgrade' event to handle WebSocket connections.

## Configuration

You can configure the target URLs for each subdomain in the paths object, in this case the key is the subdomain and the value is the target URL.

You can change the port of the server by modifying the last line of the code
server.listen(80);

## Dependencies

* express
* http-proxy

## Usage

1. Make sure you have Node.js and npm installed on your machine.
2. Clone the repository: `git clone https://github.com/emanuele-toma/Subdomain-Proxy.git`
3. Install the dependencies: `npm install`
4. Start the server: `node index.js`
5. Make requests to your server specifying the subdomain you configured in the `paths` object.

## Example

```
http://sub1.yourserver.com
```

will be proxy to the URL configured in the path object for the subdomain 'sub1'
License

This project is open-sourced under the AGPL-3.0 license.