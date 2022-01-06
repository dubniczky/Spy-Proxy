'use strict'

//Import modules
import Express from 'express'
import Yaml from 'js-yaml'
import Fs from 'fs'
import HttpProxy from 'http-proxy'
import Crypto from 'crypto'
import Http from 'http'



//Load config
let config:any = null
try
{
    let file = Fs.readFileSync('config.yml', 'utf-8')
    config = Yaml.load(file)
}
catch (error)
{
    console.log('Could not load config: config.yml')
    process.exit(1)
}
console.log('Config loaded.')


// Log headers
function logHeaders(raw : Array<string>) : void
{
    for (let i = 0; i < raw.length; i += 2)
    {
        console.log(`${raw[i]}: ${raw[i+1]}`)
    }
}

//Hash
function md5(data : Buffer) : string
{
    return Crypto.createHash('md5').update(data).digest('hex')
}

//Tampering
function tamperHeader(out : boolean, req : Http.ClientRequest | Http.ServerResponse)
{
    const conf = (out) ? config.tampering.req.header :
                         config.tampering.res.header

    for (const h in conf)
    {
        req.setHeader(h, conf[h])
        console.log(h, conf[h])
    }
}



// Create proxy
const proxy = HttpProxy.createProxyServer(
{
    ws: true,
    changeOrigin: false,
    selfHandleResponse: true
})

proxy.on('proxyReq', (preq : Http.ClientRequest, req : Http.IncomingMessage, res : Http.OutgoingMessage) =>
{
    //@ts-ignore
    req['id'] = nextRequestID++

    tamperHeader(true, preq)

    //Log request
    //@ts-ignore
    console.log(`--- (${req.id}) Request:`, req.method, req.url)

    //Log header
    logHeaders(req.rawHeaders)

    //Await body
    console.log('\n')    
    let body:Uint8Array[] = []

    preq.on('data', (chunk) =>
    {
        body.push(chunk)
    })

    preq.on('end', () =>
    {
        const bodyStr = Buffer.concat(body).toString();
        console.log(bodyStr)
        console.log('---')
        res.end(bodyStr)
    })
})
//@ts-ignore
proxy.on('proxyRes', (pres : Http.ServerResponse, req : Http.IncomingMessage, res : Http.OutgoingMessage) =>
{
    //Log header body
    //@ts-ignore
    console.log(`--- (${req.id}) Response:`)

    tamperHeader(false, pres)

    //Log header
    //@ts-ignore
    logHeaders(pres.rawHeaders)

    //Await body
    console.log('\n')
    let body:Uint8Array[] = []

    pres.on('data', (chunk) =>
    {
        body.push(chunk)
    })

    pres.on('end', () =>
    {
        const bodyb:Buffer = Buffer.concat(body)
        //Intercept
        //@ts-ignore
        if ( config.intercept.contentType.includes( pres.headers['content-type'] ) )
        {
            const bodyStr = body.toString();
            console.log(bodyStr)
            console.log('---')
            res.end(bodyStr)
        }
        else //Do not intercept
        {
            console.log(`md5hex:<${md5(bodyb)}>`)
            console.log('---')
            res.end(bodyb)
        }
    })
})
console.log('Proxy loaded.')

//Create express app
const app = Express();

app.get('*', function(req, res)
{
    proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` })
})

//Globals
let nextRequestID = 1

console.log('Server loaded.')

const server = app.listen(config.ports.http)
console.log('Server running.')
console.log('---------------')