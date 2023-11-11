const fs = require('fs');
const cmd = require('./command.js');

// 888     888 88888888888 8888888 888      
// 888     888     888       888   888      
// 888     888     888       888   888      
// 888     888     888       888   888      
// 888     888     888       888   888      
// 888     888     888       888   888      
// Y88b. .d88P     888       888   888      
//  "Y88888P"      888     8888888 88888888

//this is just so I dont have to write a for loop every time I want to add tabs
function tabulator(depth, val) {
    let str = '';
    for (let i = 0; i < depth; i++) {
        str += '\t';
    }
    str += val;
    return str;
}

// db    db  .o88b. d88888b  d888b    d88888b d888888b db      d88888b 
// 88    88 d8P  Y8 88'     88' Y8b   88'       `88'   88      88'     
// Y8    8P 8P      88ooo   88        88ooo      88    88      88ooooo 
// `8b  d8' 8b      88~~~   88  ooo   88~~~      88    88      88~~~~~ 
//  `8bd8'  Y8b  d8 88      88. ~8~   88        .88.   88booo. 88.     
//    YP     `Y88P' YP       Y888P    YP      Y888888P Y88888P Y88888P

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

//Traverses vcfg object and builds string
function vcfgWriteString(obj, depth) {
    let str = '';
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let value = obj[key];
            if (typeof value === 'object') {
                str += tabulator(depth, `\"${key}\"\n`);
                str += tabulator(depth, `{\n`);
                str += vcfgWriteString(value, depth + 1);
                str += tabulator(depth, `}\n`);
            } else {
                str += tabulator(depth, `\"${key}\"\t\t\"${value}\"\n`);
            }
        }
    }
    return str;
}
//writes vcfg file
function writeVCFG(path, obj) {
    fs.writeFile(path, vcfgWriteString(obj, 0), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
function writeVCFGSync(path, obj) {
    fs.writeFileSync(path, vcfgWriteString(obj, 0));
}

class GSI {
    constructor(options) {
        this.name = "Gamestate Integration Config File";
        this.uri = null;
        this.timeout = null;
        this.buffer = null;
        this.throttle = null;
        this.heartbeat = null;
        this.auth = null;
        this.data = [];

        if(options.name) this.name = options.name;
        if(options.uri) this.uri = options.uri;
        if(options.timeout) this.timeout = options.timeout;
        if(options.buffer) this.buffer = options.buffer;
        if(options.throttle) this.throttle = options.throttle;
        if(options.heartbeat) this.heartbeat = options.heartbeat;
        if(options.auth) this.auth = options.auth;
        if(options.data) this.data = options.data;
    }

    addData(data) {
        this.data.push(data);
    }

    removeData(data) {
        this.data.splice(this.data.indexOf(data), 1);
    }

    write(path) {
        let obj = {};
        if(this.uri || this.timeout || this.buffer || this.throttle || this.heartbeat) obj[this.name] = {};
        if(this.uri) obj[this.name]["uri"] = this.uri;
        if(this.timeout) obj[this.name]["timeout"] = this.timeout;
        if(this.buffer) obj[this.name]["buffer"] = this.buffer;
        if(this.throttle) obj[this.name]["throttle"] = this.throttle;
        if(this.heartbeat) obj[this.name]["heartbeat"] = this.heartbeat;
        if(this.auth) obj[this.name]["auth"] = this.auth;
        if(this.data.length > 0) {
            obj[this.name]["data"] = {};
            for(let i = 0; i < this.data.length; i++) {
                obj[this.name]["data"][this.data[i]] = 1;
            }
        }

        writeVCFG(path, obj);
    }
}

module.exports = {
    readVCFG,
    readVCFGSync,
    vcfgWriteString,
    writeVCFG,
    writeVCFGSync,
    cmd,
    GSI
};