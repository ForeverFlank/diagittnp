class Game {
    constructor() {
        this.things = new Decimal(1);
        this.doubles = new Decimal(0);
        this.doubleAmount = new Decimal(2);
        this.maxThings = new Decimal(1);
        this.lastDouble = 0;
        this.thingsUpgrade = {
            levels: [0, 0].map((x) => new Decimal(x)),
            cost: [1000, 1e5].map((x) => new Decimal(x)),
            costStep: [10, 1e5].map((x) => new Decimal(x)),
        };
        this.shops = {
            upgrades: [false, false, false, false],
            cost: [1e40, 1e80, 1e150, "1e330"].map((x) => new Decimal(x)),
        };

        this.takes = new Decimal(0);
        this.takeTotal = new Decimal(1);
        this.takeValue = new Decimal(1);
        this.tokens = new Decimal(0);
        this.tokenShops = {
            upgrades: [false, false, false, false],
            cost: [3, 6, 10, 30, 100].map((x) => new Decimal(x)),
        }


        this.uiStates = {
            buttonTakeFaded: false,
            menuThingsUpgradeFaded: false,
            menuShopFaded: false,
            menuShopGridFaded: false,
        };

        this.doubleCooldown = 1000;
        this.achievements = new Set();
    }
    update(deltaTime) {
        deltaTime = deltaTime / 1000;
        this.doubleAmount = new Decimal(2)
            .add(this.shops.upgrades[0] ? 0.1 : 0)
            .add(this.shops.upgrades[1] ? 1 : 0)
            .add(this.shops.upgrades[2] ? this.doubles.div(100) : 0)
            .pow(this.takeTotal);
        if (this.things.cmp("1e500") >= 0) {
            this.takeValue = this.things
                .log(10)
                .div(500)
                .add(1)
                .log(10)
                .add(1)
                .pow(3 / 4);
        } else {
            this.takeValue = new Decimal(1);
        }
        this.autobuy();

        if (this.maxThings.cmp(this.things) < 0) this.maxThings = this.things;
        if (this.thingsUpgrade.levels[0].cmp(0) > 0) {
            this.things = this.things.add(
                this.things
                    .mul(this.doubleAmount)
                    .mul(this.thingsUpgrade.levels[0])
                    .mul(0.01)
                    .mul(deltaTime)
            );
        }
    }
    double() {
        if ((Date.now() - this.lastDouble) / this.doubleCooldown < 1) return;
        this.things = this.things.mul(this.doubleAmount);
        this.doubles = this.doubles.add(1);
        this.lastDouble = Date.now();
    }
    take() {
        if (this.things.cmp(new Decimal("1e500")) < 0) return;
        this.takeTotal = this.takeTotal.mul(this.takeValue);
        this.things = new Decimal(1);
        this.maxThings = new Decimal(1);
        this.doubles = new Decimal(0);
        this.lastDouble = 0;
        this.doubleCooldown = 1000;
        this.thingsUpgrade.levels = [0, 0].map((x) => new Decimal(x));
        this.shops.upgrades = [false, false, false, false];

        this.takes = this.takes.add(1);
        this.tokens = this.tokens.add(1);
    }
    thingsUpgradeFinalCost(n) {
        return this.thingsUpgrade.cost[n].mul(
            this.thingsUpgrade.costStep[n].pow(this.thingsUpgrade.levels[n])
        );
    }
    thingsCanBuyUpgrade(n) {
        if (this.things.cmp(this.thingsUpgradeFinalCost(n)) < 0) return false;
        if (n == 1) {
            if (this.thingsUpgrade.levels[1].cmp(20) >= 0) return false;
        }
        return true;
    }
    thingsBuyUpgrade(n) {
        if (!this.thingsCanBuyUpgrade(n)) return;
        this.things = this.things.sub(this.thingsUpgradeFinalCost(n));
        if (this.things.cmp(1) < 0) this.things = new Decimal(1);
        this.thingsUpgrade.levels[n] = this.thingsUpgrade.levels[n].add(1);
        if (n == 1) {
            if (this.thingsUpgrade.levels[1].cmp(20) >= 0) {
                this.doubleCooldown = 125;
            } else {
                this.doubleCooldown =
                    1000 * 0.9 ** this.thingsUpgrade.levels[1].mag;
            }
        }
    }
    shopsCanBuyUpgrade(n) {
        if (this.things.cmp(this.shops.cost[n]) < 0) return false;
        if (this.shops.upgrades[n]) return false;
        return true;
    }
    shopsBuyUpgrade(n) {
        if (!this.shopsCanBuyUpgrade(n)) return;
        this.things = this.things.sub(this.shops.cost[n]);
        if (this.things.cmp(1) < 0) this.things = new Decimal(1);
        this.shops.upgrades[n] = true;
    }
}

var game = new Game();
