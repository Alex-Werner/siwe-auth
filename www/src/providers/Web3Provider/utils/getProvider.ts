type WindowInstanceHasEthereum = Window & typeof globalThis & { ethereum: any };

export default function getProvider() {
    const ethereum = (window as WindowInstanceHasEthereum).ethereum;

    if(!ethereum) {
        throw new Error('Ethereum not found');
    }

    // Provider field is an expected array of providers
    const providers = ethereum?.providers;
    if(Array.isArray(providers)) {
        // we search for metamask provider
        const metamaskProvider = providers.find(provider => provider.isMetaMask);
        if(metamaskProvider) {
            return metamaskProvider;
        }
    }

    // If metamask provider is not found, we return the first provider
    return ethereum;
}
