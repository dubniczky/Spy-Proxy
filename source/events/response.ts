import { IncomingMessage, OutgoingMessage } from 'http'
import config from 'config'


import * as intercept from '../utils/intercept'
import * as tampering from '../utils/tamper'
import { md5 } from '../utils/crypto'


const interceptContentType:string[] = config.get('intercept.contentType')


export default function(pres : IncomingMessage, req : IncomingMessage, res : OutgoingMessage) : void
{
    //Log header body
    //@ts-ignore
    console.log(`--- (${req.id}) Response:`)

    tampering.header(false, res)

    //Log header
    //@ts-ignore
    intercept.logHeaders(pres.rawHeaders)

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
        if ( interceptContentType.includes( pres.headers['content-type'] as string ) )
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
}