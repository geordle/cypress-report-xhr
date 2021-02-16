const {Browser} = require("./cdp");
const {writeFile} = require("fs");

let currentClient;

const logs = {};

function install(on, filter, options = {}) {
    on('before:browser:launch', browserLaunchHandler);
    on('after:run', writeLogs);
    on('after:spec', async (spec) => {
        logs[spec.relative] = await currentClient.values();
    });
    on('task', {
        "set:testcontext"(attributes) {
            currentClient.setMetadata(attributes);
            return null;
        }
    })
}



module.exports = {install}

async function writeLogs() {
    writeFile("cypress/results/file.json", JSON.stringify(logs, null, 2), console.log);
}

function browserLaunchHandler(browser = {}, launchOptions) {
    const args = launchOptions.args || launchOptions
    const port = ensureRdpPort(args)
    tryCreateClient(port);
    return launchOptions;
}

async function tryCreateClient(port) {
    for (let i = 0; i < attempts; i++) {
        try {
            const {watchXHR} = await Browser({port});
            currentClient = await watchXHR();
            return;
        } catch (e){
            await timeout(200);
        }
    }
}

const attempts = 10;

const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time);
})

function ensureRdpPort(args) {
    const existing = args.find(
        (arg) => arg.slice(0, 23) === '--remote-debugging-port',
    )
    if (existing) {
        return Number(existing.split('=')[1])
    }
    const port = 40000 + Math.round(Math.random() * 25000)
    args.push(`--remote-debugging-port=${port}`)
    return port
}
