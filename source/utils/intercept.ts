import http from 'http'
import config from 'config'


// Load config
const urlxr = RegExp( config.get<string[]>('intercept.urlx').join('|') )
const interceptContentTypes:string[] = config.get<string[]>('intercept.contentType')


// Log headers
export function logHeaders(raw : string[]) : void
{
    for (let i = 0; i < raw.length; i += 2)
    {
        console.log(`${raw[i]}: ${raw[i+1]}`)
    }
}


// Verify intercept
export function check(url : string) : boolean
{
    return !url.match(urlxr)
}


// Verify if item is to be displayed
export function display(im : http.IncomingMessage) : boolean
{
    return interceptContentTypes.includes( im.headers['content-type'] as string )
}