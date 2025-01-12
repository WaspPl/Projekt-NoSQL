//libraries import
const http = require("http")
const app = require("./app")
//port speification
const port = process.env.PORT || 3000

//create the server
const server = http.createServer(app)

//run server
server.listen(port)