import { mod } from "./util.js";

class BlackWhiteAutomaton2D {
    /**
     * Note: x is the major axis, so the board needs to be rendered in columns then rows
     * @type {boolean[][]}
     */
    board;
    /**
     * @type {{[state in 'true' | 'false']: {[neighbors: number]: true}}}
     */
    rules;
    /**
     * @type {boolean}
     */
    wrap;

    get width() {
        return this.board.length;
    }
    get height() {
        return this.board[0].length;
    }

    /**
     * @param {Parameters<BlackWhiteAutomaton2D['createBoard']>[0]} boardSize 
     * @param {BlackWhiteAutomaton2D['rules']} rules 
     * @param {BlackWhiteAutomaton2D['wrap']} wrap
     */
    constructor(boardSize, rules, wrap) {
        this.board = this.createBoard(boardSize);
        this.rules = rules;
        this.wrap = wrap;
    }

    createBoard({width, height} = {width: this.width, height: this.height}) {
        return new Array(width).fill(null).map(() => new Array(height).fill(false));
    }

    /** @type {number[][] | undefined} */
    _sumBoard;

    iterate() {
        if (this._sumBoard === undefined) {
            this._sumBoard = new Array(this.width).fill(null).map(() => new Array(this.height).fill(0));
        }
        else {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    this._sumBoard[x][y] = 0;
                }
            }
        }
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.board[x][y]) {
                    if (this.wrap) {
                        for (let i = -1; i < 2; i++) {
                            for (let j = -1; j < 2; j++) {
                                if (!(i === 0 && j === 0)) {
                                    this._sumBoard[mod(x + i, this.width)][mod(y + j, this.height)]++;
                                }
                            }
                        }
                    }
                    else {
                        for (let i = -1; i < 2; i++) {
                            for (let j = -1; j < 2; j++) {
                                if (!(x + i < 0 || x + i >= this.width || y + j < 0 || y + j >= this.height || (i === 0 && j === 0))) {
                                    this._sumBoard[x + i][y + j]++;
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.board[x][y] = this.rules[this.board[x][y]][this._sumBoard[x][y]] === true;
            }
        }
    }

    randomize() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.board[x][y] = Math.random() < 0.5;
            }
        }
    }
}

export class ConwaysGameOfLife extends BlackWhiteAutomaton2D {
    /**
     * @param {Parameters<ConwaysGameOfLife['createBoard']>[0]} boardSize 
     * @param {ConwaysGameOfLife['wrap']} wrap
     */
    constructor(boardSize, wrap) {
        super(
            boardSize,
            {
                [true]: {2: true, 3: true},
                [false]: {3: true}
            },
            wrap
        );
    }
}