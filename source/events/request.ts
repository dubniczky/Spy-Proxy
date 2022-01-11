import { ClientRequest, IncomingMessage, OutgoingMessage } from 'http'


import * as intercept from '../utils/intercept'
import * as tampering from '../utils/tamper'





export default function(preq : ClientRequest, req : IncomingMessage, res : OutgoingMessage)
{
    //Check intercept
    let doIntercept:boolean = intercept.check(req.url + '')
    //@ts-ignore
    req.intercept = doIntercept

    if (doIntercept)
    {
        tampering.header(true, preq)
        //@ts-ignore
        console.log(`--- (${req.id}) Request:`, req.method, req.url)
        intercept.logHeaders(req.rawHeaders)
        console.log('\n')
    }

  
    //Await body
    let body:Uint8Array[] = []

    preq.on('data', (chunk) =>
    {
        body.push(chunk)
    })

    preq.on('end', () =>
    {
        const bodyStr = Buffer.concat(body).toString();
        
        if (doIntercept)
        {
            console.log(bodyStr)
            console.log('---')
        }

        res.end(bodyStr)
    })
}