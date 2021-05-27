const express = require('express');
const routes = express.Router()
// parte do express que cria as rotas

const basePath = __dirname + "/views"

const profile = {
    "name": "Raphael H. Linhares",
    "avatar": "https://avatars.githubusercontent.com/u/83095962?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4
}

// request, response

// routes.get('/', (request,response)=>{
//     return response.sendFile(__dirname + "/views/index.html")
// })

// ----------- construção inicial das rotas
// routes.get('/', (req,res)=> {return res.sendFile(basePath + "/index.html")})
// routes.get('/job', (req,res)=> {return res.sendFile(basePath + "/job.html")})
// routes.get('/job/edit', (req,res)=> {return res.sendFile(basePath + "/job-edit.html")})
// routes.get('/profile', (req,res)=> {return res.sendFile(basePath + "/profile.html")})
// trocar caminhos relativos nos arquivos .html por caminhos "absolutos:
// ./images --> /images


// ----------- construção das rotas com EJS
// após a troca pelo ejs, a expressão deve mudar. o arquivo não será enviado, e sim renderizado
// o ejs lê por padrão a pasta views (não src/views), que havia sido criada antes. Assim, pode ser desconsiderado o basePath - e os arquivos não precisam de extensão
routes.get('/', (req,res)=> {return res.render("index")})
routes.get('/job', (req,res)=> {return res.render("job")})
routes.get('/job/edit', (req,res)=> {return res.render("job-edit")})
routes.get('/profile', (req,res)=> {return res.render("profile",{profile: profile})})



module.exports = routes;