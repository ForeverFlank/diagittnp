Game.prototype.autobuy = function() {
    if (this.shops.upgrades[3]) {
        this.thingsBuyUpgrade(0);
    }
}