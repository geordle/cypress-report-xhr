declare module "chrome-remote-interface" {
    export default function CDP(options: { port: number }): Promise<Client>;
}

interface RequestPostData {
    postData: string;
}

interface ResponseBody {
    body: string;
    base64Encoded: boolean;
}

export interface Network {
    enable(): Promise<void>;

    requestWillBeSent(on: (params: RequestWillBeSentMessage) => void): void;

    responseReceived(p: (params: ResponseReceivedMessage) => void): void;

    getRequestPostData(requestId: { requestId: string }): Promise<RequestPostData>;

    getResponseBody(requestId: { requestId: string }): Promise<ResponseBody>;
}

interface Headers {
    [key: string]: string
}

interface Timing {
    requestTime: number;
    proxyStart: number;
    proxyEnd: number;
    dnsStart: number;
    dnsEnd: number;
    connectStart: number;
    connectEnd: number;
    sslStart: number;
    sslEnd: number;
    workerStart: number;
    workerReady: number;
    workerFetchStart: number;
    workerRespondWithSettled: number;
    sendStart: number;
    sendEnd: number;
    pushStart: number;
    pushEnd: number;
    receiveHeadersEnd: number;
}

interface ResponseLog {
    url: string;
    status: number;
    statusText: string;
    headers: Headers;
    mimeType: string;
    requestHeaders: Headers;
    connectionReused: boolean;
    connectionId: number;
    remoteIPAddress: string;
    remotePort: number;
    fromDiskCache: boolean;
    fromServiceWorker: boolean;
    fromPrefetchCache: boolean;
    encodedDataLength: number;
    timing: Timing;
    responseTime: number;
    protocol: string;
    securityState: string;
}

interface ResponseReceivedMessage {
    requestId: string;
    loaderId: string;
    timestamp: number;
    type: string;
    response: ResponseLog;
    frameId: string;
}

interface ReqResType {
    type: string;
    frameId: string;
}


interface RequestLog {
    url: string;
    method: string;
    headers: Headers;
    mixedContentType: string;
    initialPriority: string;
    referrerPolicy: string;
}

interface Initiator {
    type: string;
}

interface RequestWillBeSentMessage {
    requestId: string;
    loaderId: string;
    documentURL: string;
    request: RequestLog;
    timestamp: number;
    wallTime: number;
    initiator: Initiator;
    type: string;
    frameId: string;
    hasUserGesture: boolean;
}


interface Page {
    loadEventFired(): Promise<unknown>;

    navigate(p: { url: string }): Promise<unknown>
}

interface Client {
    Page: Page;
    Network: Network;
}

