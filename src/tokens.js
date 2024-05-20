Game.prototype.tokensShopCanBuyUpgrade = function(i, j) {
    if (this.tokensShop.upgrades[i][j]) return false;
    if (this.tokens.cmp(this.tokensShop.cost[i][j]) < 0) return false;
    if (j > 0 && !this.tokensShop.upgrades[i][j - 1]) return false;
    return true;
}

Game.prototype.tokensShopBuyUpgrade = function(i, j) {
    if (!this.tokensShopCanBuyUpgrade(i, j)) return false;
    this.tokensShop.upgrades[i][j] = true;
    this.tokens = this.tokens.sub(this.tokensShop.cost[i][j]);
    return true;
}