import http from 'http'
import config from 'config'


type Headers =
{
    [index: string]: string
}


export function requestHeader(req : http.ClientRequest | http.OutgoingMessage)
{
    const conf:Headers = config.get<Headers>('tamper.req.header')

    for (const h in conf)
    {
        req.setHeader(h, conf[h])
        console.log(">>>>>>>>", h, conf[h])
    }
}