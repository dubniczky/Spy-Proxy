import { IncomingMessage, OutgoingMessage } from 'http'
import config from 'config'


import * as intercept from '../utils/intercept'
import * as tampering from '../utils/tamper'
import { md5 } from '../utils/crypto'


export default function(pres : IncomingMessage, req : IncomingMessage, res : OutgoingMessage) : void
{
    //@ts-ignore
    if (req.intercept)
    {
        //@ts-ignore
        console.log(`--- (${req.id}) Response:`)
        //tampering.header(false, res)
        //@ts-ignore
        intercept.logHeaders(pres.rawHeaders)
        console.log('\n')
    }

    //Await body    
    let body:Uint8Array[] = []

    pres.on('data', (chunk) =>
    {
        body.push(chunk)
    })

    pres.on('end', () =>
    {
        const bodyb:Buffer = Buffer.concat(body)
        let bodyOut:string = ''

        //Intercept
        if ( intercept.display(pres) )
        {
            const bodyStr = body.toString()
            bodyOut = bodyStr
            res.end(bodyStr)
        }
        else //Do not intercept
        {
            bodyOut = `md5hex:<${md5(bodyb)}>`
            res.end(bodyb)
        }

        //@ts-ignore
        if (req.intercept)
        {
            console.log(bodyOut)
            console.log('---')
        }
    })
}