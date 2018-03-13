(function () {
	'use strict';

	angular
			.module("app")
			.controller("LiveFeed", LiveFeed);

	LiveFeed.$inject = ["$interval", "$timeout", "$rootScope", "$http", "RealTime"];

	function LiveFeed($interval, $timeout, $rootScope, $http, RealTime) {
	    var vm = this;
	    vm.commentsCount = window.integration.lookup("fbcc", true);
	    
		if (vm.commentsCount == null) {
		    vm.commentsCount = getRandomInt(12345, 14567);
		} else {
		    vm.commentsCount = parseInt(vm.commentsCount) + getRandomInt(1, 7);
		}
		window.integration.store("fbcc", vm.commentsCount);

		RealTime.start({
			notifications: [
				{
					method: "newFacebookComment",
					callback: "newFacebookComment"
				},
				{
					method: "newTwitterComment",
					callback: "newTwitterComment"
				},
			]
		});

		$rootScope.$on("newFacebookComment", function (e, response) {
		    console.log("newFacebookComment", response);
		    vm.commentsCount++;
		    window.integration.store("fbcc", vm.commentsCount);
		});
		$rootScope.$on("newTwitterComment", function (e, response) {
			console.log("newTwitterComment", response);
		});

		$http({
			method: "POST",
			url: "../brokerclicks/services/getFacebookComments.php",
			data: {
				limit: 10,
			},
		}).success(function (response, status, headers, config) {
		    angular.forEach(response.data, function (item, ix) {
		        item = formatComment(item, 'fb');
		    });

		    vm.fb = response.data;
		}).error(function (response, status, headers, config) {

		});

		$http({
			method: "POST",
			url: "../brokerclicks/services/getTwitterComments.php",
			data: {
				limit: 10,
			},
		}).success(function (response, status, headers, config) {
		    angular.forEach(response.data, function (item, ix) {
		        item = formatComment(item, 'tw');
		    });

		    vm.tw = response.data;
		}).error(function (response, status, headers, config) {
		    console.log(response);
		});

		function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function formatComment(comment, type) {
		    var item = comment;
		    switch (type) {
		        case 'fb':
		            item.likes = parseInt(item.likes);
		            item.createDate = moment(item.createDate).format("MMM DD, YYYY HH:mm a");
		            break;
		        case 'tw':
		            item.createDate = moment(item.createDate).format("DD MMM");
		            break;
		    }
		    return item;
		}


		$timeout(function () {
		    $('.custom-scroll').mCustomScrollbar({
		        axis: 'y',
		        liveSelector: '.comment',
		    });
		}, 1000);
	}
}());