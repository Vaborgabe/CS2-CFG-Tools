//  .d8888b.  888b     d888 8888888b.  
// d88P  Y88b 8888b   d8888 888  "Y88b 
// 888    888 88888b.d88888 888    888 
// 888        888Y88888P888 888    888 
// 888        888 Y888P 888 888    888 
// 888    888 888  Y8P  888 888    888 
// Y88b  d88P 888   "   888 888  .d88P 
//  "Y8888P"  888       888 8888888P"  

//creates command syntax exception
class commandSyntaxError extends Error {
    constructor(message) {
        super(message);
        this.name = 'commandSyntaxError';
    }
}

class commandParamError extends Error {
    constructor(message) {
        super(message);
        this.name = 'commandParamError';
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
        if(String(args[0]).toLowerCase() != 'easy' && String(args[0]).toLowerCase() != 'normal' && String(args[0]).toLowerCase() != 'hard' && String(difficulty).toLowerCase != 'expert') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');

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
        this.setArg(0, String(side).toUpperCase());
    }

    setDifficulty(difficulty) {
        if(String(difficulty).toLowerCase() != 'easy' && String(difficulty).toLowerCase() != 'normal' && String(difficulty).toLowerCase() != 'hard' && String(difficulty).toLowerCase() != 'expert') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');
        this.difficulty = String(difficulty).toLowerCase();
        this.setArg(1, String(difficulty).toLowerCase());
    }

    setBotName(name) {
        this.botName = name;
        this.setArg(2, name);
    }

    fromAddBotCT(addBotCT) {
        this.side = 'CT';
        this.difficulty = addBotCT.difficulty;
        this.botName = addBotCT.botName;
        this.setArg(0, 'CT');
        this.setArg(1, addBotCT.difficulty);
        this.setArg(2, addBotCT.botName);
    }

    fromAddBotT(addBotT) {
        this.side = 'T';
        this.difficulty = addBotT.difficulty;
        this.botName = addBotT.botName;
        this.setArg(0, 'T');
        this.setArg(1, addBotT.difficulty);
        this.setArg(2, addBotT.botName);
    }
}

class addBotCT extends command {
    constructor(difficulty, ...args) {
        if(String(difficulty).toLowerCase() != 'easy' && String(difficulty).toLowerCase() != 'normal' && String(difficulty).toLowerCase() != 'hard' && String(difficulty).toLowerCase() != 'expert') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');
        
        super('bot_add_ct', String(difficulty).toLowerCase());

        this.difficulty = String(difficulty).toLowerCase();
        this.botName;

        //if args[0] exists, set it as the bot name
        if(args[0]) {
            this.botName = args[0];
            this.setArg(1, args[0]);
        }
    }

    setDifficulty(difficulty) {
        if(String(difficulty).toLowerCase() != 'easy' && String(difficulty).toLowerCase() != 'normal' && String(difficulty).toLowerCase() != 'hard' && String(difficulty).toLowerCase() != 'expert') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');
        this.difficulty = String(difficulty).toLowerCase();
        this.setArg(0, String(difficulty).toLowerCase());
    }

    setBotName(name) {
        this.botName = name;
        this.setArg(1, name);
    }

    fromAddBot(addBot) {
        this.difficulty = addBot.difficulty;
        this.botName = addBot.botName;
        this.setArg(0, addBot.difficulty);
        this.setArg(1, addBot.botName);
    }
}

class addBotT extends command {
    constructor(difficulty, ...args) {
        if(String(difficulty).toLowerCase() != 'easy' && String(difficulty).toLowerCase() != 'normal' && String(difficulty).toLowerCase() != 'hard' && String(difficulty).toLowerCase() != 'expert') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');

        super('bot_add_t', String(difficulty).toLowerCase());

        this.difficulty = String(difficulty).toLowerCase();
        this.botName;

        //if args[0] exists, set it as the bot name
        if(args[0]) {
            this.botName = args[0];
            this.setArg(1, args[0]);
        }
    }

