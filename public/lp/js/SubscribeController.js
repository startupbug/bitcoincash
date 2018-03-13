(function () {
	'use strict';

	angular
			.module("app")
			.controller("SubscribeController", SubscribeController);

	SubscribeController.$inject = ["$interval", "$http", "$scope", "$q", "SubscribeService"];

	function SubscribeController($interval, $http, $scope, $q, SubscribeService) {
		var vm = this,
				Service = SubscribeService,
				interval;
		vm.alreadySubscribed = false;
		vm.showLoading = false;
		vm.redirectDestination = "/members.php";
		vm.proceed = redirect;




		vm.formData = {
			name: window.integration.lookup(window.integration.params.subname, true),
			email: window.integration.lookup(window.integration.params.subemail, true),
		};

		//If we dont get first and last name from the cookies, we check for 'name' cookie.
		//If we found one -> we split the name on two parts - First and Last (trimmed left) and set the respective values on vm.FormData
		var fullName = '';
		if (!paramHasValue(vm.formData.name)) {
			var firstName = paramHasValue(window.integration.lookup("firstName", true)) ? window.integration.lookup("firstName", true) : false,
					lastName;
			if (firstName) {
				lastName = paramHasValue(window.integration.lookup("lastName", true)) ? window.integration.lookup("lastName", true) : false;
				fullName += firstName;
				if (lastName) {
					fullName += ' ' + lastName;
				}
			}
		}

		if (paramHasValue(fullName)) {
			vm.formData.name = fullName;
		}
		$.each(vm.formData, function (key, value) {
			var fieldHasValue = paramHasValue(value);
			vm.alreadySubscribed = typeof fieldHasValue !== "boolean";
			return typeof fieldHasValue !== "boolean";
		});
		if (vm.alreadySubscribed) {
			disableExitPopup();
		}

		vm.subscribe = function (form, listType) {
		    if (form.$valid) {
		        vm.showLoading = true;
		        vm.errorMessage = false;
				vm.formData.listType = listType;
				Service.Subscribe(vm.formData, 1).success(function (response) {
					form.$setPristine();
					form.$setUntouched();

					storeClientDataAndRedirect();

					vm.formData = {};
				}).error(function (reason) {
					vm.showLoading = false;
					vm.showForm = true;
					vm.errorMessage = reason.message;
				});
			}
		};

		function storeClientDataAndRedirect() {
			window.integration.store(window.integration.params.subname, vm.formData.name);
			window.integration.store(window.integration.params.subemail, vm.formData.email);
			var nameSplitted = splitName(vm.formData.name),
					firstName = nameSplitted.firstName,
					lastName;
			window.integration.store("firstName", firstName);
			if (paramHasValue(nameSplitted.lastName)) {
				lastName = nameSplitted.lastName;
				window.integration.store("lastName", lastName);
			}
			redirect();
		}


		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function redirect() {
			//Uncomment if redirect wants to redirect me to exit.php
			disableExitPopup();
			window.location = vm.redirectDestination;
		}

		function disableExitPopup() {
			if (typeof window.ExitPopup !== "undefined" && typeof window.ExitPopup === "object") {
				window.ExitPopup.stop();
			}
		}

		function paramHasValue(val) {
			return ((typeof val !== "undefined" && (val !== null && typeof val !== "object")) && (val !== "null" && val.length > 0)) ? val : false;
		}

		function splitName(name) {
			var firstSpace, firstName, lastName;
			if (typeof name === 'undefined' || name == null) {
				return {
					firstName: null,
					lastName: null
				};
			}

			firstSpace = name.indexOf(" ");
			if (firstSpace < 0) {
				firstName = name;
			} else {
				firstName = name.substring(0, firstSpace),
						lastName = name.substring(firstSpace + 1, name.length);
			}
			return {
				firstName: typeof firstName !== 'undefined' ? firstName : null,
				lastName: typeof lastName !== 'undefined' ? lastName : null
			};
		}

	}
}());