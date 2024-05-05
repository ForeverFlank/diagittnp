game.loadGame();
game.achievementsRenderUpdate();

setInterval(() => {
    game.render();
}, 20);
setInterval(() => {
    game.update(50);
    game.watchAchievements();
}, 50);

setInterval(() => {
    game.saveGame();
}, 10 * 1000);