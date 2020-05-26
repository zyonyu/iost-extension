const BipPath = require("bip32-path");

// function debugOrNot(d, p) {
//   if (process.env.NODE_ENV === "production") {
//     return p;
//   }
//   if (process.env.NODE_ENV === "development") {
//     return d;
//   }
//   return d;
// };

function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms || 1000);
  });
};

function fail(error) {
  if (error instanceof Error) {
    console.error("App crashed -", error.message);
    console.error(error.stack);
  } else {
    console.error("Unhandled error", error);
    process.exit(2);
  }
  process.exit(1);
};


function bufferFromBip32(path) {
  const paths = path ? BipPath.fromString(path).toPathArray() : [];
  const result = Buffer.alloc(1 + paths.length * 4);
  result[0] = paths.length;
  paths.forEach((element, index) => {
    result.writeUInt32BE(element, 1 + 4 * index);
  });
  return result;
};

function callAsync(func, args) {
  return new Promise((resolve, reject) => {
    func().then(function() {
      if (args === undefined) {
        args = Object.values(arguments);
      } else if (Array.isArray(args)) {
        args = Object.values(arguments).concat(args);
      } else {
        args = Object.values(arguments).concat([args]);
      }
      resolve(args);
    }).catch(reject);
  });
};

function bufferToHex(buffer) {
  return buffer ? Array
    .from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart (2, "0"))
    .join("") : "";
};

function hexToArray(hex) {
//    var result = [];
//    while (str.length >= 8) {
//      result.push(parseInt(str.substring(0, 8), 16));
//      str = str.substring(8, str.length);
//    }
//    return result;
  if (!hex) {
    return new Uint8Array();
  }
  var array = [];
  for (var i = 0, length = hex.length; i < length; i += 2) {
    array.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(array);
}

function arrayToHex(array) {
//    let result = "";
//    let z;
//    for (var i = 0; i < arr.length; i++) {
//      let str = arr[i].toString(16);
//      z = 8 - str.length + 1;
//      str = Array(z).join("0") + str;
//      result += str;
//    }
//    return result;
  let str = "";
  if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        let hex = (array[i] & 0xff).toString(16);
        hex = (hex.length === 1) ? "0" + hex : hex;
        str += hex;
      }
  }
  return str;
}

function wordToArray(word) {
  if (word > 65535) {
    throw new RangeError("word must less 65535");
  }
  return new Uint8Array([
    (word >> 8) & 0xFF,
    word & 0xFF
  ]);
}

function arrayToWord(array) {
  if (array.length !== 2) {
    throw new RangeError("array.length must be 2");
  }
  return (array[0] << 8) | array[1];
};

function cloneInstance(obj) {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

module.exports = {
  // debugOrNot,
  delay,
  fail,
  bufferFromBip32,
  callAsync,
  bufferToHex,
  hexToArray,
  arrayToHex,
  wordToArray,
  arrayToWord,
  cloneInstance
};


