(function () {
	'use strict';

	angular.module("app").controller("StartController", StartController);

	StartController.$inject = ["$interval", "$timeout", "$scope", "$http", "$rootScope", "RealTime"];

	function StartController($interval, $timeout, $scope, $http, $rootScope, RealTime) {
		var vm = this;

		vm.currentStats = [];
		vm.showLoading = true;
		vm.loadingData = [{}, {}, {}, {}, {}, {}];

		RealTime.start({
			notifications: [
				{
					method: "CurrentStatSignal",
					callback: "CurrentStatSignal"
				},
//				{
//					method: "WithdrawSignal",
//					callback: "WithdrawSignal"
//				}
			]
		});

		$rootScope.$on("CurrentStatSignal", function (e, response) {
			response.diff = moment.duration(moment.utc(response.createDate).diff(moment()), "milliseconds").humanize(true);
			vm.currentStats.unshift(response);
			vm.currentStats.pop();
		});

		$rootScope.$on("WithdrawSignal", function (e, response) {

		});


		$http({
			method: "POST",
			url: "brokerclicks/services/getWithdrawals.php",
			data: {
				"limit": 12,
				"isLarge": 0,
			},
		}).success(function (response, status, headers, config) {
			$.each(response.data, function (key, item) {
				item.diff = moment.duration(moment.utc(item.createDate).diff(moment()), "milliseconds").humanize(true);
			});
			vm.currentStats = response.data;
			vm.showLoading = false;
		}).error(function (response, status, headers, config) {

		});


		$timeout(function () {
			$('.stats-items-holder').mCustomScrollbar({
				axis: 'y',
				liveSelector: '.item',
				callbacks: {
					onInit: function () {
						$timeout(function () {
							$('.stats-items-holder').mCustomScrollbar("scrollTo", "first", {callbacks: false});
						}, 200);
					}
				}
			});
		}, 1000);

		function updateEntries() {
			angular.forEach(vm.currentStats, function (item, ix) {
				item.diff = moment.duration(moment.utc(item.createDate).diff(moment()), "milliseconds").humanize(true);
			});
		}

		$interval(function () {
			updateEntries();
		}, 1000);

	}
}());