    setDifficulty(difficulty) {
        if(String(difficulty).toLowerCase() != 'easy' && String(difficulty).toLowerCase() != 'normal' && String(difficulty).toLowerCase() != 'hard' && String(difficulty).toLowerCase() != 'expert') throw new commandSyntaxError('addBot requires a difficulty argument of either easy, normal, hard, or expert');
        this.difficulty = String(difficulty).toLowerCase();
        this.setArg(0, String(difficulty).toLowerCase());
    }

    setBotName(name) {
        this.botName = name;
        this.setArg(1, name);
    }

    fromAddBot(addBot) {
        this.difficulty = addBot.difficulty;
        this.botName = addBot.botName;
        this.setArg(0, addBot.difficulty);
        this.setArg(1, addBot.botName);
    }

}

let crosshair = {};

crosshair.gap = class extends command {
    constructor(gap) {
        if(gap < -10 || gap > 10) throw new commandSyntaxError('Gap must be between -10 and 10');
        
        super('cl_crosshairgap', gap);

        this.gap = gap;
    }
}

crosshair.size = class extends command {
    constructor(size) {
        if(size < -20 || size > 20) throw new commandSyntaxError('Size must be between -20 and 20');

        super('cl_crosshairsize', size);

        this.size = size;
    }
}

crosshair.style = class extends command {
    constructor(style) {
        this.style;
        if(typeof style == 'string' || style instanceof String) {
            if(style.toLowerCase() == 'default') {
                this.style = 0;
            } else if (style.toLowerCase() == 'default static') {
                this.style = 1;
            } else if (style.toLowerCase() == 'classic') {
                this.style = 2;
            } else if(style.toLowerCase() == 'classic dynamic') {
                this.style = 3;
            } else if(style.toLowerCase() == 'classic static') {
                this.style = 4;
            } else if(style.toLowerCase() == 'legacy') {
                this.style = 5;
            } else throw new commandSyntaxError('Style must be either default, default static, classic, classic dynamic, classic static, legacy or a number between 0 and 5');
        } else if(style < 0 || style > 5) throw new commandSyntaxError('Style must be either default, default static, classic, classic dynamic, classic static, legacy or a number between 0 and 5');
        else this.style = style;

        super('cl_crosshairstyle', this.style);
    }

    getStr() {
        if(this.style == 0) {
            return 'default';
        } else if(this.style == 1) {
            return 'default static';
        } else if(this.style == 2) {
            return 'classic';
        } else if(this.style == 3) {
            return 'classic dynamic';
        } else if(this.style == 4) {
            return 'classic static';
        } else if(this.style == 5) {
            return 'legacy';
        } else {
            throw new commandParamError('style set to bad number in this.style, must be between 0 and 5');
        }
    }
    set(style) {
        if(typeof style == 'string' || style instanceof String) {
            if(style.toLowerCase() == 'default') {
                this.style = 0;
            } else if (style.toLowerCase() == 'default static') {
                this.style = 1;
            } else if (style.toLowerCase() == 'classic') {
                this.style = 2;
            } else if(style.toLowerCase() == 'classic dynamic') {
                this.style = 3;
            } else if(style.toLowerCase() == 'classic static') {
                this.style = 4;
            } else if(style.toLowerCase() == 'legacy') {
                this.style = 5;
            } else throw new commandSyntaxError('Style must be either default, default static, classic, classic dynamic, classic static, legacy or a number between 0 and 5');
        } else if(style < 0 || style > 5) throw new commandSyntaxError('Style must be either default, default static, classic, classic dynamic, classic static, legacy or a number between 0 and 5');
        else this.style = style;

        this.setArg(0, this.style);
    }
}

crosshair.thickness = class extends command {
    constructor(thickness) {
        //if(thickness < 0 || thickness > 6) throw new commandSyntaxError('Thickness must be between 0 and 10');

        super('cl_crosshairthickness', thickness);

        this.thickness = thickness;
    }
}
        

module.exports = {
    command,
    addBot,
    addBotCT,
    addBotT,
    crosshair
}