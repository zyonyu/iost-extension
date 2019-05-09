

const config = {
  defaultConfig: {
    gasRatio: 1,
    gasLimit: 100000,
    delay: 0,
    expiration: 90,
    defaultLimit: "unlimited"
  },
  nodes: [
    {
      name: 'MAINNET',
      url: 'https://api.iost.io',
      chain_id: 1024,
      defaulteExplorer: 'https://explorer.iost.io',
      explorer: 'https://www.iostabc.com',
      default: true
    },
    {
      name: 'TESTNET',
      url: 'https://test.api.iost.io',
      defaulteExplorer: 'http://54.249.186.224',
      explorer: 'http://54.249.186.224',
      chain_id: 1023,
      default: true
    }
  ],
  

}

export default config