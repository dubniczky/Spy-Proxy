'use strict'


//Import external modules
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


//Globals
let nextRequestID:number = 1
let port:number = config.get<number>('ports.http')


//Start
const server = app.listen( port )
console.log('Proxy listening on port ' + port)
console.log('---------------')