'use strict'


//Import external modules
import fs from 'fs'
import http from 'http'
import https from 'https'
import express from 'express'
import httpProxy from 'http-proxy'
import config from 'config'

//Import internal modules
import proxyRequestEvent from './events/request'
import proxyResponseEvent from './events/response'


// Create proxy
const proxy = httpProxy.createProxyServer(
{
    ws: true,
    changeOrigin: false,
    selfHandleResponse: true
})

proxy.on('proxyReq', proxyRequestEvent)
proxy.on('proxyRes', proxyResponseEvent)
console.log('Proxy loaded.')


//Create express app
const app = express();

app.get('*', (req, res) =>
{
    //@ts-ignore
    req.id = nextRequestID++
    proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` })
})

const httpsOptions:https.ServerOptions =
{
    key: fs.readFileSync('proxy.key', 'utf-8'),
    cert: fs.readFileSync('proxy.crt', 'utf-8')
}


//Globals
let nextRequestID:number = 1
let httpPort:number = config.get<number>('ports.http')
let httpsPort:number = config.get<number>('ports.https')


//Start servers
const httpServer = http.createServer(app).listen(httpPort)
const httpsServer = https.createServer(httpsOptions, app).listen(httpsPort)
console.log(`Proxy listening on ports: (http: ${httpPort}) (https: ${httpsPort})`)
console.log('---------------')