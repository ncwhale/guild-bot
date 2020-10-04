const config = {
    debug: false,             // If you want more(toooo much) logs
    slient: false,            // If you want the best performance
    verbose: 3,               // [1..6]: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'
    bot: {
        token: "PUT_YOUR_BOT_TOKEN_HERE",
        prefix: "https://YOUR_BOT_SERVICE_URL/"
    },
    log: {},                  // Logger options for [pino](https://github.com/pinojs/pino/blob/master/docs/api.md#options)
    service: {
        path: "./path/to/socket", // Use path for IPC listen
        port: 3000,               // Or use port [host]
        host: '127.0.0.1'         // Warning: path will override port[host] param.
    }
}

module.exports = config