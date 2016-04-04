app.controller("TopNavController", function($scope, $http, $state){

	//Get the Schoolname
	var init = function () {
		$http.post("core/app/endpoint/publicdata.php").success(function(response)
	   	{							
			try{
				$scope.publicdata = response;													
			}
			catch(e)
			{				
				response = 0;
			}		
		});	
	};	
	
	init();	
})