function fadeIn(id, duration = 2000, display = "block") {
    document.getElementById(id).style.display = display;
    document.getElementById(id).animate([{ opacity: "0" }, { opacity: "1" }], {
        duration: duration,
        iterations: 1,
    });
}
function fadeOut(id, duration = 2000) {
    document.getElementById(id).animate([{ opacity: "1" }, { opacity: "0" }], {
        duration: duration,
        iterations: 1,
    });
    setTimeout(function () {
        document.getElementById(id).style.display = "none";
    }, duration);
}

Game.prototype.renderFadeElements = function () {
    if (this.takes.cmp(3) >= 0) {
        document.getElementById("button-take").style.display = "block";
    } else if (this.shop.upgrades[3] && !this.uiStates.buttonTakeFaded) {
        fadeIn("button-take", 2000, "block");
        this.uiStates.buttonTakeFaded = true;
    } else if (!this.shop.upgrades[3]) {
        document.getElementById("button-take").style.display = "none";
        this.uiStates.buttonTakeFaded = false;
    }

    if (this.takes.cmp(3) >= 0) {
        document.getElementById("menu-things-upgrade").style.display = "grid";
    } else if (
        this.doubles.cmp(5) >= 0 &&
        !this.uiStates.menuThingsUpgradeFaded
    ) {
        fadeIn("menu-things-upgrade", 2000, "grid");
        this.uiStates.menuThingsUpgradeFaded = true;
    } else if (this.doubles.cmp(5) < 0) {
        document.getElementById("menu-things-upgrade").style.display = "none";
        this.uiStates.menuThingsUpgradeFaded = false;
    }

    if (this.takes.cmp(3) >= 0) {
        document.getElementById("menu-shop").style.display = "grid";
    } else if (this.doubles.cmp(50) >= 0 && !this.uiStates.menuShopFaded) {
        fadeIn("menu-shop", 2000, "grid");
        this.uiStates.menuShopFaded = true;
    } else if (this.doubles.cmp(50) < 0) {
        document.getElementById("menu-shop").style.display = "none";
        this.uiStates.menuShopFaded = false;
    }

    if (this.tokensShop.upgrades[1][0]) {
        document.getElementById("menu-shop-grid").style.display = "grid";
        document.getElementById("menu-shop-locked").style.display = "none";
    } else if (this.doubles.cmp(100) >= 0 && !this.uiStates.menuShopGridFaded) {
        fadeIn("menu-shop-grid", 2000, "grid");
        document.getElementById("menu-shop-locked").style.display = "none";
        this.uiStates.menuShopGridFaded = true;
    } else if (this.doubles.cmp(100) < 0) {
        document.getElementById("menu-shop-grid").style.display = "none";
        document.getElementById("menu-shop-locked").style.display = "block";
        this.uiStates.menuShopGridFaded = false;
    }
};
