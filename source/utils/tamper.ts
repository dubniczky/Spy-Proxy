import http from 'http'
import config from 'config'

// Types
type RegexRewrite = 
{
    rule : string,
    replace : string
}


// Config
const requestHeaderRewrite:string[] = config.get<string[]>('tamper.req.header')
const responseHeaderRewrite:string[] = config.get<string[]>('tamper.res.header')
const responseBodyRewrite:RegexRewrite[] = config.get<RegexRewrite[]>('tamper.res.body')


// Rewrite request header from config
export function requestHeader(req : http.ClientRequest) : void
{
    for (const h in requestHeaderRewrite)
    {
        if (requestHeaderRewrite[h] == null)
        {
            req.removeHeader(h)
        }
        else
        {
            req.setHeader(h, requestHeaderRewrite[h])
        }
    }
}


// Rewrite request header from config
export function responseHeader(req : http.OutgoingMessage) : void
{
    for (const h in responseHeaderRewrite)
    {
        if (responseHeaderRewrite[h] == null)
        {
            req.removeHeader(h)
        }
        else
        {
            req.setHeader(h, responseHeaderRewrite[h])
        }
    }
}


// Rewrite request header from config
export function responseBody(body : string) : string
{
    for (let rw of responseBodyRewrite)
    {
        body = body.replace(rw.rule, rw.replace)
    }
    return body
}