/*

Controlls the Dates (NOT Classdates!) in Calendar-View

*/
app.controller("DateController", function($scope, $http, $state){
		
	//INITIAL DATA

	//dateTodo for correct modal-views and options
	$scope.dateTodo = false;

	/*
		CALENDAR
	*/
	//Loading Calendar
	loadCal();

	//Function to load calendar
   	function loadCal()
   	{
   		$('#calendar').fullCalendar({
			//Language
			lang: 'de',	
			//Weekview inital
	   		defaultView: 'agendaWeek',
	   		//TimeZone
	   		//No all-day-slot
			allDaySlot : false,
			//Minimum-TIme
			minTime: "07:00:00",
			maxTime: "22:00:00",
			//Time scrolled to...
			scrollTime: "07:00:00",
			//Hide Weekend
			hiddenDays: [0,6],
			//Header-Infos for extra-buttons
			header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
			//Datas
			//returndates - normal date
			//freetime - free dates as holidays and so on
			eventSources: [
				//Normal Dates
				'core/app/endpoint/returndates.php',
				'core/app/endpoint/returnholidays.php',
				'core/app/endpoint/returnunits.php'		
			],				
			//Show new Date-Window when onclick on a date
			dayClick:  function(date){	
				$scope.dateTodo = false;
				$scope.$apply();					
				$scope.newDate(date);
			},			
			//Event-Click to change Data (For normale Dates) or change Class-Info (for Classdates)
			eventClick: function(calEvent, jsEvent, view) {
				//Event-ID - Same as in Database
				//preventDefault cause URL is set to ID for enabling clicking on complete date-element
				//but prevent URL-Browser-Activity
				jsEvent.preventDefault();
				if(calEvent['source']['url'] == 'core/app/endpoint/returndates.php')
				{
					$scope.updateDate(calEvent.id);
				}	
				else if(calEvent['source']['url'] == 'core/app/endpoint/returnunits.php')
				{
					$scope.showUnitMod(calEvent.id);
				}			
		    }
        });
   	}

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

	/*
		Date-Modal-Functions
		Located in views/logged/logged_calendar.html

	*/
		//Show Modal
		$scope.newDate = function(date, id)
		{		
			$scope.dateTodo = false;				
			var viewdate = "";	
			if(date == undefined) 
			{
				var moment = $('#calendar').fullCalendar('getDate');
				viewdate = moment.format('YYYY-MM-DD');				
			}
			else 
			{
				viewdate = date.format('YYYY-MM-DD');				
			}
			//Get first day of selected week
			
    		//Get Today and set that as Standard-Startdate
			$("#inputerr").hide();

			//No ID set - just toggle empty new-date-modal
			if(id == undefined)
			{				
				$("#date_title").val("");		
				$("#date_short").val("");		
				$("#date_info").val("");		
				//Initial-Color - relaxed blue
				$("#date_color").val("#68A1BD");		
				$("#date_start").val(viewdate);	
				$("#date_end").val(viewdate);
				$("#date_start_time").val("09:00");	
				$("#date_end_time").val("10:00");
				$("#date_week_end").prop("disabled", true);
				$("#date_week_end").val("");
				$("#date_week_true").prop("checked", false);				
			}
			//ID set  so a date need to change - fill data
			else
			{
				$scope.dateTodo = true;
				$scope.$apply();	
				//Getting Data				
				data = { id : id, todo : 1}
				$http.post("core/app/endpoint/dates.php", data).success(function(response)
			   	{				   		
			   		$("#date_title").val(response['title']);		
					$("#date_short").val(response['d_short']);		
					$("#date_info").val(response['d_long']);		
					//Initial-Color - relaxed blue
					$("#date_color").val(response['color']);		
					$("#date_start").val(response['start']);	
					$("#date_end").val(response['end']);
					$("#date_start_time").val(response['start_time']);	
					$("#date_end_time").val(response['end_time']);					
				});			
				//Setting Scope-Infos for hiding week-options and adding delete-opption
				
			}			
			$("#newdate").modal('toggle');	
		}
		
		//Set End-Date to same Day as Start-Day
		$scope.updateEndDate = function()
		{
			var start_date = $("#date_start").val();
			$("#date_end").val(start_date);	
		}

		//Change End-Time to one Hour from Start-Time
		$scope.updateEndTime = function()
		{
			var start_date_time = $("#date_start_time").val();
			var date = start_date_time.split(":");
			date[0] = parseInt(date[0]) + 1;
			if(date[0] < 10) date[0] = "0" + date[0];
			if(date[0] == "24") date[0] = "00";
			$("#date_end_time").val(date[0] + ":" + date[1]);				
		}

		//Activate WeekDate and Clear Date
		$scope.activateWeek = function()
		{
			if($("#date_week_end").prop("disabled") == true)
			{				
				$("#date_week_end").prop("disabled", false);
				$("#date_week_end").val($("#date_end").val());
			}
			else 
			{
				$("#date_week_end").prop("disabled", true);
				$("#date_week_end").val("");				
			}
		}

		//Validate and save new Date
		$scope.saveNewDate = function()
		{
			//Validate Data
			var data = {
				title : 	$("#date_title").val(),		
				short_info: $("#date_short").val(),		
				info : 		$("#date_info").val(),		
				start : $scope.getMilDate($("#date_start").val(), $("#date_start_time").val()),	
				end: 	$scope.getMilDate($("#date_end").val(), $("#date_end_time").val()),
				week_end: $scope.getMilDate($("#date_week_end").val(), false),
				week_true: $("#date_week_true").prop("checked"),
				color: $("#date_color").val(),
				type : 0,
				todo : 0
			}
			
			//Validate Timeareas and Inputs
			if(data['end'] < data['start'] || 
				(data['week_true'] == true && data['week_end'] < data['end']) ||
				data['title'] == "" || 
				$scope.valTextInput(data['title']) == false ||				
				(data['short_info'] != "" && $scope.valTextInput(data['short_info']) == false) ||
				(data['info'] != "" && $scope.valTextInput(data['info']) == false)
			)
			{
				$scope.errmess = "Falsche Daten! Bitte auf Zeiträume achten und wenigstens Titel angeben. Auf Sonderzeichen achten!";
				$("#inputerr").fadeIn();
			}	
			//All check ok - save new Date to Database		
			else
			{
				//Hide Modal
				$("#newdate").modal('toggle');	
				//Save to Database
				$http.post("core/app/endpoint/dates.php", data).success(function(response)
			   	{				   		
			   		//Reload Calender
			   		$('#calendar').fullCalendar('refetchEvents');
				});	
			}
		}

		//Update a Date
		$scope.updateDate = function(id)
		{
			//Call newDate - undefined for date, id for id
			$scope.actDate = id;
			$scope.newDate(undefined, id);
		}


		//Delete a Date
		$scope.doDeleteDate = function()
		{
			var data = {
				id : $scope.actDate,
				todo : 2
			}			
			$http.post("core/app/endpoint/dates.php", data).success(function(response)
		   	{	
		   		//Reload Calender
		   		$('#calendar').fullCalendar('refetchEvents');		
		   		$("#newdate").modal('toggle');		   		
			});	
		}

		//Do Update Date
		$scope.doUpdateDate = function()
		{
			//Validate Data
			var data = {
				id : $scope.actDate,
				title : 	$("#date_title").val(),		
				short_info: $("#date_short").val(),		
				info : 		$("#date_info").val(),		
				start : $scope.getMilDate($("#date_start").val(), $("#date_start_time").val()),	
				end: 	$scope.getMilDate($("#date_end").val(), $("#date_end_time").val()),
				color: $("#date_color").val(),
				todo : 3
			}
			
			//Validate Timeareas and Inputs
			if(data['end'] < data['start'] || 
				data['title'] == "" || 
				$scope.valTextInput(data['title']) == false ||				
				(data['short_info'] != "" && $scope.valTextInput(data['short_info']) == false) ||
				(data['info'] != "" && $scope.valTextInput(data['info']) == false)
			)
			{
				$scope.errmess = "Falsche Daten! Bitte auf Zeiträume achten und wenigstens Titel angeben. Auf Sonderzeichen achten!";
				$("#inputerr").fadeIn();
			}	
			//All check ok - save new Date to Database		
			else
			{
				//Hide Modal
				$("#newdate").modal('toggle');	
				//Save to Database
				$http.post("core/app/endpoint/dates.php", data).success(function(response)
			   	{	
			   		//Reload Calender
			   		$('#calendar').fullCalendar('refetchEvents');
				});	
			}
		}

		/*

			UNIT MOD SHOWING

		*/
		$scope.showUnitMod = function(unitid)
		{
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
			});	
		}

		//Switch to Classplan
		$scope.switchToClassPlan = function(classid)
		{			
			$("#showunit").modal('toggle');
			$("#showunit").on("hidden.bs.modal", function () {
    			$state.go("logged.classview", {classid:classid});	
			});	
		}

		//Switch to attendance
		$scope.unitAttendance = function(tempunitid)
		{
			$("#showunit").modal('toggle');
			$("#showunit").on("hidden.bs.modal", function () {
    			$state.go("logged.attendance", {unitid:tempunitid});	
			});	
		}
});