import {
    Client,
    Network,
    RequestPostData,
    RequestWillBeSentMessage,
    ResponseBody,
    ResponseReceivedMessage
} from "chrome-remote-interface";

interface RequestLogData {
    error?: any;
    metadata?: unknown;
    postData?: Promise<RequestPostData>;
    request?: RequestWillBeSentMessage;
    response?: ResponseReceivedMessage;
    responseBody?: Promise<ResponseBody>;
}

interface Filterable {
    type: string;
}

const watch = function (network: Network, {filter}: { filter: (el?: Filterable) => boolean }) {
    const requests = new Map<string, RequestLogData>();
    let metadata: unknown;
    const requestFilter = <T extends Filterable>(cb: (params: T) => void) => (params: T) => {
        const shouldLog = filter?.(params) ?? true;
        if (!shouldLog) {
            return;
        }
        cb(params);
    }

    network.requestWillBeSent(requestFilter((params) => {
        const {requestId} = params;
        const networkAction = requests.get(requestId) || {};
        networkAction.request = params;
        networkAction.metadata = metadata;
        requests.set(requestId, networkAction);
        if (params.request.method === "POST") {
            networkAction.postData = network.getRequestPostData({requestId});
        }
    }));

    network.responseReceived(requestFilter((params) => {
        const {requestId} = params;
        const networkAction = requests.get(requestId) || {};
        networkAction.response = params;
        requests.set(requestId, networkAction);
    }));

    network.loadingFinished(async ({requestId}) => {
        const networkAction = requests.get(requestId);
        if (!networkAction) {
            return;
        }
        requests.set(requestId, networkAction);
        networkAction.responseBody = network.getResponseBody({requestId});
    })

    network.loadingFailed((error) => {
        const {requestId} = error;
        const networkAction = requests.get(requestId) || {};
        requests.set(requestId, networkAction);
        networkAction.error = error;
    })

    return {
        values() {
            return Promise.all([...requests.values()].map(async request => ({
                ...request,
                postData: await request.postData,
                responseBody: await request.responseBody
            })));
        },
        setMetadata(value: unknown){
            metadata = value;
        }
    }
};

export const watchXHR = async ({Network}: Client) => {
    await Network.enable();

    return watch(Network, {
        filter: (req) => {
            return req?.type === "Fetch"
        }
    });
}
