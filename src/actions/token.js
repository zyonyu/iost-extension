import { UPDATE_SAVED_TOKEN_SYMBOLS, SELECT_TOKEN, SELECT_NFT } from 'actions/actionTypes'

export const updateSavedTokenSymbols = tokenSymbols => ({
  type: UPDATE_SAVED_TOKEN_SYMBOLS,
  payload: {
    tokenSymbols,
  },
})

export const selectToken = tokenSymbol => ({
  type: SELECT_TOKEN,
  payload: {
    tokenSymbol: tokenSymbol,
  },
})

export const selectNft = nftId => ({
  type: SELECT_NFT,
  payload: {
    nftId: nftId,
  },
})
