'use strict'

//Import external modules
import express from 'express'
import httpProxy from 'http-proxy'
import config from 'config'

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

app.get('*', function(req, res)
{
    //@ts-ignore
    req.id = nextRequestID++
    proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` })
})

//Globals
let nextRequestID = 1

console.log('Server loaded.')

const server = app.listen(config.get('ports.http'))
console.log('Server running.')
console.log('---------------')