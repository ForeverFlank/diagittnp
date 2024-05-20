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
        this.shop = {
            upgrades: [false, false, false, false],
            cost: [1e40, 1e80, 1e150, "1e330"].map((x) => new Decimal(x)),
        };

        this.takes = new Decimal(0);
        this.takeTotal = new Decimal(1);
        this.takeValue = new Decimal(1);
        this.tokens = new Decimal(0);
        this.tokensShop = {
            upgrades: [
                [false, false, false],
                [false, false, false],
            ],
            cost: [
                [2, 6, 18],
                [4, 12, 36],
            ].map((x) => x.map((y) => new Decimal(y))),
        };

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
            .add(this.shop.upgrades[0] ? 0.1 : 0)
            .add(this.shop.upgrades[1] ? 1 : 0)
            .add(this.shop.upgrades[2] ? this.doubles.div(100) : 0)
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
            let firstUpgradeAmount = this.thingsUpgrade.levels[0];
            let firstUpgradeGain = this.things.mul(this.doubleAmount);
            let firstUpgradeFactor;
            if (this.tokensShop.upgrades[0][1]) {
                firstUpgradeFactor = new Decimal(1.1)
                    .pow(firstUpgradeAmount)
                    .sub(1);
            } else if (this.tokensShop.upgrades[0][0]) {
                firstUpgradeFactor = new Decimal(1.01)
                    .pow(firstUpgradeAmount)
                    .sub(1);
            } else {
                firstUpgradeFactor = firstUpgradeAmount.mul(0.01);
            }
            this.things = this.things.add(
                firstUpgradeGain.mul(firstUpgradeFactor).mul(deltaTime)
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
        this.shop.upgrades = [false, false, false, false];

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
        if (this.things.cmp(this.shop.cost[n]) < 0) return false;
        if (this.shop.upgrades[n]) return false;
        return true;
    }
    shopsBuyUpgrade(n) {
        if (!this.shopsCanBuyUpgrade(n)) return;
        this.things = this.things.sub(this.shop.cost[n]);
        if (this.things.cmp(1) < 0) this.things = new Decimal(1);
        this.shop.upgrades[n] = true;
    }
}

var game = new Game();
