import http from 'http'
import config from 'config'

type Headers =
{
    [index: string]: string
}

export function header(out : boolean, req : http.ClientRequest | http.OutgoingMessage)
{
    const conf:Headers = (out) ? config.get('tampering.req.header') : config.get('tampering.res.header')

    for (const h in conf)
    {
        req.setHeader(h, conf[h])
        console.log(h, conf[h])
    }
}