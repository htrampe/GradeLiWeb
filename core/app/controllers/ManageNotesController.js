app.controller("ManageNotesController", function($scope, $http, $state, $stateParams){

	var classid = $stateParams.classid;
	var notenid = $stateParams.notenid;

	var init = function()
	{
		//Classdata and Notendata
		var data = 
		{
			classid : classid,
			notenid	: notenid,			
			todo : 12			
		};
		$http.post("core/app/endpoint/notes.php", data).success(function(response){
			$scope.notendata = response;			
		});

		//Loading Students and Notes
		var data = 
		{
			classid : classid,		
			notenid : notenid,				
			todo : 13			
		};
		
		$http.post("core/app/endpoint/notes.php", data).success(function(response){			
			$scope.studentsdata = response;	
			console.log(response);
			//0-15
			if($scope.studentsdata.system == 0) 
			{
				//Chart
				var labels = [];
				var scoredata = [];
				for(i = 0; i <= 15; i++)
				{
					labels[i] = i;
					scoredata[i] = $scope.studentsdata.score[i];
				}
				$scope.labels = labels;
				$scope.data = [scoredata];
			}		
			//0-6
			if($scope.studentsdata.system == 1)	
			{
				//Chart
				var labels = [];
				var scoredata = [];
				for(i = 0; i <= 6; i++)
				{
					labels[i] = i;
					scoredata[i] = $scope.studentsdata.score[i];
				}
				$scope.labels = labels;
				$scope.data = [scoredata];
			}
		});		
	}
	init();

	//Back to NoteView
	$scope.toNoteView = function()
	{
		$state.go("logged.notes", {classid:classid});	
	}

	//Update Note
	$scope.updateNote = function(studentid)
	{
		var data = {
			note : $("#note_" + studentid).val(),
			studentid : studentid,
			notenid : notenid,
			todo : 14
		}
		$http.post("core/app/endpoint/notes.php", data).success(function(response){
			init();
		});
	}
	
	//Update Notice
	$scope.updateNoteNotice = function(studentid)
	{
		//If Notice not dangerous - update notice
		if($scope.valTextInput($("#notice_" + studentid).val()) != false)
		{
			data = 
			{
				notice : $("#notice_" + studentid).val(),
				studentid : studentid,
				notenid : notenid,
				todo : 15			
			}
			$http.post("core/app/endpoint/notes.php", data).success(function(response){});
		}
	}

	//Copy Scale-Note to real Note
	$scope.saveNote = function(note, studentid)
	{
		note = note.replace(",", ".");
		var new_note = Math.round(parseFloat(note));
		var data = {
			note : new_note,
			studentid : studentid,
			notenid : notenid,
			todo : 14
		}
		$http.post("core/app/endpoint/notes.php", data).success(function(response){
			$("#note_" + studentid).val(parseInt(new_note));
			init();
		});	
	}

})