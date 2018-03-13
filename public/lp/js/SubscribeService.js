(function () {
	'use strict';

	angular
			.module("app")
			.service("SubscribeService", SubscribeService);

	SubscribeService.$inject = ["$http"];

	function SubscribeService($http) {
		var service = {
			Subscribe: subscribe
		};

		return service;
		///////////////////////

		function subscribe(formData, version) {
		    var data = {};
		    data.name = formData.name;
		    data.email = formData.email;
		    data.listType = formData.listType;
		    data.password = '';
		    data.version = version;

			//switch (version) {
			//	case '1':
			//		data.name = formData.name;
			//		data.email = formData.email;
			//		data.password = formData.password;
			//		break;
			//	case '2':
			//		data.name = formData.name;
			//		data.email = formData.email;
			//		break;
			//    case '3':
			//        data.name = formData.name;
			//        data.email = formData.email;
            //        data.password = formData.password;
			//}

			return $http({
				method: "POST",
				url: "/brokerclicks/services/subscribeInGetResponse.php",
				data: data
			});
		}
	}
}());