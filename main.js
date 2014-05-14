// Config 

var knownMasterPrivateKey = 'xprv9s21ZrQH143K2LvayFZWVVTomiDKheKWvnupDB8fmjKwxkKG47uvzmFa3vCXoy9fxPJhRYsU19apVfexvMeLpJQuF2XtX1zRF3eao9GqqaQ';
var number_of_keys = 100;
var number_of_workers = 4;
var work_size = Math.floor( number_of_keys / number_of_workers );
var work_remainder = number_of_keys - ( work_size * number_of_workers );

// For Loop Test

var startx = (new Date).getTime();

bitcore = require('bitcore');
HierarchicalKey = bitcore.HierarchicalKey;

var hierarchical_key = new HierarchicalKey(knownMasterPrivateKey);

var private_keys = [];
for (var i=0;i<number_of_keys;i++) {
    private_keys.push(hierarchical_key.derive('m/0/3/'+i).extendedPrivateKeyString());
}

var diffx = (new Date).getTime() - startx;
var basic = document.createElement('p');
basic.innerHTML = 'Single For-loop: ' + diffx + ' ms';
document.body.appendChild(basic);

// Web Workers Test

var private_keys = [];
var startx = (new Date).getTime();
var workers_time = [];
var workers_completed = 0;

for (var i=0;i<number_of_workers;i++){
    var worker = new Worker("main-worker.js");
    worker.onmessage = function(e) {
        var _i = i;
        private_keys.push(e.data);
        workers_completed++;
        if ( workers_completed == number_of_workers ) {
            var diffx = (new Date).getTime() - startx;
            var web = document.createElement('p');
            web.innerHTML = 'Web Workers: ' + diffx + ' ms';
            document.body.appendChild(web);
        }
    };
    var _work_size = work_size;
    if ( i == number_of_workers - 1 )
        _work_size += work_remainder;
    worker.postMessage({privkey: knownMasterPrivateKey, length: _work_size });
}    

// Notes
//  Around 84 percent of the time is spent in pointFpMultiply
//  6. /bitcore/browser/vendor/ec.js : line 199 : pointFpMultiply
//  5. /bitcore/browser/vendor/sec.js : line 142 : secp256k1
//  4. /bitcore/browser/vendor/eckey.js : line 53 : getPubPoint
//  3. /bitcore/browser/vendor/eckey.js : line 45 : getPub
//  2. /bitcore/lib/browser/Key.js : line 88 : regenerateSync
//  1. /bitcore/lib/HierarchicalKey.js : line 281 : deriveChild

