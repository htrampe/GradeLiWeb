app.controller("ConfController", function($scope, $http, $state){

	//Act Vear for correct Year
	var tempDate = new Date();
	$scope.actYear = tempDate.getFullYear();
	
	$("#inputerr").hide();
	$("#saveok").hide();
	$("#inputerrs").hide();
	$("#saveoks").hide();
	$("#saveokdump").hide();
	$("#saveerrdump").hide();
	$("#inputerrhol").hide();

	//inital function
	var init = function()	
	{
		//Userdata
		var data = {
			token : localStorage.getItem('user')
		}
		$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
		{
			$scope.userdata = response;					
			$("#username").val($scope.userdata['username']);	
			$("#target").val($scope.userdata['synctarget']);			
			$("#token").val($scope.userdata['synctoken']);					
		});


		//Holidays
		$scope.holfound = true;
		$http.post("core/app/endpoint/returnholidays.php").success(function(response)
	   	{			
	   		//Re-Format the Date				
	   		var index;
			for (index = 0; index < response.length; ++index) {
			    response[index]['start'] = createDateString(response[index]['start']);
			    response[index]['end'] = createDateString(response[index]['end']);	
			}
			if(index == 0) $scope.holfound = false;
			else $scope.holidays = response;				
		});	
	}
	init();

	//Functions

	//Create nice Date-String
	/*

	@param

		dateinfo - can be anything wich is compatible with new Date (timestamp, YYYY-MM-DD....)

	*/
	function createDateString(dateinfo)
	{
		var date = new Date(dateinfo);			    
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

	//Set End-Date to same Day as Start-Day
	$scope.updateEndDate = function()
	{
		var start_date = $("#date_start").val();
		$("#date_end").val(start_date);	
	}	

	//Show Modal
	$scope.newHoliday = function()
	{		
		$("#inputerrhol").hide();							
		$("#date_title").val("");		
		//Initial-Color - relaxed blue
		$("#date_start").val("");	
		$("#date_end").val("");
		$("#newholiday").modal('toggle');	
	}

	//Validate and Save new Holidays
	//Validate and save new Date
	/*
		IMPORTANT: Constant Time for allday-event without need funcion
		of the calendar!
	*/
	$scope.saveNewHoliday = function()
	{
		//Validate Data
		var data = {
			title : $("#date_title").val(),		
			start : $scope.getMilDate($("#date_start").val(), "00:00:01"),	
			end: 	$scope.getMilDate($("#date_end").val(), "23:59:59"),
			todo : 0
		}
		//Validate Timeareas and Inputs
		if(data['end'] < data['start'] || 
			data['title'] == "" || 
			$scope.valTextInput(data['title']) == false
		)
		{
			$scope.errmess = "Falsche Daten! Bitte auf Zeiträume achten und Bezeichnung angeben. Auf Sonderzeichen achten!";
			$("#inputerrhol").fadeIn();
		}	
		//All check ok - save new Date to Database		
		else
		{
			//Hide Modal
			$("#newholiday").modal('toggle');	
			//Save to Database
			$http.post("core/app/endpoint/holidays.php", data).success(function(response)
		   	{	
		   		//Reload Calender
		   		$('#calendar').fullCalendar('refetchEvents');
		   		init();
			});				
		}
	}


	//Delete a Holiday
	$scope.deleteHoliday = function(id)
	{
		//Validate Data
		var data = {
			id : id,
			todo : 2
		}
		$http.post("core/app/endpoint/holidays.php", data).success(function(response)
	   	{	
	   		//Reload Calender
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});			
	}

	//Mass Insert - getting API
	$scope.insertMassHol = function()
	{
		var year = $("#year").val();
		var land = $("#land").val();
		//Insert Holidays
		$http.post("http://api.smartnoob.de/ferien/v1/ferien/?bundesland="+land+"&jahr="+year).success(function(response)
	   	{	
	   		//Reload Calender
	   		var holidays = response['daten'];
	   		var index;
	   		for (index = 0; index < holidays.length; ++index) {
			    var data = {
					title : holidays[index]['title'],		
					start : holidays[index]['beginn']*1000,	
					end: 	holidays[index]['ende']*1000,
					todo : 0
				}	
				$http.post("core/app/endpoint/holidays.php", data).success(function(response){});
			}
			//Reload Calender and View
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});
		
		//Insert Freedays		
		$http.post("http://api.smartnoob.de/ferien/v1/feiertage/?bundesland="+land+"&jahr="+year).success(function(response)
	   	{	

	   		//Reload Calender
	   		var holidays = response['daten'];
	   		var index;
			for (index = 0; index < holidays.length; ++index) {
			    var data = {
					title : holidays[index]['title'],		
					start : holidays[index]['beginn']*1000,	
					end: 	holidays[index]['ende']*1000,
					todo : 0
				}	
				$http.post("core/app/endpoint/holidays.php", data).success(function(response){});
			}
			//Reload Calender and View
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});		
	}

	//Truncate Holiday-Table
	$scope.deleteMassHol = function()
	{
		var data = {
			todo : 3
		}	
		$http.post("core/app/endpoint/holidays.php", data).success(function(response){
			//Reload Calender and View
	   		$('#calendar').fullCalendar('refetchEvents');
	   		init();
		});
	}

	/*
		
		USERDATA

	*/

	//Global Functions
	//Validates Textinput - return false if one data-content has special chars
	/*
	@param

		text - String to check
	*/
	$scope.valTextInputUsername = function(text)
	{
		if(!text.match(/^[a-z]+$/))
		return false;
		else return true;
	}

	//Change Password
	$scope.changePassword = function()
	{
		$("#actpasserr").hide();
		$("#newpasserr_1").hide();
		$("#newpasserr_2").hide();
		$("#passerrmess").hide();
		$("#password_old").val("");
		$("#password_new_1").val("");
		$("#password_new_2").val("");
		$("#changepassword").modal("toggle");
	}

	$scope.updateNewPassword = function()
	{
		var data = {
			actpass : $("#password_old").val(),
			newpass_1 : $("#password_new_1").val(),
			newpass_2 : $("#password_new_2").val(),
			todo : 1
		};
		//Normal Validate
		if(
			data['actpass'] == "" || 
			data['newpass_1'] == "" || 
			data['newpass_2'] == "" || 
			data['newpass_1'] != data['newpass_2'] ||
			!$scope.valTextInput(data['actpass']) ||
				!$scope.valTextInput(data['newpass_1']) ||
				!$scope.valTextInput(data['newpass_2'])
		)
		{
			$scope.passerrmess = "Fehler bei Eingabe. Sonderzeichen beachten! Passwörter müssen gleich sein.";
			$("#passerrmess").show();
		}
		else
		{
			//Checking for right Password
			$("#passerrmess").hide();
			//Classdata
			$http({
				method : "POST",
				data : data,
				url : "core/app/endpoint/userconf.php"
			}).then(
				function successCallback(response)
				{		
					//Update true - reset token	
					if(response['data']['passstat'] == true)
					{
						$("#changepassword").modal("toggle");						
						$("#changepassword").on('hidden.bs.modal', function (e) {
					    	$("#changepassword_confirm").modal("toggle");
					    });
					}	
					else
					{
						$scope.passerrmess = "Fehler bei Eingabe. Passwort falsch.";
						$("#passerrmess").show();
					}
				}
			);		
		}

	}

	$scope.updateUserdata = function()
	{
		var data = {
			username: $("#username").val(),
			oldusername : $scope.userdata['username'],
			todo : 0
		}
		//Validate
		if(
			data['username'] == "" || 
			$scope.valTextInputUsername(data['username']) == false 
		)
		{
			$scope.errmess = "Falsche Daten! Benutzername muss vergeben sein! Auf Sonderzeichen achten (nur a-z bei Benutzername).";
			$("#inputerr").fadeIn();
			$("#inputerr").delay(3000).fadeOut();
		}
		else
		{				
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){						
				if(response['err'] == 0)
				{
					$scope.errmess = "Benutzername bereits vergeben oder wurde nicht geändert.";
					$("#inputerr").fadeIn();
					$("#inputerr").delay(3000).fadeOut();
				}
				//Username updatetet - reset token and show message
				else
				{
					localStorage.setItem("user", response['newtoken']);
					$scope.okmess = "Daten aktualisiert! Anzeige oben aktualisiert sich bei Ansichtswechsel.";
					$("#inputerr").hide();
					$("#saveok").fadeIn();
					$("#saveok").delay(2000).fadeOut();
					init();
				}				
			});
		}
	}

	//Validates Textinput - return false if one data-content has special chars
	/*
	@param

		text - String to check
	*/
	$scope.valTargetInput = function(text)
	{
		if(!text.match(/^[A-Za-z0-9!?_\-ßöäüÖÄÜ,.@()\r\n\:\/ ]+$/))
		return false;
		else return true;
	}

	//Validates Textinput - return false if one data-content has special chars
	/*
	@param

		text - String to check
	*/
	$scope.valTokenInput = function(text)
	{
		if(!text.match(/^[A-Za-z0-9]+$/))
		return false;
		else return true;
	}
	/*

		SYNC

	*/
	$scope.updateSyncDetails = function()
	{
		var data = {
			target: $("#target").val(),
			token: $("#token").val(),
			username: $scope.userdata['username'],
			todo : 2
		}
		//Validate
		if( (data['target'] != "" && $scope.valTargetInput(data['target']) == false) ||
			data['token'] == "" || 
			$scope.valTokenInput(data['token']) == false
		)
		{
			$scope.errmess = "Token darf nicht leer sein. Auf Sonderzeichen achten!";
			$("#inputerrs").fadeIn();
			$("#inputerrs").delay(3000).fadeOut();
		}
		else
		{	
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){				
				$scope.okmess = "Daten gespeichert.";
				$("#inputerrs").hide();
				
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
				  message: "Synchronisationsdaten aktualisiert. Seite muss neu geladen werden.",
				  title: "Daten aktualisiert.",
				  buttons: {			        
					  main: {
					    label: "Seite neu laden.",
					    className: "btn-primary",
				      	callback: function() {
					  	this.modal('hide');
					  	$state.go("logged.calendar");
				      }
				    }
				  }
				});		
			});	
		}
	}

	//Delete Sync-Data
	$scope.deleteSyncDetails = function()
	{
		var data = {todo : 5};
		$http.post("core/app/endpoint/userconf.php", data).success(
			function(response){

				bootbox.dialog({
				  message: "Synchronisationsdaten entfernt. Seite muss neu geladen werden.",
				  title: "Daten aktualisiert.",
				  buttons: {			        
					  main: {
					    label: "Seite neu laden.",
					    className: "btn-primary",
				      	callback: function() {
						  	this.modal('hide');
						  	$state.go("logged.calendar");
				      }
				    }
				  }
				});	
			}
		);
	}

	//Create a MySQL-Dump
	$scope.createDataDump = function()
	{
		var data = { todo : 5};
		$http.post("core/sync/backup.php", data).success(function(response){
			if(response['backstat'] == true)
			{
				$scope.okmess = "Backup gespeichert. Datei sichern und bei Bedarf in die Datenbank importieren. Bei Problemen mail@holgertrampe.de!";
				$("#saveokdump").fadeIn();
				$("#saveokdump").delay(2000).fadeOut();	
			}
			else
			{
				$scope.errmess = "Backup NICHT gespeichert. Bitte Schreibrechte im Ordner Backup anpassen. Bei Problemen mail@holgertrampe.de!";
				$("#saveerrdump").fadeIn();
				$("#saveerrdump").delay(4000).fadeOut();	
			}
			
		});	
	}
})