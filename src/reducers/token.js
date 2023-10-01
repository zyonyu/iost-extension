import { UPDATE_SAVED_TOKEN_SYMBOLS, SELECT_TOKEN, SELECT_NFT } from 'actions/actionTypes'

import { DEFAULT_TOKEN_LIST } from 'constants/token'

const initialState = {
  savedTokenSymbols: DEFAULT_TOKEN_LIST,
  selectedTokenSymbol: 'iost',
  selectedNFT: '',
}

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SAVED_TOKEN_SYMBOLS:
      return {
        ...state,
        savedTokenSymbols: action.payload.tokenSymbols,
      }
    case SELECT_TOKEN:
      return {
        ...state,
        selectedTokenSymbol: action.payload.tokenSymbol,
      }
    case SELECT_NFT:
      return {
        ...state,
        selectedNFT: action.payload.nftId,
      }
    default:
      return state
  }
}

export default tokenReducer
