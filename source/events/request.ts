import { ClientRequest, IncomingMessage, OutgoingMessage } from 'http'


import * as intercept from '../utils/intercept'
import * as tampering from '../utils/tamper'


export default function(preq : ClientRequest, req : IncomingMessage, res : OutgoingMessage)
{
    tampering.header(true, preq)

    //Log request
    //@ts-ignore
    console.log(`--- (${req.id}) Request:`, req.method, req.url)

    //Log header
    intercept.logHeaders(req.rawHeaders)

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
}