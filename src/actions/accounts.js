import {
  SET_ACCOUNTS,
  ADD_ACCOUNTS,
  ADD_ACCOUNT,
  DEL_ACCOUNT,
  SET_WALLET_ACCOUNTS,
} from 'actions/actionTypes'

export const setAccounts = (accounts) => ({
  type: SET_ACCOUNTS,
  payload: {
    accounts: accounts,
  }
})

export const addAccounts = (accounts) => ({
  type: ADD_ACCOUNTS,
  payload: {
    accounts: accounts,
  }
})

export const addAccount = (account) => ({
  type: ADD_ACCOUNT,
  payload: {
    account: account,
  }
})

export const delAccount = (account) => ({
  type: DEL_ACCOUNT,
  payload: {
    account: account,
  }
})

export const setWalletAccounts = (walletAccounts) => ({
  type: SET_WALLET_ACCOUNTS,
  payload: {
    walletAccounts: walletAccounts,
  }
})