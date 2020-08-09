import Web3ProviderEngine from "web3-provider-engine"
import WebsocketSubprovider from "web3-provider-engine/subproviders/websocket"
import CacheSubprovider from "web3-provider-engine/subproviders/cache"
import { getWsUrl } from "./utils"

const DEFAULT_NUM_ADDRESSES_TO_FETCH = 15

export class AbstractHardwareWalletConnector extends Web3ProviderEngine {
  provider
  defaultAccount = ""

  constructor(provider) {
    super()
    this.provider = provider
    this.addProvider(this.provider)
    this.addProvider(new CacheSubprovider())
    this.addProvider(
      new WebsocketSubprovider({ rpcUrl: getWsUrl(), debug: false })
    )
  }

  enable = async () => {
    this.start()

    return await this.getAccount()
  }

  getAccounts = async () => {
    return await this.provider.getAccountsAsync(DEFAULT_NUM_ADDRESSES_TO_FETCH)
  }

  setProvider = (provider) => {
    this.provider = provider
  }

  getProvider = () => {
    return this.provider
  }

  getAccount = async () => {
    return [this.defaultAccount]
  }
}
