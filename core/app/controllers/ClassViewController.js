app.controller("ClassViewController", function($scope, $http, $stateParams, $state, $document){

	//Saving Classid as local and in scope
	var classid = $stateParams.classid;
	$scope.classid = classid;
	
	
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

	//Create PC-Date-String
	/*

	@param

		dateinfo - can be anything wich is compatible with new Date (timestamp, YYYY-MM-DD....)

	*/
	function createDateStringPC(dateinfo)
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
	    return date.getFullYear()	+ "-" + month + "-" + day;
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

	//All Unit-IDs-Array
	var units_arr =[];

	//Loading data from Class
	var init = function()
	{
		units_arr = [];
		var data = { 
			id : classid, 
			todo : 0
		};
		//Classdata
		$http.post("core/app/endpoint/class_orga.php", data).success(function(response){
			$scope.classdata = response;			
		});				

		//Unitsdata
		var data = { 
			id : classid, 
			todo : 2
		};
		$http.post("core/app/endpoint/class_orga.php", data).success(function(response){
			var index;
			for (index = 0; index < response.length; ++index) {				
				response[index]['time_start'] = createDateTimeString(response[index]['start']);	
			    response[index]['time_end'] = createDateTimeString(response[index]['end']);
			    response[index]['start'] = createDateString(response[index]['start']);
			    response[index]['end'] = createDateString(response[index]['end']);
			    //Add Unit to all Units
			    units_arr.push(response[index]['id']);
			}		
			$scope.classunits = response;							
		});	
	}
	init();

	
	//Change End-Time to one Hour from Start-Time
	$scope.updateEndTime = function()
	{
		var temp_date = new Date("01.01.2016 " + $("#date_start_time").val());
		temp_date.setMinutes ( temp_date.getMinutes() + 90 );
		var hours = "";
		var minutes = "";
		if(temp_date.getHours() < 10) hours = "0" + temp_date.getHours();
		else hours = temp_date.getHours();
		if(temp_date.getMinutes() < 10) minutes = "0" + temp_date.getMinutes();
		else minutes = temp_date.getMinutes();
		$("#date_end_time").val(hours + ":" + minutes);						
	}
	
	/*

		NEW UNITS

	*/
		//Show Modal
		$scope.newUnits = function()
		{	
			$("#inputerr").hide();
			$("#date_start").val("");	
			$("#date_start_time").val("09:00");	
			$("#date_end_time").val("10:30");
			$("#newunits").modal('toggle');	
		}

		//Validate and save new Date (SINGLE)
		$scope.saveNewUnits = function()
		{
			//Validate Data
			var data = {
				start : $scope.getMilDate($("#date_start").val(), $("#date_start_time").val()),	
				end: 	$scope.getMilDate($("#date_start").val(), $("#date_end_time").val()),
				classid : $scope.classid,
				unitcount : $scope.classdata.unitcount,
				todo : 1				
			}
			//Validate Timeareas and Inputs
			if(data['end'] < data['start'] || 
				$("#date_start").val() == ""				
			)
			{
				$scope.errmess = "Falsche Daten! Bitte auf Zeiträume achten und wenigstens Titel angeben. Auf Sonderzeichen achten!";
				$("#inputerr").fadeIn();
			}	
			//All check ok - save new Date to Database		
			else
			{
				//Hide Modal
				$("#newunits").modal('toggle');	
				//Save to Database
				$http.post("core/app/endpoint/class_orga.php", data).success(function(response)
			   	{				   		
			   		//Reload Calender			   		
			   		$('#calendar').fullCalendar('refetchEvents');
			   		init();
				});					
			}
		}


		//NEW MASS UNITS
		//Go to new state to see calendar and stuff
		$scope.newMassUnits = function()
		{
			$state.go("logged.massunits", {classid:$scope.classid});	
		}


		//Del a Unit
		$scope.delUnit = function(id)
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
			  message: "Achtung! Einheit inkl. Anwesenheit wird gelöscht.",
			  title: "Einheit löschen",
			  buttons: {
			    success: {
			      label: "Fortfahren",
			      className: "btn-danger",
			      callback: function() {
			        	var data = {
							id:id,
							todo: 3
						}
						$http.post("core/app/endpoint/class_orga.php", data).success(function(response)
					   	{	
					   		//Reload Calender
					   		$('#calendar').fullCalendar('refetchEvents');
					   		init();
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

		//Update a Unit
		$scope.updateUnit = function(id)
		{
			//Validate Data
			var data = {
				id : id,
				title : 	$("#unit_title_" + id).val(),		
				short_info: $("#unit_short_" + id).val(),		
				info : 		$("#unit_info_" + id).val(),		
				todo : 4
			}
			//Validate Timeareas and Inputs
			if(data['title'] == "" || 
				$scope.valTextInput(data['title']) == false ||				
				(data['short_info'] != "" && $scope.valTextInput(data['short_info']) == false) ||
				(data['info'] != "" && $scope.valTextInput(data['info']) == false)
			)
			{
				$scope.errmess = "Falsche Daten! Titel angeben und Sonderzeichen beachten!";
				$("#inputerr_" + id).fadeIn();
				$("#inputerr_" + id).delay(4000).fadeOut();
				
			}	
			//All check ok - save new Date to Database		
			else
			{				
				//Save to Database
				$http.post("core/app/endpoint/class_orga.php", data).success(function(response)
			   	{				   		
			   		//Reload Calender but NOT the View
			   		$scope.okmess = "Daten gespeichert.";
			   		$("#saveok_" + id).fadeIn();
					$("#saveok_" + id).delay(2000).fadeOut();
			   		$('#calendar').fullCalendar('refetchEvents');			   		
				});	
				init();				
			}
		}

		//Change date and time of a unit
		$scope.changeDateUnit = function(id)
		{
			$scope.tempunitid = id;			
			//Loading Data
			var data = {id : $scope.tempunitid, todo: 5};
			$http.post("core/app/endpoint/class_orga.php", data).success(function(response)
		   	{	
		   		$scope.tempunitdate = createDateString(response['start']);
		   		$scope.tempunittime = createDateTimeString(response['start']) + " bis " + createDateTimeString(response['end']);
		   		$("#changeerr").hide();
				$("#uchange_start").val(createDateStringPC(response['start']));	
				$("#uchange_start_time").val(createDateTimeString(response['start']));	
				$("#uchange_end_time").val(createDateTimeString(response['end']));
				$("#changeunit").modal('toggle');		
			});	
		}

		//Do Change
		$scope.doChangeUnit = function()
		{
			//Validate Data
			var data = {
				id : $scope.tempunitid,
				start : $scope.getMilDate($("#uchange_start").val(), $("#uchange_start_time").val()),	
				end: 	$scope.getMilDate($("#uchange_start").val(), $("#uchange_end_time").val()),
				todo : 6				
			}
			//Validate Timeareas and Inputs
			if(data['end'] < data['start']		
			)
			{
				$scope.errmess = "Falsche Daten! Bitte auf Zeiträume achten!";
				$("#changeerr").fadeIn();
			}	
			//All check ok - save new Date to Database		
			else
			{				
				//Hide Modal
				$("#changeunit").modal('toggle');	
				//Save to Database
				$http.post("core/app/endpoint/class_orga.php", data).success(function(response)
			   	{	
			   		//Reload Calender
			   		$('#calendar').fullCalendar('refetchEvents');
			   		init();			   		
				});					
			}
		}

		//Switch to Attendance
		$scope.unitAttendance = function(unitid)
		{
			$state.go("logged.attendance", {unitid:unitid});	
		}

		//Expand all
		$scope.showAllUnits = function()
		{
			var index;
			for (index = 0; index < units_arr.length; ++index) 
			{		
				$('#unit' + units_arr[index]).collapse('show');															
			}						
		}

		//Hide all
		$scope.hideAllUnits = function()
		{
			var index;
			for (index = 0; index < units_arr.length; ++index) 
			{		
				$('#unit' + units_arr[index]).collapse('hide');															
			}			
		}
})