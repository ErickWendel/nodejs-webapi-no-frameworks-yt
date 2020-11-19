'use strict';

const Hero = require('./entities/hero')

const http = require('http')
const Factory = require('./factories/heroFactory')
const heroService = Factory.generateInstance()
const PORT = 3000
const DEFAULT_HEADER = { 'Content-Type': 'application/json' }

const routes = {
    '/heroes:get': async (request, response) => {
        const { id } = request.queryString
        const list = await heroService.find(id)
        response.write(JSON.stringify({ result: list }))

        return response.end()
    },
    '/heroes:post': async (request, response) => {
        // entende como outro contexto, entao erro aqui dentro nao é pego pelo contexto maior
        for await (const data of request) {
            try {
                // await Promise.reject('erro!!!')
                const item = JSON.parse(data)
                const hero = new Hero(item)
                const { valid, error } = hero.isValid()
                if (!valid) {
                    response.writeHead(400, DEFAULT_HEADER)
                    response.write(JSON.stringify({ error: error.join(',') }))

                    return response.end()
                }
                
                const id = await heroService.create(hero)
                
                response.writeHead(201, DEFAULT_HEADER)
                response.write(JSON.stringify({ success: 'User Created has succeeded!', id }))
                
                // só jogamos o retorno pois sabemos que é um objeto body por requisicao
                // se fosse um arquivo, ele poderia chamar mais de uma vez, aí removeriamos o return
                return response.end()
            } catch (error) {
                return handleError(response)(error)
            }
        }


    },
    default: (request, response) => {
        response.write('Hello World!')
        return response.end()
    }
}

const handleError = response => {
    return error => {

        console.error('Internal Error***', error)
        response.writeHead(500, DEFAULT_HEADER)
        response.write(JSON.stringify({ error: 'Internal Server Error!' }))

        return response.end()
    }
}

const handler = function (request, response) {
    const { url, method } = request
    const [first, route, id] = url.split('/')
    request.queryString = { id: isNaN(id) ? id : Number(id) }

    const key = `/${route}:${method.toLowerCase()}`

    const chosen = routes[key] || routes.default
    
    response.writeHead(200, DEFAULT_HEADER)
    
    // handler nao manipula promises!
    return chosen(request, response).catch(handleError(response))
}


http.createServer(handler)
    .listen(PORT, () => console.log("server start at port", PORT))
