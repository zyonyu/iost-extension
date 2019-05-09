import ext from "./ext";

// module.exports = (ext.storage.sync ? ext.storage.sync : ext.storage.local);
const storage = ext.storage.local


export default storage