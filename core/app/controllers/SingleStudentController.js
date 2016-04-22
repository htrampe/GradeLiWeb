app.controller("SingleStudentController", function($scope, $http, $state, $stateParams){

	var studentid = $stateParams.studentid;
	//Array of all id's students in act class
	$scope.stuarr = [];
	$("#inputerr").hide();
	$("#saveok").hide();
	//Loading Data	
	var init = function()
	{
		var data = { studentid : studentid, todo : 3};

		$http.post("core/app/endpoint/students.php", data).success(function(response){	
			$scope.studentsdata = response;	

			//Initial values of the inputfields
			$("#name").val($scope.studentsdata['name']);
			$("#prename").val($scope.studentsdata['prename']);
			$("#foto").val($scope.studentsdata['img']);
			$("#info").val($scope.studentsdata['info']);		

			/*
				NOTEN
			*/	
			var data = { 
				id : $scope.studentsdata.classid,
				studentid : studentid, 
				todo : 6
			};
			
			//Classdata
			$http.post("core/app/endpoint/students.php", data).success(function(response){
				$scope.classdata = response;								
			});
			
			//Saving all ID's of Class-Students in array
			var data = { todo : 0, classid: response['classid']};
			$http.post("core/app/endpoint/students.php", data).success(function(response){			
				var index;
				for (index = 0; index < response[1]; ++index) {				    
				    $scope.stuarr.push(response[0][index]['id']);				    
				}								
			});
		});				
	}
	init();

	//Loading new view - array stuarr is the same
	var loadNew = function(id)
	{
		studentid = id;
		var data = { studentid : studentid, todo : 3};
		$http.post("core/app/endpoint/students.php", data).success(function(response){	
			$scope.studentsdata = response;		
			//Initial values of the inputfields
			$("#name").val($scope.studentsdata['name']);
			$("#prename").val($scope.studentsdata['prename']);
			$("#foto").val($scope.studentsdata['img']);
			$("#info").val($scope.studentsdata['info']);	
		});	

		/*
				NOTEN
		*/	
		var data = { 
			id : $scope.studentsdata.classid,
			studentid : studentid, 
			todo : 6
		};
		
		//Classdata
		$http.post("core/app/endpoint/students.php", data).success(function(response){
			$scope.classdata = response;
		});
	}

	//Missing unit to OK-Miss
	//Set attendance to 1
	$scope.doUE = function(studentsid, unitid)
	{	
		//Updtae some Attendance-Data
		var data = {
			unitid : unitid, 
			studentid : studentsid,
			attendance : 1,
			todo: 3
		};	
		$http.post("core/app/endpoint/attendance.php", data).success(function(response){			
			init();
		});	
	}
	//Missing OK Schoolevent - attendance 7
	$scope.doUESchool = function(studentsid, unitid)
	{	
		//Updtae some Attendance-Data
		var data = {
			unitid : unitid, 
			studentid : studentsid,
			attendance : 7,
			todo: 3
		};	
		$http.post("core/app/endpoint/attendance.php", data).success(function(response){			
			init();
		});	
	}

	//Go to Student-Overview
	$scope.toStudentOver = function()
	{
		$state.go("logged.students");
	}

	//Next Student
	$scope.nextStu = function()
	{		
		$("#inputerr").hide();
		$("#saveok").hide();
		var actIndex = $scope.stuarr.indexOf(studentid);
		var nextIndex = actIndex + 1;		
		if(nextIndex == $scope.stuarr.length) nextIndex = 0;
		loadNew($scope.stuarr[nextIndex]);
	}

	//Previous Student
	$scope.prevStu = function()
	{
		$("#inputerr").hide();
		$("#saveok").hide();
		var actIndex = $scope.stuarr.indexOf(studentid);
		var nextIndex = actIndex - 1;		
		if(nextIndex == -1) nextIndex = $scope.stuarr.length - 1;
		loadNew($scope.stuarr[nextIndex]);
	}

	//To Classview
	$scope.toClass = function(classid)
	{
		$state.go("logged.studentclassview", {classid: classid});
	}

	//Update a Student
	$scope.updateStudent = function()
	{
		var data = {
			id : studentid,
			name : $("#name").val(),
			prename : $("#prename").val(),
			foto : $("#foto").val(),
			info : $("#info").val(),
			todo : 5
		}

		if(data['info'] == "") data['info'] = null;
		if(data['foto'] == "") data['foto'] = null;

		//Validate
		if(	$scope.valTextInput(data['name']) == "" ||	
			$scope.valTextInput(data['prename']) == "" ||	
			$scope.valTextInput(data['name']) == false ||	
			$scope.valTextInput(data['prename']) == false ||				
			(data['info'] != null && data['info'] != "" && $scope.valTextInput(data['info']) == false) ||
			(data['foto'] != null && data['foto'] != "" && $scope.valTextInput(data['foto']) == false)
		)
		{
			$scope.errmess = "Fehlerhafte Eingabe. Mind. Vor- und Nachname und Sonderzeichen beachten!";
			$("#inputerr").fadeIn();
			$("#inputerr").delay(3000).fadeOut();
		}	
		//All check ok - save new Data to Database		
		else
		{
			$http.post("core/app/endpoint/students.php", data).success(function(response){			
				$scope.okmess = "Daten aktualisiert!";
				$("#inputerr").hide();
				$("#saveok").fadeIn();
				$("#saveok").delay(2000).fadeOut();
				init();
			});
		}
	}

	//Delete a Student
	$scope.deleteStudent = function(id)
	{

		//Show Confirm-Window
	    bootbox.setDefaults({
          /**
           * @optional String
           * @default: en
           * which locale settings to use to translate the three
           * standard button labels: OK, CONFIRM, CANCEL
           */
          locale: "de"
		});			

		bootbox.dialog({
		  message: "Achtung! Schüler wird inkl. Noten und Anwesenheitsdaten unwiederbringlich gelöscht.",
		  title: "Schüler löschen",
		  buttons: {
		    success: {
		      label: "Fortfahren",
		      className: "btn-danger",
		      callback: function() {
		        	//Validate Data
					var data = {todo : 7, studentid : id};
					$http.post("core/app/endpoint/students.php", data).success(function(response){

						$("#inputerr").hide();
						$("#saveok").hide();
						var actIndex = $scope.stuarr.indexOf(studentid);
						var nextIndex = actIndex + 1;		
						if(nextIndex == $scope.stuarr.length) nextIndex = 0;
						//Remove Student from array			
						$scope.stuarr.splice(actIndex, 1);

						//Load next student
						loadNew($scope.stuarr[nextIndex]);

					});
		      }
		    },		    
		    main: {
		      label: "Abbrechen",
		      className: "btn-success",
		      callback: function() {
		        this.modal('hide');
		      }
		    }
		  }
		});
	}

})