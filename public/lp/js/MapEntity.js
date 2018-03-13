var MapEntity = function (id, name, region, amount) {
    this.id = id;
    if (typeof region != "undefined" && region != null) {
        this.region = region;
    } else {
        this.region = 'EU';
    }

    if(typeof name != "undefined" && name != null) {
        this.name = name;
    } else {
        this.name = "Anonymous user."
    }

    if (typeof amount != "undefined" && amount != null) {
        this.amount = amount;
    } else {
        this.amount = this.getRandomInt(10000, 50000);
    }
    this.generateCoords(this.region);
}

MapEntity.prototype.constructor = MapEntity;
MapEntity.prototype.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

MapEntity.prototype.generateCoords = function () {
    var min = { x: 0, y: 0 },
        max = { x: 0, y: 0 };

    switch (this.region) {
        case "AF": //Africa
        case 1: //Africa
            min.x = 44;
            min.y = 45;

            max.x = 56;
            max.y = 61;
            break;
        case "AS": //Asia
        case 2: //Asia
            min.x = 60;
            min.y = 19;

            max.x = 82;
            max.y = 52;
            break;
        case "AU": //Australia
        case 3: //Australia
            min.x = 80;
            min.y = 74;

            max.x = 89;
            max.y = 88;
            break;
        case "EU": //Europe
        case 4: //Europe
            min.x = 44;
            min.y = 23;

            max.x = 59;
            max.y = 42;
            break;
        case "NA": //North America
        case 5: //North America
            min.x = 13;
            min.y = 15;

            max.x = 31;
            max.y = 46;
            break;
        case "SA":  //South America
        case 6:  //South America
            min.x = 25;
            min.y = 61;

            max.x = 35;
            max.y = 80;
            break;
    }

    this.x = this.getRandomInt(min.x, max.x);
    this.y = this.getRandomInt(min.y, max.y);
};