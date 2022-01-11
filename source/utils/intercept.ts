import config from 'config'


// Load config
const urlxr = RegExp( config.get<string[]>('intercept.urlx').join('|') )


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