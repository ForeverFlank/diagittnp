Game.prototype.saveGame = function () {
    let saveData = {
        things: this.things,
        doubles: this.doubles,
        maxThings: this.maxThings,
        lastDouble: this.lastDouble,

        takes: this.takes,
        takeTotal: this.takeTotal,
        tokens: this.tokens,

        thingsUpgrade: { levels: this.thingsUpgrade.levels },
        shops: { upgrades: this.shops.upgrades },

        doubleCooldown: this.doubleCooldown,
        achievements: Array.from(this.achievements),
    };
    let serializedData = JSON.stringify(saveData);
    localStorage.setItem("DIAGITTNP_save", serializedData);
};

Game.prototype.loadGame = function () {
    let serializedData = localStorage.getItem("DIAGITTNP_save");
    let parsedData = JSON.parse(serializedData);
    // blackbox ai future proof
    if (parsedData && parsedData.achievements) {
        parsedData.achievements = new Set(parsedData.achievements);
    }
    if (parsedData && parsedData.things) {
        parsedData.things = new Decimal(parsedData.things);
    }
    if (parsedData && parsedData.maxThings) {
        parsedData.maxThings = new Decimal(parsedData.maxThings);
    }
    if (parsedData && parsedData.doubles) {
        parsedData.doubles = new Decimal(parsedData.doubles);
    }

    if (parsedData && parsedData.takes) {
        parsedData.takes = new Decimal(parsedData.takes);
    }
    if (parsedData && parsedData.takeTotal) {
        parsedData.takeTotal = new Decimal(parsedData.takeTotal);
    }
    if (parsedData && parsedData.tokens) {
        parsedData.tokens = new Decimal(parsedData.tokens);
    }

    if (parsedData && parsedData.thingsUpgrade) {
        Object.keys(parsedData.thingsUpgrade).forEach((key) => {
            if (
                parsedData.thingsUpgrade[key] &&
                Array.isArray(parsedData.thingsUpgrade[key])
            ) {
                parsedData.thingsUpgrade[key] = parsedData.thingsUpgrade[
                    key
                ].map((x) => new Decimal(x));
            }
        });
    }

    if (parsedData && parsedData.shops) {
        Object.keys(parsedData.shops).forEach((key) => {
            if (
                key !== "upgrades" &&
                parsedData.shops[key] &&
                Array.isArray(parsedData.shops[key])
            ) {
                parsedData.shops[key] = parsedData.shops[key].map(
                    (x) => new Decimal(x)
                );
            }
        });
    }

    for (const key in parsedData) {
        if (this.hasOwnProperty(key) && parsedData[key] !== undefined) {
            // console.log(this[key], parsedData[key])
            if (
                typeof parsedData[key] === "object" &&
                !(parsedData[key] instanceof Set)
            ) {
                for (const key2 in parsedData[key]) {
                    this[key][key2] = parsedData[key][key2];
                }
            } else {
                this[key] = parsedData[key];
            }
        }
    }

    console.log(parsedData);
};

Game.prototype.resetGame = function () {
    localStorage.setItem("DIAGITTNP_save", "{}");
    game = new Game();
};
