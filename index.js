const fs = require('fs');

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

//creates command syntax exception
class commandSyntaxError extends Error {
    constructor(message) {
        super(message);
        this.name = 'commandSyntaxError';
    }
}

class command {

    constructor(name, ...args) {
        this.name = name;
        this.args = args;
    }

    writeCFG() {
        return `${this.name} ${this.args.join(' ')}`;
    }

    writeVCFG() {
        return `${this.name}\t\t"${this.args.join(' ').replace("\"", "")}"`;
    }

    setArgs(...args) {
        this.args = args;
    }

    setArg(index, arg) {
        this.args[index] = arg;
    }

    getArg(index) {
        return this.args[index];
    }
}

class addBot extends command {
    constructor(side, ...args) {
        //confirms theres at least one argument
        if(args.length < 1) throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');
        //confirms side argument is valid
        if(String(side).toUpperCase() != 'T' && String(side).toUpperCase() != 'CT') throw new commandSyntaxError('addBot requires a side argument of either T or CT');
        //confirms difficulty argument is valid
        if(String(args[0]).toLowerCase() != 'easy' && String(args[0]).toLowerCase() != 'normal' && String(args[0]).toLowerCase() != 'hard') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');

        super('bot_add', String(side).toUpperCase(), String(args[0]).toLowerCase());

        this.side = String(side).toUpperCase();
        this.difficulty = String(args[0]).toLowerCase();
        this.botName;
        //sets name argument if it exists
        if(args[1]) {
            this.botName = args[1];
            this.setArg(2, args[1]);
        }
    }

    setSide(side) {
        if(String(side).toUpperCase() != 'T' && String(side).toUpperCase() != 'CT') throw new commandSyntaxError('addBot requires a side argument of either T or CT');
        this.side = String(side).toUpperCase();
        this.setArg(0, side);
    }

    setDifficulty(difficulty) {
        if(String(difficulty).toLowerCase() != 'easy' && String(difficulty).toLowerCase() != 'normal' && String(difficulty).toLowerCase() != 'hard') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');
        this.difficulty = String(difficulty).toLowerCase();
        this.setArg(1, difficulty);
    }

    setBotName(name) {
        this.botName = name;
        this.setArg(2, name);
    }
}

module.exports = {
    readVCFG,
    readVCFGSync,
    vcfgWriteString,
    writeVCFG,
    writeVCFGSync,
    command,
    addBot,
};