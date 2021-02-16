import CDP from "chrome-remote-interface";
import {watchXHR} from "./watchXHR";


export const Browser = async ({port}: { port: number }) => {
    const cdpConnection = await CDP({port});

    return {
        watchXHR: () => watchXHR(cdpConnection),
        primitives: cdpConnection
    }
}
