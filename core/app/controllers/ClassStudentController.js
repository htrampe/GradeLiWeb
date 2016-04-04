app.controller("ClassStudentController", function($scope, $http, $state, $stateParams){

	//Init
	var init = function()
	{
		$scope.classid = $stateParams.classid;
		$scope.studentcount = 0;
		//Get Classname
		var data = { 
			id : $scope.classid, 
			todo : 0
		};
		//Classdata
		$http({
			method : "POST",
			data : data,
			url : "core/app/endpoint/class_orga.php"
		}).then(
			function successCallback(response)
			{			
				$scope.classname = response['data']['name'];		
			}
		);		
		//Studentsdata
		var data = { todo : 4, classid: $scope.classid };
		$http({
			method : "POST",
			data : data,
			url : "core/app/endpoint/students.php"
		}).then(
			function successCallback(response)
			{			
				$scope.studentsdata = response['data'][0];
	   			$scope.studentcount = response['data'][1];		
			}
		);
	}
	init();

	/*
		
		Managed Students Section

	*/

	//Show new Student Modal
	$scope.newStudent = function()
	{
		$("#prename").val("");
		$("#name").val("");
		$("#inputerr").hide();
		$("#newstudent").modal('toggle');
	}

	//Validate and Save new Student
	$scope.saveNewStudent = function()
	{
		//Validate Data
		var data = {
			classid : $scope.classid,
			prename : 	$("#prename").val(),		
			name: 		$("#name").val(),		
			todo : 1
		}
		//Validate Inputs
		if(	data['prename'] == "" || 
			$scope.valTextInput(data['prename']) == false ||				
			data['name'] == "" || 
			$scope.valTextInput(data['name']) == false
		)
		{
			$scope.errmess = "Falsche Daten! Vor- und Nachname angeben. Auf Sonderzeichen achten.";
			$("#inputerr").fadeIn();
		}	
		//All check ok - save new Date to Database		
		else
		{				
			//Save to Database
			$http.post("core/app/endpoint/students.php", data).success(function(response)
		   	{				   		
		   		$("#newstudent").modal('toggle');	
		   		init();	   		   		
			});	
			init();				
		}
	}
	/*

		CSV INPUT
	
	*/
	$scope.submitCSV = function()
	{
		file = document.getElementById('csv_file').files[0];    	
		if(file == undefined)
		{
			$scope.csvmess = "Keine CSV-Datei gefunden.";
			$("#csvmod").modal('toggle');
			$scope.progvalue = 100;
			setTimeout(function () {
			  $("#csvmod").modal('toggle');
			}, 2000);
		}
		else
		{
			$scope.csvmess = "Daten werden verarbeitet.";
			$("#csvmod").modal('toggle');
			$scope.progvalue = 50;
			// Parse local CSV file
			Papa.parse(file, {
				complete: function(results) 
				{
					$scope.csvmess = "Import startet.";
					$scope.progvalue = 75;
					var students = results.data;
					//results.data is an array of students
					var index;
					for (index = 1; index < students.length; ++index) {				
						//0 Prename 1 Name
						//Validate and Insert					
						if( students[index][0] != undefined && students[index][1] != undefined &&
							$scope.valTextInput(students[index][0]) != false &&	
							$scope.valTextInput(students[index][1]) != false &&
							students[index][0].length > 0 && students[index][1].length > 0						 
						)
						{
							//Validate Data
							var data = {
								classid : $scope.classid,
								prename : 	students[index][0],		
								name: 		students[index][1],		
								todo : 1
							}
							$http.post("core/app/endpoint/students.php", data).success(function(response){});
							$scope.progvalue = 75;						
						}
					}							
				}
			});	
			//After import reload view
			$scope.csvmess = "Schüler importiert. Neu-Laden wird vorbereitet.";			
			$scope.progvalue = 100;
			setTimeout(function () {
			  $("#csvmod").modal('toggle');
			  $('#csvmod').on('hidden.bs.modal', function () {
	    		init();	
			})		  	
			}, 2000);		
		}		
	}

	//Download CSV-Pre
	$scope.downloadCSV = function()
	{
		window.location.href = "core/assets/gradeliweb_csv_Vorlage.csv";
	}

	//Go To class view
	$scope.toClassView = function()
	{					
		$state.go("logged.classes");	
	}

})