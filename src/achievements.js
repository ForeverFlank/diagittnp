Game.prototype.achievementsDescription = [
    {
        id: 0,
        name: "I doubled the thing",
        description: "Doubled the thing for the first time",
    },
    {
        id: 1,
        name: "What are those buttons?",
        description: "Doubled the thing 5 times",
    },
    {
        id: 2,
        name: "Self-replication",
        description: "Purchase the first upgrade",
    },
    {
        id: 3,
        name: "I am speed",
        description: "Purchase the second upgrade",
    },
    {
        id: 4,
        name: "Millionaire",
        description: "Have 1 million things",
    },
    {
        id: 5,
        name: "Billionaire",
        description: "Have 1 billion things",
    },
    {
        id: 6,
        name: "The Shop",
        description: "Unlock the shop",
    },
    {
        id: 7,
        name: "Additional Boost",
        description: "Buy the first item in the shop",
    },
    {
        id: 8,
        name: "Some Real Boost",
        description: "Buy the second item in the shop",
    },
    {
        id: 9,
        name: "Supersonic Speed",
        description: "Buy the third item in the shop",
    },
    {
        id: 10,
        name: "Googolaire",
        description: "Have 1e100 things",
    },
];

Game.prototype.achievementsRenderInitialize = function () {
    this.achievementsDescription.forEach((element) => {
        let id = element.id;
        let name = element.name;
        let description = element.description;

        let template = document.getElementById("achievement-template");
        let clone = template.content.cloneNode(true);

        let divElement = clone.querySelector("div");
        let nameElement = clone.querySelector("p.text-sm");
        let descriptionElement = clone.querySelector("p.text-xs");

        divElement.id = "achievement-tab-" + id;
        nameElement.textContent = name;
        descriptionElement.textContent = description;

        document.getElementById("achievement-container").appendChild(clone);
    });
};
game.achievementsRenderInitialize();

Game.prototype.achievementsRenderUpdate = function () {
    this.achievementsDescription.forEach((element) => {
        let id = element.id;
        if (this.achievements.has(id)) {
            let divElement = document.getElementById("achievement-tab-" + id);
            
            let nameElement = divElement.querySelector("p.text-sm");
            let descriptionElement = divElement.querySelector("p.text-xs");

            divElement.classList.remove("border-zinc-500");
            nameElement.classList.remove("text-zinc-500");
            descriptionElement.classList.remove("text-zinc-500");
            divElement.classList.add("border-blue-600");
            nameElement.classList.add("text-blue-600");
            descriptionElement.classList.add("text-blue-600");
            
        }
    });
}

Game.prototype.achievementsAdd = function (id) {
    if (!this.achievements.has(id)) {
        this.achievements.add(id);
        let name = this.achievementsDescription[id].name;
        let template = document.getElementById(
            "notification-achievement-template"
        );
        let clone = template.content.cloneNode(true);
        let divElement = clone.querySelector("div");
        let nameElement = clone.querySelector("p");
        nameElement.textContent = name;
        document.getElementById("notification-container").appendChild(clone);
        divElement.animate(
            [
                { opacity: "1" },
                { opacity: "1" },
                { opacity: "1" },
                { opacity: "0" },
            ],
            { duration: 5000, iterations: 2, fill: "forwards" }
        );
        setTimeout(() => {
            divElement.remove();
        }, 5000);
        game.achievementsRenderUpdate();
    }
};

Game.prototype.watchAchievements = function () {
    if (this.doubles.cmp(1) >= 0) {
        this.achievementsAdd(0);
    }
    if (this.doubles.cmp(5) >= 0) {
        this.achievementsAdd(1);
    }
    if (this.thingsUpgrade.levels[0].cmp(1) >= 0) {
        this.achievementsAdd(2);
    }
    if (this.thingsUpgrade.levels[1].cmp(1) >= 0) {
        this.achievementsAdd(3);
    }
    if (this.things.cmp(1e6) >= 0) {
        this.achievementsAdd(4);
    }
    if (this.things.cmp(1e9) >= 0) {
        this.achievementsAdd(5);
    }
    if (this.doubles.cmp(100) >= 0) {
        this.achievementsAdd(6);
    }
};
