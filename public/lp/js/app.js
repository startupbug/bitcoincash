(function () {
    'use strict';

    var app = angular.module("app", ["ngAnimate", "ngMessages", "rj.realTimeClient"]);
    app.constant('REAL_TIME_OPTIONS', { url: 'http://realtime.perspecta.org', projectIdentifier: "ice9technology.com" });

    app.config([
		"$compileProvider",
		"$httpProvider",
		function ($compileProvider, $httpProvider) {
		    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|skype):/);
		    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
		        var key, result = [];
		        for (key in data) {
		            if (data.hasOwnProperty(key)) {
		                var value = data[key]
		                if (value === null) {
		                    value = "";
		                }
		                if (value === true) {
		                    value = 1;
		                }
		                if (value === false) {
		                    value = 0;
		                }
		                result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
		            }
		        }
		        return result.join("&");
		    });
		}
    ]);


    //Service inits
    app
        .service("SubscribeService", SubscribeService);

    SubscribeService.$inject = ["$http"];

    function SubscribeService($http) {
        var service = {
            Subscribe: subscribe
        };

        return service;
        ///////////////////////

        function subscribe(formData, version) {
            var data = {},
                subscribeUrl = "/brokerclicks/services/subscribe.php"; //-- BrokerClicks subscriber service
                //subscribeUrl = "https://app.getresponse.com/add_subscriber.html";
            data.email = paramHasValue(formData.email);
            data.password = paramHasValue(formData.password);
            data.firstName = paramHasValue(formData.firstName);
            data.lastName = paramHasValue(formData.lastName);
            data.name = paramHasValue(formData.lastName) ? formData.name : data.firstName + ' ' + data.lastName;
            data.phone = null;
            if (paramHasValue(formData.code + formData.phone)) {
                data.phone = "+" + paramHasValue(formData.code + formData.phone);
            }
            data.version = paramHasValue(version);
            data.source = paramHasValue(formData.source);

            //if (typeof formData.isAffiliate === "boolean" && formData.isAffiliate) {
            //    //subscribeUrl = "/brokerclicks/services/join.php"; -- BrokerClicks Affiliate subsribe service
            //    subscribeUrl = "/brokerclicks/services/join.php";
            //    data.acceptTerms = formData.acceptTerms;
            //}

            return $http({
                method: "POST",
                url: subscribeUrl,
                data: data
            });
        }

        function paramHasValue(val) {
            return ((typeof val !== "undefined" && (val !== null && typeof val !== "object")) && val.length > 0) ? val : null;
        }
    }
}());