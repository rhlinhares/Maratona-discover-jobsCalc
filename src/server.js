const { response } = require("express");
const express = require("express"); 
// Primeiro o express precisa ser atribuído a uma constante
const server = express()

// atribuir o arquivo routes.js
const routes = require("./routes")


// ----------- criar a view engine para utilizar ejs
// em seguida, alterar arquivos .html para ejs
server.set('view engine', 'ejs')

// rodar nodemon --- após ter mudado o package.json
// npm run dev

// ----------- primeiro testando a função response
//request, response
// server.get('/', (request, response)=>{
//     return response.send('OI')
// })
// ----------- o index poderia ser acionado assim:
// return response.sendFile(__dirname + "/views/index.html")


// ----------- criar uma pasta public e colocar lá tudo que é publico (imagens, scripts, css)
// habilitar arquivos statics
server.use(express.static("public"))

// usar o req.body
server.use(express.urlencoded({extended: true}))

// criar routes.js e utilizar o module.exports
// chamar o routes.js com comando require e utilizar o server.use
server.use(routes)


server.listen(3000, ()=> console.log('rodando'))
