app.controller("StudentController", function($scope, $http, $state, NgTableParams){

	//Loading Data
	var toside = {todo: 2};
	var self = this;
	$http.post("core/app/endpoint/students.php", toside).success(function(response){		
		$scope.students = response;
	}).finally(function(){		
		var students = $scope.students;			
		self.tableParams = new NgTableParams({count: 25}, { dataset: students });
		self.tableParams.reload();
	});
})