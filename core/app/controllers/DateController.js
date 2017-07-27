/*

Controlls the Dates (NOT Classdates!) in Calendar-View

*/
app.controller("DateController", function($scope, $http, $state){
		
	//INITIAL DATA
	//Userdata
	var data = {
		token : localStorage.getItem('user')
	}
	$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
	{	
		$scope.userdata = response;		
	});

	//dateTodo for correct modal-views and options
	$scope.dateTodo = false;

	//Initial Data for Calendar-Sync
	$scope.inet_check = false;
	$scope.check_cal = false;
	$scope.loadlocal = false;
	$scope.loading = false;
	$scope.target = 0;
	$scope.act = 0;
	$scope.del_act = 0;
	$scope.del_target = 0;
	$scope.sync_complete = false;
	$scope.loading_done = false;
	$scope.no_sync_need = false;
	$scope.loadlocal_start = false;
	$scope.sync_delete = false;
	$scope.sync_delete_done = false;
	$("#sync_button").attr("disabled", true);
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

		//Return a CalDav-Valide Date-String
		/*

		@param: dastring as "Date"

		*/
		function createCalDavDateString(datestring)
		{
			//Rebuild Start/End
			tempdate = new Date(datestring);
			//Month
			year = tempdate.getFullYear();
			//month = tempdate.getMonth();
			if(tempdate.getMonth() < 9) month = "0" + parseInt(parseInt(tempdate.getMonth())+1);
			else month = "" + parseInt(parseInt(tempdate.getMonth())+1);
			day = "";
			if(tempdate.getDate() < 10) day = "0" + parseInt(tempdate.getDate());
			else day = "" + parseInt(tempdate.getDate());
			hours = "";
			if(tempdate.getHours() < 10) hours = "0" + parseInt(tempdate.getHours());
			else hours = "" + parseInt(tempdate.getHours());
			minutes = "";
			if(tempdate.getMinutes() < 10) minutes = "0" + parseInt(tempdate.getMinutes());
			else minutes = "" + parseInt(tempdate.getMinutes());
			seconds = "";
			if(tempdate.getSeconds() < 10) seconds = "0" + parseInt(tempdate.getSeconds());
			else seconds = "" + parseInt(tempdate.getSeconds());
			return year+month+day+"T"+hours+minutes+seconds;		
		}

		//Upload Data - type for Normal/Units/Holidays
		function prepareCalDav(events, type, counter_target)
		{
			$scope.loading = true;
			caldav_events = new Array();
			for(i = 0; i < events.length; i++)
			{	
				caldav_events[i] = new Array();
				caldav_events[i]['title'] = events[i]['title'].replace(new RegExp('\r?\n','g'), ' ').substr(0,40);		   					
				caldav_events[i]['id'] = events[i]['id'];		   					
				caldav_events[i]['start'] = createCalDavDateString(events[i]['start']);
				caldav_events[i]['end'] = createCalDavDateString(events[i]['end']);								
			}
			counter_act = 0;
			//Upload
			for(i = 0; i < caldav_events.length; i++)
			{
				//Upload normal Dates
				data = {
					todo : 2,
					type : type,
					title : caldav_events[i]['title'],
					id : caldav_events[i]['id'],
					start : caldav_events[i]['start'],
					end : caldav_events[i]['end']					
				}
				$http.post("core/app/endpoint/caldavsync.php", data).success(function(response){
					//Upload Done
					counter_act++;
					//Send Message when everything is done!
					if(counter_target == counter_act ) 
					{
						//console.log("Termin " + counter_act + " von " + counter_target + " bearbeitet. Vorgang abgeschlossen.");
						$scope.target = counter_target;
						$scope.act = counter_act;
						$scope.sync_complete = true;
						$scope.loading_done = true;
						$("#sync_button").prop("disabled", true);
					}
					else 
					{
						$scope.target = counter_target;
						$scope.act = counter_act;
						//console.log("Termin " + counter_act + " von " + counter_target + " bearbeitet.");
					}
				}).finally(function(){
					if($scope.sync_complete) $("#sync_button").attr("disabled", false);
				});
			}						

		}

		//Compare all Events and create two Arrays
		//delete_events = Events which need to be delete on CalDavServer
		//new_events = Events which need to be upload to CalDavServer
		function compare(events_cal, events_normal, events_holidays, events_units)
		{
			$scope.loadlocal = true;
			//Ceck for empty Calendar
			if(events_cal.length == 0)
			{
				//console.log("Kalender leer - lade alles hoch!");
				$scope.complete_sync_done = false;
				counter_target = events_holidays.length + events_normal.length + events_units.length;
				//Upload complete Data
				prepareCalDav(events_normal, 0, counter_target);
				prepareCalDav(events_holidays, 1, counter_target);
				prepareCalDav(events_units, 2, counter_target);
			}
			//Calendar not empty - compare CalDav-Data with local und upload only changes
			else
			{		
				//Load CalDav-Events into an array with important infos
				events_caldav = new Array();
				//Prepare Event-Arrays
				events_upload_normal = new Array();
				events_upload_holidays = new Array();
				events_upload_units = new Array();
				events_delete = new Array();
				for(index = 0; index < events_cal.length; index++)
				{
					events_caldav[index] = new Array();
					events_caldav[index]['href'] = events_cal[index]['href'];
					events_caldav[index]['etag'] = events_cal[index]['etag'];
					splitted_event = events_cal[index]['data'].split("\n");
					//Get ID, Start, End and Summary
					for(i =0; i < splitted_event.length; i++)
					{					
						if(splitted_event[i].includes("UID:"))
						{
							temp_id = splitted_event[i];
							temp_id = temp_id.replace("UID:", "");
							temp_id = temp_id.split("_");
							events_caldav[index]['type'] = temp_id[1];
							events_caldav[index]['id'] = temp_id[2];														
						}
						if(splitted_event[i].includes("SUMMARY:"))
						{
							events_caldav[index]['summary'] = splitted_event[i];
							events_caldav[index]['summary'] = events_caldav[index]['summary'].replace("SUMMARY:", "");
						}
						if(splitted_event[i].includes("DTSTART;TZID=Europe/Berlin:"))
						{
							events_caldav[index]['start'] = splitted_event[i];
							events_caldav[index]['start'] = events_caldav[index]['start'].replace("DTSTART;TZID=Europe/Berlin:", "");
						}
						if(splitted_event[i].includes("DTEND;TZID=Europe/Berlin:"))
						{
							events_caldav[index]['end'] = splitted_event[i];
							events_caldav[index]['end'] = events_caldav[index]['end'].replace("DTEND;TZID=Europe/Berlin:", "");
						}	
					} 		
				}

				//Remove EVents which where deleted from local
				for(i = 0; i < events_caldav.length; i++)
				{
					found = false;
					if(events_caldav[i]['type'] == 'N')
					{
						for(k = 0; k < events_normal.length; k++)
						{
							if(events_normal[k]['id'] == events_caldav[i]['id'])
							{
								found = true;
							}
						}						
					}
					if(events_caldav[i]['type'] == 'H')
					{
						for(k = 0; k < events_holidays.length; k++)
						{
							if(events_holidays[k]['id'] == events_caldav[i]['id'])
							{
								found = true;
							}
						}	
					}
					if(events_caldav[i]['type'] == 'U')
					{
						for(k = 0; k < events_units.length; k++)
						{
							if(events_units[k]['id'] == events_caldav[i]['id'])
							{
								found = true;
							}
						}	
					}
					//EVent not found on local storage - push to delete-Events
					if(!found)
					{
						temp_delete_date = new Array();
						temp_delete_date['href'] = events_caldav[i]['href'];
						temp_delete_date['etag'] = events_caldav[i]['etag']; 
						events_delete.push(temp_delete_date);					
					} 
				}
				//Compare Normalevents
				for(i = 0; i < events_normal.length; i++)
				{
					found = false;
					//Compare with all CalDav-Events
					for(k = 0; k < events_caldav.length; k++)
					{
						//If Normal-Event found
						if(events_caldav[k]['type'] == 'N')
						{ 
							//If Normal-Event found on Server and on Local then compare
							if(events_caldav[k]['id'] == events_normal[i]['id'])
							{					
								found = true;
								if(
									events_caldav[k]['summary'] != events_normal[i]['title'].replace(new RegExp('\r?\n','g'), ' ').substr(0,40) ||
									events_caldav[k]['start'] != createCalDavDateString(events_normal[i]['start']) ||
									events_caldav[k]['end'] != createCalDavDateString(events_normal[i]['end']) 
									)
								{
									//Event Changed
									//Delete on Server and Re-Upload
									events_upload_normal.push(events_normal[i]);
									temp_delete_date = new Array();
									temp_delete_date['href'] = events_caldav[k]['href'];
									temp_delete_date['etag'] = events_caldav[k]['etag']; 
									events_delete.push(temp_delete_date);
								}
								//Nothing to do by else cause event was not changed local						
							}							
						}							
					}			
					//Event not found - upload or
					if(!found)
					{
						events_upload_normal.push(events_normal[i]);
					}
				}

				//Compare Holidys
				for(i = 0; i < events_holidays.length; i++)
				{
					found = false;
					//Compare with all CalDav-Events
					for(k = 0; k < events_caldav.length; k++)
					{
						//If Normal-Event found
						if(events_caldav[k]['type'] == 'H')
						{ 
							//If Normal-Event found on Server and on Local then compare
							if(events_caldav[k]['id'] == events_holidays[i]['id'])
							{					
								found = true;
								if(
									events_caldav[k]['summary'].replace(new RegExp('\r?\n','g'), ' ').substr(0,40) != events_holidays[i]['title'].replace(new RegExp('\r?\n','g'), ' ').substr(0,40) ||
									events_caldav[k]['start'] != createCalDavDateString(events_holidays[i]['start']) ||
									events_caldav[k]['end'] != createCalDavDateString(events_holidays[i]['end']) 
									)
								{
									//Event Changed
									//Delete on Server and Re-Upload
									events_upload_holidays.push(events_holidays[i]);
									temp_delete_date = new Array();
									temp_delete_date['href'] = events_caldav[k]['href'];
									temp_delete_date['etag'] = events_caldav[k]['etag']; 
									events_delete.push(temp_delete_date);
								}
								//Nothing to do by else cause event was not changed local						
							}							
						}							
					}			
					//Event not found - upload or
					if(!found)
					{
						events_upload_holidays.push(events_holidays[i]);
					}
				}

				//Compare Units
				for(i = 0; i < events_units.length; i++)
				{
					found = false;
					//Compare with all CalDav-Events
					for(k = 0; k < events_caldav.length; k++)
					{
						//If Normal-Event found
						if(events_caldav[k]['type'] == 'U')
						{ 
							//If Normal-Event found on Server and on Local then compare
							if(events_caldav[k]['id'] == events_units[i]['id'])
							{					
								found = true;
								if(
									events_caldav[k]['summary'].replace(new RegExp('\r?\n','g'), ' ').substr(0,40) != events_units[i]['title'].replace(new RegExp('\r?\n','g'), ' ').substr(0,40) ||
									events_caldav[k]['start'] != createCalDavDateString(events_units[i]['start']) ||
									events_caldav[k]['end'] != createCalDavDateString(events_units[i]['end']) 
									)
								{
									//Event Changed
									//Delete on Server and Re-Upload
									events_upload_units.push(events_units[i]);
									temp_delete_date = new Array();
									temp_delete_date['href'] = events_caldav[k]['href'];
									temp_delete_date['etag'] = events_caldav[k]['etag']; 
									events_delete.push(temp_delete_date);
								}
								//Nothing to do by else cause event was not changed local						
							}							
						}							
					}			
					//Event not found - upload or
					if(!found)
					{
						events_upload_units.push(events_units[i]);
					}
				}

				//Arrays rdy
				//Delete Events
				counter_delete = events_delete.length;
				counter_delete_act = 0;
				counter_target_upload = events_upload_normal.length + events_upload_holidays.length + events_upload_units.length;
				if(counter_delete > 0)
				{
					$scope.sync_delete = true;
					for(n = 0; n < events_delete.length; n++)
					{				
						data = {
							todo : 4,
							href : events_delete[n]['href'],
							etag : events_delete[n]['etag']									
						}
						$http.post("core/app/endpoint/caldavsync.php", data).success(function(response){
							counter_delete_act++;
							$scope.del_act = counter_delete_act;
							$scope.del_target = counter_delete;
							if(counter_delete == counter_delete_act) 
							{
								if(counter_target_upload > 0)
								{
									$scope.del_act = counter_delete_act;
									$scope.del_target = counter_delete;
									$scope.sync_delete_done = true;
									//console.log("Termine gelöscht. Lade neue Termine hoch.");
									prepareCalDav(events_upload_normal, 0, counter_target_upload);
									prepareCalDav(events_upload_holidays, 1, counter_target_upload);
									prepareCalDav(events_upload_units, 2, counter_target_upload);
								}
								else
								{								
									$scope.sync_complete = true;
									$scope.sync_delete_done = true;
									$("#sync_button").attr("disabled", false);
									//console.log("Keine neuen Termine zum hochladen. Vorgang abgeschlossen.");
								}
							}
							else 
							{
								//console.log("Termin " + counter_delete_act + " von " + counter_delete + " gelöscht.");
								$scope.del_act = counter_delete_act;
								$scope.del_target = counter_delete;
								//console.log($scope.del_act);
								//console.log($scope.del_target);
							}
						});
					}
				}
				else
				{
					if(counter_target_upload > 0)
					{
						$scope.sync_delete_done = true;
						//console.log("Termine gelöscht. Lade neue Termine hoch.");
						prepareCalDav(events_upload_normal, 0, counter_target_upload);
						prepareCalDav(events_upload_holidays, 1, counter_target_upload);
						prepareCalDav(events_upload_units, 2, counter_target_upload);
					}
					else
					{
						$scope.no_sync_need = true;
						$scope.sync_complete = true;
						$("#sync_button").attr("disabled", false);
						//console.log("Keine neuen Termine zum hochladen. Vorgang abgeschlossen.");
					}
				}
			}			

			if($scope.sync_complete) $("#sync_button").attr("disabled", false);
		}

		//Compare Calendar_Server-Events with local Events
		function loadLocalData(events_cal)
		{
			$scope.loadlocal_start = true;
			//Loading all Dates from local Server 		   			
   			$http.get("core/app/endpoint/returndates.php").success(function(response)
   			{	   				
   				events_normal = response;	
   				$http.get("core/app/endpoint/returnholidays.php").success(function(response)
	   			{	
	   				events_holidays = response;	
	   				$http.get("core/app/endpoint/returnunits.php").success(function(response)
		   			{
		   				events_units = response;	
		   				//All Datas loaded - now compare und upload/delete data on CalDav
		   				$scope.loadlocal = true;
		   				compare(events_cal, events_normal, events_holidays, events_units);		   							
		   			});	   							
	   			});	   							
   			});
		}

		//Sync with CalDav
		$scope.syncCalDav = function()
		{
			//Initial Data for Calendar-Sync
			$scope.inet_check = false;
			$scope.check_cal = false;
			$scope.loadlocal = false;
			$scope.loading = false;
			$scope.target = 0;
			$scope.act = 0;
			$scope.del_act = 0;
			$scope.del_target = 0;
			$scope.sync_complete = false;
			$scope.loading_done = false;
			$scope.no_sync_need = false;
			$scope.loadlocal_start = false;
			$scope.sync_delete = false;
			$scope.sync_delete_done = false;	
			$("#sync_button").attr("disabled", true);
			$('#sync_modal').modal({
			    backdrop: 'static',
			    keyboard: false,
			    toggle : true
			})			
			//Check for Internetconnection
			if(navigator.onLine)
			{
				$scope.inet_check = true;
				//Check Connection
				var data = { todo : 1};
				$http.post("core/app/endpoint/caldavsync.php", data).success(function(response)
			   	{	
			   		if(response['message'] != true){
			   			$scope.err_sync = true;
			   			$("#sync_button").attr("disabled", false);
			   			//console.log("Fehler - Link, Zugangsdaten und Passwort prüfen!");	   		
			   		}
			   		else {
			   			$scope.loadlocal_start = true;
			   			$scope.cal_check = true;
			   			$scope.loadlocal_start = true;
			   			//console.log("Kalender gefunden. Beginne Prozess.");
			   			//Get Data from Calendar
						var data = { todo : 3};
						$http.post("core/app/endpoint/caldavsync.php", data).success(function(response)
					   	{	
					   		//console.log(response);
					   		events_from_cal = response;		   		
						}).finally(function(){
							$scope.loadlocal_start = true;
							loadLocalData(events_from_cal);
						});	
			   		}	   	
				});
			}
			else
			{
				$("#sync_button").attr("disabled", false);
				$scope.err_sync = true;
				$scope.inet_check = false;
			}			
		}

		//Clear Caldata until a self-choosen Date
		$scope.clearCalData = function()
		{
			$("#deldate").val("");
			$("#clearcaldata_modal").modal('toggle');
		}

		//Del Dates
		$scope.delDates = function()
		{
			$scope.deleted_dates = 0;
			deldate = $("#deldate").val();
			$("#clearcaldata_modal").modal('toggle');
			$("#clearcaldata_modal").on("hidden.bs.modal", function () {
				//Check for validate Date
				if(deldate.length > 0)
				{
					//Date OK - Next Step
					deldate_milliseconds = new Date(deldate).getTime();
					//Delete Dates and Show OK-Modal
					var data = { todo : 4, until : deldate_milliseconds};
					$http.post("core/app/endpoint/dates.php", data).success(function(response)
				   	{	
				   		//Save deleted Dates and show in Modal
			   			$scope.deleted_dates = response[0];
			   			$("#delcal_ok").modal('show');		
				   		//Reload Calender
				   		$('#calendar').fullCalendar('refetchEvents');   		   		
					});
				}
				//Date Empty - Show Err
				else{
					$("#delcal_err").modal('toggle');
				}     			
			});				
		}


		/*

				GOOGLE CAL FUNCTIONS
		
		*/
		/*
				CREDENTIALS - Replace with Userspec data from mysql-db! ONLY ClientId and CalendarID
		*/
		var CLIENT_ID = "";
		var CALENDAR_ID = "";

		//Necessary for Google-Sync
		var SCOPES = ["https://www.googleapis.com/auth/calendar"];

		$scope.authstat = "";

		/*
			Google-Auth-Check
		*/
		function checkAuth() 
		{
			//Loading Client and Calendar-ID from Scope - pre-load in userdata from logged user	
			CLIENT_ID = $scope.userdata['google_clientid'];
			CALENDAR_ID = $scope.userdata['google_calendarid'];
		
			gapi.auth.authorize(
			{
			'client_id': CLIENT_ID,
			'scope': SCOPES.join(' '),
			'immediate': false
			}, handleAuthResult);
		}

		/**
		* Handle response from authorization server. This is the callback-Function from gapi.auth.authorize
		*
		* @param {Object} authResult Authorization result.
		*/
		function handleAuthResult(authResult) 
		{
			if (authResult && !authResult.error) {
				// Hide auth UI, then load client library.
				$scope.googleSyncContinue();
			}
			else
			{
				$scope.googleSyncErr();
			}
		}

		//Check for upload errors and Re-Upload when 409 is response-result
		function checkForUploadError(response)
		{
			//Update-Var
			var event_request_update = function(event_data) {
			  return gapi.client.calendar.events.update({
	          		'calendarId': CALENDAR_ID,
	          		'eventId' : event_data['eventId'],
	          		'resource': event_data				          
	        	});
			};

			//For Each Execute-Element check for 409-Error "Duplicate Entry"
			for(var obj in response) 
			{ 
				var result = response[obj];
				if(result['error'] != undefined && result['error']['code'] == 409)
				{
					//Getting Date-Data
					var date_data = result['id'].split("dd");
					var date_kind = date_data[1];
					var date_id = date_data[2];

					//Loading Event-Data
					var data = { todo : 2, date_kind : date_kind, id : date_id};
					$http.post("core/app/endpoint/caldav_google.php", data).success(function(resp_server)
					{
						var event = {
						  'eventId' : resp_server['id'],	
				          'summary': resp_server['title'],
				          'start': {
				            'dateTime': resp_server['start'],
				            'timeZone': 'Europe/Berlin'
				          },
				          'end': {
				            'dateTime': resp_server['ende'],
				            'timeZone': 'Europe/Berlin'
				          }								          
				        };

				        var request_upload = gapi.client.calendar.events.update({
			          		'calendarId': CALENDAR_ID,
			          		'eventId' : event['eventId'],
			          		'resource': event				          
	        			});
	        			request_upload.execute();
					});
				}				
			}
		}

		//Continue with GoogleCalSync 
		function listUpcomingEvents() 
		{
			$scope.upload_todo = 0;
			$scope.upload_done = 0;
			//Check for Events in Cal - if Response 0 cal is empty
			var request = gapi.client.calendar.events.list(
			{
				'calendarId': CALENDAR_ID,
				'showDeleted': false,
				'singleEvents': true,
				'orderBy': 'startTime'
			});
			//Execute Request for Events in Calendar
			request.execute(function(resp) 
			{
				//EMpty Calendar - load everything
				if(resp['items'].length == 0)
				{
					$("#calempty").show();
					var data = { todo : 1};
					$http.post("core/app/endpoint/caldav_google.php", data).success(function(response)
					{	
						$("#process_uploading").show();
						$scope.upload_todo = response['maincounter'];
						$scope.upload_done = 0;
						$scope.prepare_local_data = true;
						//Upload Normal-Events
						var batch = gapi.client.newBatch();
						for(i = 0; i < response['normal_events'].length; i++)
						{
							var event = {
					          'summary': response['normal_events'][i]['title'],
					          'start': {
					            'dateTime': response['normal_events'][i]['start'],
					            'timeZone': 'Europe/Berlin'
					          },
					          'end': {
					            'dateTime': response['normal_events'][i]['ende'],
					            'timeZone': 'Europe/Berlin'
					          },
					          'id' : response['normal_events'][i]['id']
					        };
					        
					        var event_request_insert = function(event_data) {
							  return gapi.client.calendar.events.insert({
					          		'calendarId': CALENDAR_ID,
					          		'resource': event_data				          
					        	});
							};

							//Insert first event
							if(i == 0)
							{
								batch.add(event_request_insert(event), {'id' : "" + event['id']});
							}
							//Insert all other events until 50
					        else if(i > 0 && i % 50 != 0)
							{
								batch.add(event_request_insert(event), {'id' : "" + event['id']});	
							} 
							//50 Addeds complete - execute and clear batch
							else if(i > 0 && i % 50 == 0)
							{
								//Execute the Batch-File
								batch.execute();
								//Clear batch-File
								batch = gapi.client.newBatch();
							}
					        $scope.upload_done = $scope.upload_done + 1;				        
						}

						//Holidays
						for(i = 0; i < response['holidays'].length; i++)
						{
							var event = {
					          'summary': response['holidays'][i]['title'],
					          'start': {
					            'dateTime': response['holidays'][i]['start'],
					            'timeZone': 'Europe/Berlin'
					          },
					          'end': {
					            'dateTime': response['holidays'][i]['ende'],
					            'timeZone': 'Europe/Berlin'
					          },
					          'id' : response['holidays'][i]['id']
					        };
					        
					        var event_request_insert = function(event_data) {
							  return gapi.client.calendar.events.insert({
					          		'calendarId': CALENDAR_ID,
					          		'resource': event_data				          
					        	});
							};

							//Insert first event
							if(i == 0)
							{
								batch.add(event_request_insert(event), {'id' : "" + event['id']});
							}
							//Insert all other events until 50
					        else if(i > 0 && i % 50 != 0)
							{
								batch.add(event_request_insert(event), {'id' : "" + event['id']});	
							} 
							//50 Addeds complete - execute and clear batch
							else if(i > 0 && i % 50 == 0)
							{
								//Execute the Batch-File
								batch.execute();
								//Clear batch-File
								batch = gapi.client.newBatch();
							}
					        $scope.upload_done = $scope.upload_done + 1;				        
						}			

						for(i = 0; i < response['classdates'].length; i++)
						{
							var event = {
					          'summary': response['classdates'][i]['title'],
					          'start': {
					            'dateTime': response['classdates'][i]['start'],
					            'timeZone': 'Europe/Berlin'
					          },
					          'end': {
					            'dateTime': response['classdates'][i]['ende'],
					            'timeZone': 'Europe/Berlin'
					          },
					          'id' : response['classdates'][i]['id']
					        };
					        
					        var event_request_insert = function(event_data) {
							  return gapi.client.calendar.events.insert({
					          		'calendarId': CALENDAR_ID,
					          		'resource': event_data				          
					        	});
							};

							//Insert first event
							if(i == 0)
							{
								batch.add(event_request_insert(event), {'id' : "" + event['id']});
							}
							//Insert all other events until 50
					        else if(i > 0 && i % 50 != 0)
							{
								batch.add(event_request_insert(event), {'id' : "" + event['id']});	
							} 
							//50 Addeds complete - execute and clear batch
							else if(i > 0 && i % 50 == 0)
							{
								//Execute the Batch-File
								batch.execute();
								//Clear batch-File
								batch = gapi.client.newBatch();
							}
					        $scope.upload_done = $scope.upload_done + 1;				        
						}
						//Execute rest of events
						batch.execute();
					});

					//All dates uploaded 
					if($scope.upload_todo == $scope.upload_done)
					{
						$scope.process_uploading_stat = true;
						$("#process_completed").show();
						$("#sync_button_google").prop("disabled", false);
					}
				}
				//Items in Calender found - comparealgorithm start
				//WICHTIG: Der GOoglecalendar haut +02:00 an die Zeit...das wegsplitten oder so...Zeitzone ist das
				else
				{		

					//Insert-Var
					var event_request_insert = function(event_data) {
					  return gapi.client.calendar.events.insert({
			          		'calendarId': CALENDAR_ID,
			          		'resource': event_data				          
			        	});
					};

					//Update-Var
					var event_request_update = function(event_data) {
					  return gapi.client.calendar.events.update({
			          		'calendarId': CALENDAR_ID,
			          		'eventId' : event_data['eventId'],
			          		'resource': event_data				          
			        	});
					};

					var event_request_delete = function(event_data) {
					  return gapi.client.calendar.events.delete({
			          		'calendarId': CALENDAR_ID,
			          		'eventId' : event_data['eventId'],
			          		'resource': event_data				          
			        	});
					};

					var upload_counter = 0;
					$scope.main_counter = 0;
					$("#process_compare").show();
					var batch = gapi.client.newBatch();
					response_server = resp['items'];

					//Load all Dates
					var data = { todo : 1};
					$http.post("core/app/endpoint/caldav_google.php", data).success(function(response_local)
					{
						var todelete_id = "";
						var toupload_events = "";
						var toupdate_events = "";
						//Check Holiday-Dates
						for(i = 0; i < response_local['holidays'].length; i++)
						{
							found = false;
							for(k = 0; k < response_server.length; k++)
							{
								//Holidyfoundcheck - nothing to change cause holidays not changeable
								if(response_local['holidays'][i]['id'] == response_server[k]['id'])
								{
									found = true;
								}
							}
							//Date not found on Server - Upload
							if(!found)
							{
								//Upload
								var event = {
						          'summary': response_local['holidays'][i]['title'],
						          'start': {
						            'dateTime': response_local['holidays'][i]['start'],
						            'timeZone': 'Europe/Berlin'
						          },
						          'end': {
						            'dateTime': response_local['holidays'][i]['ende'],
						            'timeZone': 'Europe/Berlin'
						          },
						          'id' : response_local['holidays'][i]['id']
						        };
						        
						        //Add to batch when counter under 50 - else 
								if(upload_counter < 50)
								{
									batch.add(event_request_insert(event), {'id' : "" + event['id']});
									upload_counter = upload_counter + 1;
									$scope.main_counter += 1;									
								}
								//Batch 49 - execute, clear batch, add new date and set counter to one
								else
								{
									//Execute the Batch-File
									batch.execute(function(response){
										checkForUploadError(response);
									});
									//Clear batch-File
									batch = gapi.client.newBatch();
									batch.add(event_request_insert(event), {'id' : "" + event['id']});
									upload_counter = 1;
									$scope.main_counter += 1;
								}			
							}
						}


						//Check Classdates-Dates
						for(i = 0; i < response_local['classdates'].length; i++)
						{
							found = false;
							for(k = 0; k < response_server.length; k++)
							{
								if(response_local['classdates'][i]['id'] == response_server[k]['id'])
								{
									found = true;
									//End Time without Timezone
									var end = response_server[k]['end']['dateTime'].split("+");
									end = end[0];
									//Start Time without Timezone
									var start = response_server[k]['start']['dateTime'].split("+");
									start = start[0];
									
									//Compare and Re-Uploaded when changed
									if(response_local['classdates'][i]['title'] !== response_server[k]['summary'] ||
										response_local['classdates'][i]['ende'] !== end ||
										response_local['classdates'][i]['start'] !== start 
										)
									{
										var event = {
										  'eventId' : response_local['classdates'][i]['id'],	
								          'summary': response_local['classdates'][i]['title'],
								          'start': {
								            'dateTime': response_local['classdates'][i]['start'],
								            'timeZone': 'Europe/Berlin'
								          },
								          'end': {
								            'dateTime': response_local['classdates'][i]['ende'],
								            'timeZone': 'Europe/Berlin'
								          }								          
								        };
										//Upload
										//Add to batch when counter under 50 - else 
										if(upload_counter < 50)
										{
											batch.add(event_request_update(event));
											upload_counter = upload_counter + 1;
											$scope.main_counter += 1;
										}
										//Batch 49 - execute, clear batch, add new date and set counter to one
										else
										{
											//Execute the Batch-File
											batch.execute(function(response){
												checkForUploadError(response);
											});
											//Clear batch-File
											batch = gapi.client.newBatch();
											batch.add(event_request_update(event));
											upload_counter = 1;
											$scope.main_counter += 1;
										}
									}
								}
							}
							//Date not found on Server - Upload
							if(!found)
							{
								var event = {
						          'summary': response_local['classdates'][i]['title'],
						          'start': {
						            'dateTime': response_local['classdates'][i]['start'],
						            'timeZone': 'Europe/Berlin'
						          },
						          'end': {
						            'dateTime': response_local['classdates'][i]['ende'],
						            'timeZone': 'Europe/Berlin'
						          },
						          'id' : response_local['classdates'][i]['id']
						        };
								//Upload
								//Add to batch when counter under 50 - else 
								if(upload_counter < 50)
								{
									batch.add(event_request_insert(event), {'id' : "" + event['id']});
									upload_counter = upload_counter + 1;
									$scope.main_counter += 1;
								}
								//Batch 49 - execute, clear batch, add new date and set counter to one
								else
								{
									//Execute the Batch-File
									batch.execute(function(response){
										checkForUploadError(response);
									});
									//Clear batch-File
									batch = gapi.client.newBatch();
									batch.add(event_request_insert(event), {'id' : "" + event['id']});
									upload_counter = 1;
									$scope.main_counter += 1;
								}
							}
						}

						//Check Holiday-Dates
						for(i = 0; i < response_local['normal_events'].length; i++)
						{
							found = false;
							for(k = 0; k < response_server.length; k++)
							{
								if(response_local['normal_events'][i]['id'] == response_server[k]['id'])
								{
									found = true;
									//End Time without Timezone
									var end = response_server[k]['end']['dateTime'].split("+");
									end = end[0];
									//Start Time without Timezone
									var start = response_server[k]['start']['dateTime'].split("+");
									start = start[0];
									
									//Compare and Re-Uploaded when changed
									if(response_local['normal_events'][i]['title'] !== response_server[k]['summary'] ||
										response_local['normal_events'][i]['ende'] !== end ||
										response_local['normal_events'][i]['start'] !== start 
										)
									{
										var event = {
								          'summary': response_local['normal_events'][i]['title'],
								          'start': {
								            'dateTime': response_local['normal_events'][i]['start'],
								            'timeZone': 'Europe/Berlin'
								          },
								          'end': {
								            'dateTime': response_local['normal_events'][i]['ende'],
								            'timeZone': 'Europe/Berlin'
								          },
								          'eventId' : response_local['normal_events'][i]['id']
								        };
										//Upload
										//Add to batch when counter under 50 - else 
										if(upload_counter < 50)
										{
											batch.add(event_request_update(event));
											upload_counter = upload_counter + 1;
											$scope.main_counter += 1;
										}
										//Batch 49 - execute, clear batch, add new date and set counter to one
										else
										{
											//Execute the Batch-File
											batch.execute(function(response){
												checkForUploadError(response);
											});
											//Clear batch-File
											batch = gapi.client.newBatch();
											batch.add(event_request_update(event));
											upload_counter = 1;
											$scope.main_counter += 1;
										}
									}
								}
							}
							//Date not found on Server - Upload
							if(!found)
							{
								//Upload
								var event = {
						          'summary': response_local['normal_events'][i]['title'],
						          'start': {
						            'dateTime': response_local['normal_events'][i]['start'],
						            'timeZone': 'Europe/Berlin'
						          },
						          'end': {
						            'dateTime': response_local['normal_events'][i]['ende'],
						            'timeZone': 'Europe/Berlin'
						          },
						          'id' : response_local['normal_events'][i]['id']
						        };
								//Upload
								//Add to batch when counter under 50 - else 
								if(upload_counter < 50)
								{
									batch.add(event_request_insert(event), {'id' : "" + event['id']});
									upload_counter = upload_counter + 1;
									$scope.main_counter += 1;
								}
								//Batch 49 - execute, clear batch, add new date and set counter to one
								else
								{
									//Execute the Batch-File
									batch.execute(function(response){
										checkForUploadError(response);
									});
									//Clear batch-File
									batch = gapi.client.newBatch();
									batch.add(event_request_insert(event), {'id' : "" + event['id']});
									upload_counter = 1;
									$scope.main_counter += 1;
								}
							}
						}

						//Check for dates on server which need to delete
						for(k = 0; k < response_server.length; k++)
						{
							found = false;
							for(i = 0; i < response_local['holidays'].length; i++)
							{
								if(response_local['holidays'][i]['id'] == response_server[k]['id'])
								{
									found = true;
								}
							}
							for(i = 0; i < response_local['classdates'].length; i++)
							{
								if(response_local['classdates'][i]['id'] == response_server[k]['id'])
								{
									found = true;
								}
							}
							for(i = 0; i < response_local['normal_events'].length; i++)
							{
								if(response_local['normal_events'][i]['id'] == response_server[k]['id'])
								{
									found = true;
								}
							}
							//Date on Server but was deleted local - delete on server
							if(!found)
							{
								//Upload
								var event = {
						          'eventId' : response_server[k]['id']
						        };
								if(upload_counter < 50)
								{
									batch.add(event_request_delete(event));
									upload_counter = upload_counter + 1;
									$scope.main_counter += 1;
								}
								//Batch 49 - execute, clear batch, add new date and set counter to one
								else
								{
									//Execute the Batch-File
									batch.execute(function(response){
										checkForUploadError(response);
									});
									//Clear batch-File
									batch = gapi.client.newBatch();
									batch.add(event_request_delete(event));
									upload_counter = 1;
									$scope.main_counter += 1;
								}
							}
						}
						batch.execute(function(response){
							checkForUploadError(response);
						});
					});
				}

				//All Done
				$scope.process_uploading_stat = true;
				$scope.process_compar_stat = true;
				$("#process_completed").show();
				$("#sync_button_google").prop("disabled", false);				
			});
		}

		//Main Sync-Function
		$scope.syncWithGoogle = function()
		{
			//Standard-Hide-Divs
			$("#auth_google").hide();
			$("#auth_google_done").hide();
			$("#calempty").hide();
			$("#process_uploading").hide();
			$("#process_completed").hide();
			$("#process_compare").hide();
			$("#sync_button_google").prop("disabled", true);
			$scope.process_uploading_stat = false;
			$scope.process_compar_stat = false;
			$scope.prepare_local_data = false;
			$scope.inet_check_google = "";
			$scope.auth_google = "";
			$scope.main_counter = 0;
			//Show Modal
			$("#sync_modal_google").modal('toggle');
			//I-Net-Check
			if(navigator.onLine)
			{
				$("#auth_google").show();
				$scope.inet_check_google = true;
				//Change Function-Main-Point to checkAuth() - 
				// To focus on real-auth with google
				checkAuth();
			}
			//I-Net FALSE
			else
			{
				$scope.inet_check_google = false;
			}			
		}

		//GoogleAuth-Fail - Show message
		$scope.googleSyncErr = function()
		{
			$("#auth_google").hide();
			$("#auth_google_err").show();
		}

		//Google-Auth-Done and OK - Continue with Calsync
		$scope.googleSyncContinue = function()
		{
			$("#auth_google").hide();
			$("#auth_google_done").show();
			//Load API for GoogleCalendar
			//loadCalendarApi();
			gapi.client.load('calendar', 'v3', listUpcomingEvents);
		}
});