// Log headers
export function logHeaders(raw : string[]) : void
{
    for (let i = 0; i < raw.length; i += 2)
    {
        console.log(`${raw[i]}: ${raw[i+1]}`)
    }
}