app.controller("StuNoteController", function($scope, $http, $state, $stateParams, NgTableParams){

	//Userdata
	var data = {
		token : localStorage.getItem('user')
	}
	$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
	{
		$scope.userdata = response;	
	});		

	$scope.show_work_scale = false;
	$scope.show_work_note = false;


	var classid = $stateParams.classid;
	var notenid = $stateParams.notenid;
	var self = this;
	//Loading Students and Notes
	var data = 
	{
		classid : classid,		
		notenid : notenid,				
		todo : 18			
	};	
	$http.post("core/app/endpoint/notes.php", data).success(function(response){			
		$scope.students = response;
	}).finally(function()
	{	
		var data = { classid : classid, todo : 4};
		$http.post("core/app/endpoint/students.php", data).success(function(response){	
			$scope.students_complete = response[0];	
		}).finally(function(){
			var students = $scope.students;	
			//Labes for Chart
			$scope.labels_chart = ['--', '-', 'o', '+', '++'];
			//Copy Workwith-Informations into array for table
			for(index = 0; index < $scope.students.length; index++)
			{

				students[index]['note_work'] = $scope.students_complete[index]['note'];
				students[index]['notecounter'] = $scope.students_complete[index]['notecounter'];
				students[index]['mm'] = $scope.students_complete[index]['mm'];
				students[index]['m'] = $scope.students_complete[index]['m'];
				students[index]['o'] = $scope.students_complete[index]['o'];
				students[index]['p'] = $scope.students_complete[index]['p'];
				students[index]['pp'] = $scope.students_complete[index]['pp'];
				students[index]['data_score'] = [];
				students[index]['data_score'][0] = students[index]['mm'];
				students[index]['data_score'][1] = students[index]['m'];
				students[index]['data_score'][2] = students[index]['o'];
				students[index]['data_score'][3] = students[index]['p'];
				students[index]['data_score'][4] = students[index]['pp'];
				students[index]['data_score_final'] = [students[index]['data_score']];
			}
			self.tableParams = new NgTableParams({count: $scope.students.length}, {counts: [], dataset: students });
			self.tableParams.reload();	
		});	
	});	


	//Clear Filter
	$scope.clearFilter = function()
	{
		self.tableParams.parameters({ filter: {}, sorting: {}, page: 1 });
	}


	//Show/Hide Workin-Infos
	$scope.showWorkInfos = function()
	{
		if($scope.userdata.show_unitnote == 1)
		{
			if($scope.show_work_note) $scope.show_work_note = false;
			else $scope.show_work_note = true;
		}
		if($scope.userdata.show_attendence == 1)
		{
			if($scope.show_work_scale) $scope.show_work_scale = false;
			else $scope.show_work_scale = true;
		}
		
	}

	
})