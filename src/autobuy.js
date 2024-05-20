Game.prototype.autobuy = function() {
    if (this.shop.upgrades[3]) {
        this.thingsBuyUpgrade(0);
    }
}