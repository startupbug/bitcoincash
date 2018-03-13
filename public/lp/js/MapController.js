(function () {
    'use strict';

    angular
        .module("app")
        .controller("MapController", MapController);

    MapController.$inject = ["$interval", "$timeout"];

    function MapController($interval, $timeout) {
        var vm = this;
        var getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        var entityCount = getRandomInt(0,29),
            entityDetails = [{ name: "Mohammad A", amount: 28921 }, { name: "Brian F", amount: 11255 }, { name: "Helene G", amount: 45110 }, { name: "Jane P", amount: 36652 }, { name: "Manny H", amount: 17904 }, { name: "Caleb W", amount: 29343 }, { name: "Paula M", amount: 9012 }, { name: "Henrietta S", amount: 56424 }, { name: "Adam P", amount: 14967 }, { name: "Raj N", amount: 32776 }, { name: "Ahmed R", amount: 49517 }, { name: "Martina T", amount: 22443 }, { name: "Marisol V", amount: 15090 }, { name: "Nathan D", amount: 35830 }, { name: "Anthony Q", amount: 8972 }, { name: "Liam O", amount: 42191 }, { name: "Darshan K", amount: 36661 }, { name: "Natalie S", amount: 24475 }, { name: "Sharon C", amount: 38202 }, { name: "Oleg B", amount: 13550 }, { name: "Pierre S", amount: 39865 }, { name: "Mohammad A", amount: 47314 }, { name: "Peng Y", amount: 54633 }, { name: "Haakon O", amount: 28380 }, { name: "Boris Y", amount: 19217 }, { name: "Yumi T", amount: 52962 }, { name: "Casper V", amount: 11461 },
            {name: "Jennifer W", amount: 7696},{name: "Shen L", amount: 41775},{name: "Patty G", amount: 33090},];

        vm.entityInterval = {
            min: 3,
            max: 12
        };

        vm.withdrawals = [];


        vm.init = function () {
            $interval(function () {
                var currentIx = entityCount++;
                if(currentIx >= 30) {
                    currentIx = 0;
                    entityCount = 0;
                }
                var entity = new MapEntity(entityCount, entityDetails[currentIx].name, getRandomInt(1, 6), entityDetails[currentIx].amount);
                vm.withdrawals.push(entity);

                $timeout(function () {
                    var idx;
                    vm.withdrawals.map(function (item, ix) {
                        if (item.id == entity.id) {
                            idx = ix;
                        }
                    });

                    vm.withdrawals.splice(idx, 1);
                }, 7000);
            }, getRandomInt(vm.entityInterval.min, vm.entityInterval.max) * 1000);
        };

        vm.init();




    }
}());