(function () {
    'use strict';

    angular
        .module("app")
        .controller("MarqueeController", MarqueeController);

    MarqueeController.$inject = ["$interval", "$timeout"];

    function MarqueeController($interval, $timeout) {
        var vm = this;

        vm.tags = [
        { body: "ice9" },
        { body: "ice9tech" },
        { body: "ice9viral" },
        { body: "ice9luv" },
        { body: "MakeMoney" },
        { body: "ChangeYourLife" },
        { body: "Ice9Free" },
        { body: "SEE_IT_TO_BELIEVE_IT" },
        { body: "ice9moneybaby" },
        { body: "ShareTheWealth" },
        { body: "WELOVEAARON" },
        { body: "ChangeWallstreetForever" },
        { body: "Aaron_for_President" },
        { body: "ice94lyfe" },
        { body: "Join_the_Revolution" },
        { body: "winning" },
        { body: "balling" },
        { body: "first_world_problems" },
        ];

        vm.init = function () {
            $interval(function () {
                vm.tags.unshift(vm.tags.pop());
            }, 2000);
        }

        vm.init();

    }
}());