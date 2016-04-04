app.controller("PublicController", function($scope, $http, $state){

	//Checking for logging
	var init = function () {
	   if (localStorage.getItem('user') == undefined)
		{	
			$state.go("public.nolog");	
		}		
	};	
	init();
	
})