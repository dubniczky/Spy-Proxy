import http from 'http'
import config from 'config'


// Load config
const urlxr = RegExp( config.get<string[]>('intercept.urlx').join('|') )
const interceptContentTypes = RegExp( config.get<string[]>('intercept.contentType').join('|') )


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
    if (im.headers['content-type'] == null) return true //Display if content type is unknown
    return !!(im.headers['content-type'] + '').match(interceptContentTypes)
}