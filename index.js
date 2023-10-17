const fs = require('fs');

async function readVCFG(path, callback) {
    //reads vcfg file
    const vcfg = fs.readFile(path, 'utf8', (err, data) => {
        //throw err;
        if (err) throw err;

        // removes all new lines, returns, tabs
        data = data.replace(/(\r\n|\n|\r|\t)/gm, "");

        //splits data into array of quoted keys and values and brackets
        data = data.match(/"([^"]*)"|[{}]/g);

        data = parseVCFG(data);

        callback(data);
    });
}

function readVCFGSync(path) {
    //reads vcfg file
    let vcfg = fs.readFileSync(path, 'utf8');

    // removes all new lines, returns, tabs
    vcfg = vcfg.replace(/(\r\n|\n|\r|\t)/gm, "");

    //splits data into array of quoted keys and values and brackets
    vcfg = vcfg.match(/"([^"]*)"|[{}]/g);

    return parseVCFG(vcfg);
}

function parseVCFG(array) {
    let parsedOBJ = {};
    while (array.length > 0) {
        let key = array.shift();
        let value = array.shift();

        //removes end bracket
        if(key == '}') continue;

        //removes quotes
        key = key.replace(/["]+/g, '');

        //handles nested objects
        if (value == '{') {
            let nested = [];
            let i = 1
            while(i > 0) {
                let next = array.shift();
                nested.push(next);
                if (next == '{') i++;
                if (next == '}') i--;
            }
            value = parseVCFG(nested);
        } else {
            //removes quotes
            value = value.replace(/["]+/g, '');
        }
        parsedOBJ[key] = value;
    }
    return parsedOBJ;
}

module.exports = {
    readVCFG,
    readVCFGSync
};