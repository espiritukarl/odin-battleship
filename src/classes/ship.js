export class Ship {
    constructor(name, length = null, hits = 0) {
        this.name = name;
        this.length = length;
        this.hits = hits;
    }

    hit() {
        if (!this.isSunk()) this.hits += 1;
    }

    isSunk() {
        return this.hits === this.length;
    }
}
