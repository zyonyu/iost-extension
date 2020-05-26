const Ledger = require("./ledger");
const IOST = require('iost')
const Utils = require("./utils");
const sha3 = require('sha3');

const DEFAULT_IOST_CONFIG = {
    gasPrice: 100,
    gasLimit: 100000,
    delay: 0,
  }
const IOST_NODE_URL = 'https://api.iost.io'
const IOST_PROVIDER = new IOST.HTTPProvider(IOST_NODE_URL)

const rpc = new IOST.RPC(IOST_PROVIDER);
const iost = new IOST.IOST(DEFAULT_IOST_CONFIG, IOST_PROVIDER);
const ledger = new Ledger("IOST", "hid");

function SendTrx(trx) {
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
}

// 打开ledger，用户输入ledger pin码后返回结果
ledger.open().then(async() => {
    //初始账号
    key = "5w39KtYEUHTPnqJNxerBxmWHvF6fgfbGenHR2rmKe5wcUEaM8tWV9K3UACnpBrBQtzhB3cSKD8FeriGojJku4JsJ"
    name = "testnetiost"
    const keyPair = new IOST.KeyPair(IOST.Bs58.decode(key));
    const account = new IOST.Account(name);
    account.addKeyPair(keyPair, "owner");
    account.addKeyPair(keyPair, "active");
    iost.setAccount(account);

    //使用ledger创建账号示例
    const pubKeyB = await ledger.getPublicKey({index: 0, p2: ledger.P1P2.BASE58}); //从ledger里获得一个公钥
    const prefix = Date.now().toString();
    const nameB = "u" + prefix.substr(prefix.length - 8) + "a";

    const trx = iost.newAccount(
      nameB,
      name,
      pubKeyB.base58,
      pubKeyB.base58,
      1,
      0
    );
    trx.addApprove("iost", "20");
    iost.currentAccount.signTx(trx);
    SendTrx(trx)

    // 初始化账号b
    const trx2 = iost.callABI(
        "token.iost",
        "transfer",
        ["iost", name, nameB, "0.11", ""]
      );
    trx2.addApprove("iost", 3)
    iost.currentAccount.signTx(trx2);
    SendTrx(trx2)

    //使用ledger转账
    const trx3 = iost.callABI(
        "token.iost",
        "transfer",
        ["iost", nameB, name, "0.11", ""]
      );
      trx3.addApprove("iost", 3)

      const sha = sha3.SHA3(256);
      sha.update(trx3._bytes(1));
      let message =  sha.digest("binary");
    let signature = await ledger.signMessage({
        index: 0,
        message: message
    }) //调用ledger的signMessage，用户确认后返回
    signature = {
        algorithm: IOST.Algorithm.Ed25519,
        pubkey: IOST.Bs58.decode(pubKeyB.base58),
        sig: signature.bin
      };

    trx3.publisher = nameB;
    trx3.publisher_sigs.push(Object.assign(new IOST.Signature(), signature));

    SendTrx(trx3)
}).then(ledger.close).catch(Utils.fail);