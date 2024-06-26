// https://www.w3schools.com/howto/howto_js_tabs.asp
function openTab(id, className = "tabcontent") {
    var i, tabcontent;

    tabcontent = document.getElementsByClassName(className);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    document.getElementById(id).style.display = "block";
}
openTab("tab-game", "tabcontent-main");
openTab("tab-game-things", "tabcontent-game");
// openTab("tab-achievements");

Game.prototype.disableButtons = function () {
    for (let i = 0; i < 2; i++) {
        document.getElementById("button-things-upgrade-" + i).disabled =
            !this.thingsCanBuyUpgrade(i);
    }
    for (let i = 0; i < 4; i++) {
        document.getElementById("button-shop-" + i).disabled =
            !this.shopsCanBuyUpgrade(i);
    }
    document.getElementById("button-take").disabled =
        this.things.cmp("1e500") < 0;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(
                "button-tokens-shop-" + i + "-" + j
            ).disabled = !this.tokensShopCanBuyUpgrade(i, j);
        }
    }
};

Game.prototype.renderAmounts = function () {
    document.getElementById("amount-things").innerHTML = format(this.things);
    document.getElementById("amount-double").innerHTML = format(
        this.doubleAmount,
        2,
        true
    );
    document.getElementById("amount-take-value").innerHTML = format(
        this.takeValue,
        3,
        true
    );
    document.getElementById("amount-clicks").innerHTML = format(this.doubles);
    document.getElementById("amount-clicks-shop").innerHTML = format(
        this.doubles
    );

    document.getElementById("amount-tokens").innerHTML = format(this.tokens);
};

Game.prototype.render = function () {
    this.renderFadeElements();
    this.renderAmounts();
    this.disableButtons();

    document.getElementById("double-cooldown").style.width =
        Math.min(
            ((Date.now() - this.lastDouble) / this.doubleCooldown) * 100,
            100
        ) + "%";
    document.getElementById("status-things-upgrade-0").innerHTML = format(
        this.things
            .mul(this.doubleAmount)
            .mul(this.thingsUpgrade.levels[0])
            .mul(0.01)
    );
    document.getElementById("status-things-upgrade-1").innerHTML =
        this.doubleCooldown.toFixed(0) +
        " ms" +
        (this.thingsUpgrade.levels[1].cmp(20) >= 0 ? " (Capped)" : "");
    for (let i = 0; i < 2; i++) {
        document.getElementById("cost-things-upgrade-" + i).innerHTML = format(
            this.thingsUpgradeFinalCost(i)
        );
    }

    for (let i = 0; i < 4; i++) {
        document.getElementById("cost-shop-" + i).innerHTML =
            format(this.shop.cost[i]) +
            (this.shop.upgrades[i] ? " (Purchased)" : "");
    }

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(
                "cost-tokens-shop-" + i + "-" + j
            ).innerHTML = format(this.tokensShop.cost[i][j]);
        }
    }
};
