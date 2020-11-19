const Hero = require('./entities/hero')

const http = require('http')
const Factory = require('./factories/heroFactory')
const heroService = Factory.generateInstance()
const PORT = 3000
const DEFAULT_HEADER = { 'Content-Type': 'application/json' }
const routes = {
    '/heroes:get': async (req, res) => {
        const { id } = req.queryString

        const list = await heroService.find(id)
        res.write(JSON.stringify({ result: list }))

        return res.end()
    },
    '/heroes:post': async (req, res) => {
        for await (const data of req) {
            const item = JSON.parse(data)
            const hero = new Hero(item)
            const { valid, error } = hero.isValid()
            if (!valid) {
                res.writeHead(400, DEFAULT_HEADER)
                res.write(JSON.stringify({ error: error.join(',') }))

                return res.end()
            }

            const id = await heroService.create(hero)

            res.writeHead(201, DEFAULT_HEADER)
            res.write(JSON.stringify({ success: 'User Created has succeeded!', id }))

            return res.end()
        }

    },
    default: (req, res) => {
        res.write('Hello World!')
        return res.end()
    }
}


const handler = function (req, res) {
    const { url, method } = req
    const [first, route, id] = url.split('/')
    req.queryString = { id: isNaN(id) ? id : Number(id) }

    const key = `/${route}:${method.toLowerCase()}`

    const chosen = routes[key]
    res.writeHead(200, DEFAULT_HEADER)
    return chosen(req, res)
}


const app = http.createServer(handler)
    .listen(PORT, () => console.log("server start at port", PORT))

module.exports = app