const Ledger = require("./ledger");
const IOST = require('iost')
const Utils = require("./utils");
const sha3 = require('sha3');
import * as userActions from 'actions/user'
// const IOST = require('../../../iost.js')
import store from '../store'

const DEFAULT_IOST_CONFIG = {
    gasPrice: 100,
    gasLimit: 100000,
    delay: 0,
}
const IOST_NODE_URL = 'https://api.iost.io'
const IOST_PROVIDER = new IOST.HTTPProvider(IOST_NODE_URL)

const rpc = new IOST.RPC(IOST_PROVIDER);
const iost = new IOST.IOST(DEFAULT_IOST_CONFIG, IOST_PROVIDER);
const ledger = new Ledger("IOST", "u2f");

function SendTrx(trx) {
    const fire = {
        pending: () => { },
        success: () => { },
        failed: () => { },
    }

    const handler = new IOST.TxHandler(trx, rpc)



    handler
        .onPending((pending) => {
            console.log(pending)
        })
        .onSuccess(async (response) => {
            console.log(response)
        })
        .onFailed((err) => {
            console.log(err)
        })
        .send()
        .listen(1000, 60)

    return {
        onPending: (callback) => {
            fire.pending = callback
            return handler
        },
        onSuccess: (callback) => {
            fire.success = callback
            return handler
        },
        onFailed: (callback) => {
            fire.failed = callback
            return handler
        }
    }
}

// 打开ledger，用户输入ledger pin码后返回结果
ledger.open().then(async () => {
    //初始账号
    const keyPair = new IOST.KeyPair(IOST.Bs58.decode(key));
    const account = new IOST.Account(name);
    account.addKeyPair(keyPair, "owner");
    account.addKeyPair(keyPair, "active");
    iost.setAccount(account);

}).then(ledger.close).catch(() => {
    //初始账号

});

store.dispatch(userActions.setCreaterList([{
    key: "5w39KtYEUHTPnqJNxerBxmWHvF6fgfbGenHR2rmKe5wcUEaM8tWV9K3UACnpBrBQtzhB3cSKD8FeriGojJku4JsJ",
    name: "testnetiost"
}]))


const ledgerInstance = {
    account: new IOST.Account('empty'),
    key: "CRaKeYKUwRQsKnpNAMWcW7uNQ2WQwWzYQZJ5CL3AS3BQ",
    name: "testnetiost",
    pubKeyB: "AJSDKFJALKSDJ12412KLFGSDGDSFJ51L",
    ledger: ledger,
    getPublicKey: async () => {
        // Redux dispatch
        // return ledgerInstance.pubKeyB;


        const pubKeyB = await ledgerInstance.ledger.getPublicKey({ index: 0, p2: ledger.P1P2.BASE58 }); //从ledger里获得一个公钥
        ledgerInstance.pubKeyB = pubKeyB;
        return pubKeyB;
    },
    newAccount: (nameB, name, pubKey) => {
        const trx = iost.newAccount(
            nameB,
            name,
            pubKey,
            pubKey,
            1,
            0
        );
        trx.addApprove("iost", "20");
        iost.currentAccount.signTx(trx);
        return SendTrx(trx)
    },
    initAccount: (nameB) => {
        const trx2 = iost.callABI(
            "token.iost",
            "transfer",
            ["iost", ledgerInstance.name, nameB, "0.11", ""]
        );
        trx2.addApprove("iost", 3)
        iost.currentAccount.signTx(trx2);
        return SendTrx(trx2)
    },
    sendTransaction: async (token, accountName, to, amount, memo) => {
        const trx3 = iost.callABI(
            "token.iost",
            "transfer",
            [token, accountName, to, amount, memo]
        );
        trx3.addApprove("iost", 3)
        const sha = sha3.SHA3(256);
        sha.update(trx3._bytes(1));
        let message = sha.digest("binary");
        let signature = await ledger.signMessage({
            index: 0,
            message: message
        })
        //调用ledger的signMessage，用户确认后返回
        signature = {
            algorithm: IOST.Algorithm.Ed25519,
            pubkey: IOST.Bs58.decode(ledgerInstance.pubKeyB.base58),
            sig: signature.bin
        };

        trx3.publisher = accountName;
        trx3.publisher_sigs.push(Object.assign(new IOST.Signature(), signature));

        return SendTrx(trx3)
    }

}

export default ledgerInstance