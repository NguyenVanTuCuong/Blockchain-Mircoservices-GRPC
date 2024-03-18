import Web3, { HttpProvider } from "web3"

export const getHttpWeb3 = (
    controller?: AbortController
) : Web3 => {
    const providerOptions = controller
        ? {
            providerOptions: {
                signal: controller.signal
            }
        } : undefined
    
    const provider = new HttpProvider("https://api.baobab.klaytn.net:8651"
    , providerOptions)
    return new Web3(provider)
}
