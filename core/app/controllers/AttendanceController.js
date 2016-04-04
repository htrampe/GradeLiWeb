app.controller("AttendanceController", function($scope, $http, $state, $stateParams){

	var unitid = $stateParams.unitid;

	//Create nice Date-String
	/*

	@param

		dateinfo - can be anything wich is compatible with new Date (timestamp, YYYY-MM-DD....)

	*/
	function createDateString(dateinfo)
	{
		var date = new Date(parseInt(dateinfo));			    
		var day = "";
	    var month = "";
	    if(date.getDate() < 10) day = "0" + date.getDate();
	    else day = date.getDate();
	    if(date.getDate() < 10) day = "0" + date.getDate();
	    else day = date.getDate();
	    if(date.getMonth() + 1 < 10) month = "0" + parseInt(date.getMonth() + 1);
	    else month = parseInt(date.getMonth() + 1);	
	    return day + "." + month + "." + date.getFullYear()	
	}

	//Get Time of an Unit
	function createDateTimeString(dateinfo)
	{

		var date = new Date(parseInt(dateinfo));				
		var hours = "";
		var minutes = "";			
		if(date.getHours() < 10) hours = "0" + date.getHours();
	    else hours = date.getHours();
	    if(date.getMinutes() < 10) minutes = "0" + date.getMinutes();
	    else minutes = date.getMinutes();	    
	    return hours + ":" + minutes;
	}

	//Reload View
	var reloadunitdata = function(unitid)
	{
		//Getting all Unitsdata
	   	var data = { 
			unitid : unitid, 					
			todo: 2
		};				
		$http.post("core/app/endpoint/attendance.php", data).success(function(response)
	   	{		   		
	   		$scope.studentsalldata = response[0];		
	   		$scope.studentsalldata_counts = response[1];
	   	});
	}


	var init = function()
	{
		//Loading Class, Unitdata and Students
		//Unitdata		
		$scope.loading = true;
		var data = { id : unitid, todo: 5};
		$http.post("core/app/endpoint/class_orga.php", data).success(function(response)
	   	{			   		
	   		$scope.tempclassname = response['class'];
	   		$scope.tempclassid = response['classid'];
	   		$scope.tempunitid = unitid;
	   		$scope.tempdate = createDateString(response['start']) + " - " + createDateTimeString(response['start']) + " bis " + createDateTimeString(response['end']);
	   		$("#unit_title").val(response['title']);
	   		$("#unit_short").val(response['short']);
	   		$("#unit_info").val(response['long']);
	   		$("#showunit").modal('toggle');	

	   		$scope.studentcount = 0;
			var data = { todo : 0, classid: $scope.tempclassid };
			$http.post("core/app/endpoint/students.php", data).success(function(response)
		   	{	
		   		//Studentsdata
		   		$scope.studentsdata = response[0];
		   		//Studentscounter
		   		$scope.studentcount = response[1];	   		
		   		var index;		   				   		
		   		for (index = 0; index < $scope.studentcount; ++index)
				{			
					//Save StuId	
					$scope.stuid = $scope.studentsdata[index]['id'];
					//Check for existing unitdatas for every student
					var data = { 
						unitid : unitid, 
						studentid : $scope.stuid,	
						todo: 0
					};
					$http.post("core/app/endpoint/attendance.php", data).success(function(response)
				   	{	
				   		//Found - do nothing				   		
				   		//Not Found - create a empty slot with OK-Working
				   		if(response['count'] == 0) 
				   		{				   			
				   			var newdata = {
				   				unitid : unitid, 
								studentid : response['stuid'],
								classid : $scope.tempclassid,
								//attendance-initial is 4 for middle-good-work
								attendance : "4",
								todo: 1
				   			}	
				   			$http.post("core/app/endpoint/attendance.php", newdata).success(function(response){});	
				   			$scope.loading = true;
				   			init();				
				   		}					   		
				   	});	 							   		   					   					   	
			   	}  
			   	//If all Data is needs to be reload call function itself			   	
			   	//Getting all Unitsdata
			   	var data = { 
					unitid : unitid, 					
					todo: 2
				};				
				$http.post("core/app/endpoint/attendance.php", data).success(function(response)
			   	{	
			   		$scope.studentsalldata = response[0];		
			   		$scope.studentsalldata_counts = response[1];

			   	}).finally(function(){
			   		$scope.loading = false;
			   	});
			});	
			
		});			
	}
	//Initial init
	init();

	

	//Goto Classview
	$scope.toClassView = function()
	{
		$state.go("logged.classview", {classid:$scope.tempclassid});	
	}


	//Updtae some Attendance-Data
	$scope.upAtt = function(studentid, classdatesid, newvalue)
	{
		var data = {
			unitid : classdatesid, 
			studentid : studentid,
			attendance : newvalue,
			todo: 3
		}	
		$http.post("core/app/endpoint/attendance.php", data).success(function(response){
			reloadunitdata(classdatesid);			
		});	
	}

	//Timetolate update
	$scope.upToLate = function(studentid, classdatesid)
	{
		if($("#timetolate_" + studentid).val() < 0) $("#timetolate_" + studentid).val("0");
		else
		{
			var data = {
				unitid : classdatesid, 
				studentid : studentid,
				time : $("#timetolate_" + studentid).val(),
				todo: 4
			}	
			$http.post("core/app/endpoint/attendance.php", data).success(function(response){
				reloadunitdata(classdatesid);			
			});
		}		
	}

	//Manage Notice
	$scope.manageNotice = function(studentid, classdates_id, notice, name, prename, tempclassname, tempdate)
	{
		$scope.noticedata = {
			studentid : studentid,
			classdates_id : classdates_id,
			notice : notice,			
			todo : 5
		}
		$scope.tempmoddata = "Notiz von " + name + ", " + prename + " (" + tempclassname +") am " + tempdate + "."; 
		$("#notice").val(notice);
		$("#inputerr").hide();
		$("#shownotice").modal('toggle');
	}

	//Save new Notice
	$scope.updateMod = function()
	{
		$scope.noticedata['notice'] = $("#notice").val();		
		//Validate Data
		//Validate Timeareas and Inputs
		if($scope.noticedata['notice'] != "" && $scope.valTextInput($scope.noticedata['notice']) == false						
		)
		{
			$scope.errmess = "Falsche Daten! Bitte auf Sonderzeichen achten!";
			$("#inputerr").fadeIn();
		}	
		else
		{
			$http.post("core/app/endpoint/attendance.php", $scope.noticedata).success(function(response){
				$("#shownotice").modal('toggle');
				reloadunitdata($scope.noticedata['classdates_id']);	
			});
		}
	}
})