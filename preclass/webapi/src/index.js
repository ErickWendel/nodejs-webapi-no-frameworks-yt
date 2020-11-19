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

                return response.end()
            } catch (error) {
                handleError(response)(error)
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

    const chosen = routes[key]
    response.writeHead(200, DEFAULT_HEADER)

    return chosen(request, response).catch(handleError(response))
}


http.createServer(handler)
    .listen(PORT, () => console.log("server start at port", PORT))
