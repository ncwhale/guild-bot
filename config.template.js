const config = {
    bot_token: "PUT_YOUR_BOT_TOKEN_HERE",
    debug: false,             // If you want some logs
    path: "./path/to/socket", // Use path for IPC listen
    port: 3000,               // Or use port [host]
    host: '127.0.0.1'         // Warning: path will override port[host] param.
}

module.exports = config