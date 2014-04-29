var Console = function(){};
Console.prototype.log = function(e){};
var console = new Console();
var Window = function(){};
var window = new Window();

importScripts('bundle.js');
importScripts('crypto-2.0.js');

var derive_extended_private_keys = function (e) {

    bitcore = require('bitcore');
    BIP32 = bitcore.BIP32;

    var bip32 = new BIP32(e.data['privkey']);
    var keys = [];
    for (var i=0;i<e.data['length'];i++) {
        keys.push(bip32.derive('m/0/3/'+i).extendedPrivateKeyString());
    }
    postMessage(keys);
}


onmessage = derive_extended_private_keys;
