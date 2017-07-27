app.controller("LoggedController", function($scope, $http, $state){
	

	checkLoggedFromLogged($http, $state);

	//Check for logged User
	function checkLoggedFromLogged($http, $state)
	{		
		//Check for Sum
		if (localStorage.getItem('user') == undefined)
		{
			$state.go("public.nolog");
		}	
		//User set - check token
		else
		{		
			var data = {
				token : localStorage.getItem('user')			
			}
			try 
			{
				//Checking for token
				$http.post("core/app/endpoint/auth.php", data).success(function(response){
					
					if (response['stat'] == "failed")
					{
						//Check failed - loggoff user
						$http.post("app/endpoint/logoff.php", data).success(function(response){			
							$state.go("public.nolog");	
						});
					}
					//Save Version to Scope		
					else $scope.version = response['version'];		
				});	
			}
			catch(e)
			{
				alert("ERR: Contact Admin!");
			}		
		}
	}

	//Unlogg a User
	$scope.unloggUser = function() {		
		
		//Remove RND-Numb from database
		var data = {
			token : localStorage.getItem('user')
		}

		try 
		{
			$http.post("core/app/endpoint/logoff.php", data).success(function(response){	

				if (response['stat'] == "rmdone")
				{
					localStorage.removeItem('user');
					$state.go("public.nolog");	
				} 
			});	
		}
		catch(e)
		{
			alert("ERR: Contact Admin! YOU STILL LOGGED!");
		}
	}


	//Global Functions
	//Validates Textinput - return false if one data-content has special chars
	/*
	@param

		text - String to check
	*/
	$scope.valTextInput = function(text)
	{
		if(!text.match(/^[A-Za-z0-9!?_\-ßöäüÖÄÜ,.@\u00E0-\u00FC()\r\n\/\-:\"\" ]+$/))
		return false;
		else return true;
	}

	


	//Returns a Millisecond-Date 	
	/*
	@param

		date - date in 2015-02-28 Format
		time - time in 15:30 Format (NO Seconds!)

	Call like that: $scope.getMilDate($("#date_start").val(), $("#date_start_time").val())

	*/	
	$scope.getMilDate = function(date, time){
		if(time == false || time == undefined)
		{
			var date = new Date(date);
		}
		else var date = new Date(date + " " + time);
		return final_time = date.getTime();
	}

	//Create nice Date-String
	/*

	@param

		dateinfo - can be anything wich is compatible with new Date (timestamp, YYYY-MM-DD....)

	*/
	$scope.createDateString = function(dateinfo)
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

	//Create Date-String in input-date-format compatible
	$scope.createDateStringInputDate = function(dateinfo)
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
	    return date.getFullYear() + "-" + month + "-" + day; 
	}

	//Loading Classdatamneu
	$scope.loadingClassDataMenue = function()
	{
		var data = { todo : 1};
		$http.post("core/app/endpoint/classes.php", data).success(function(response){			
			$scope.classes_nav = response;					
		});	
	}

	//Update Logged-Data
	$scope.updateLoggedData = function()
	{
		var data = {
			token : localStorage.getItem('user')
		};
		$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
		{				
			$scope.loggeddata = response;
		});
	}

	//Create Backup
	$scope.createFastBackup = function()
	{
		var data = { todo : 5};
		$http.post("core/sync/backup.php", data).success(function(response){
			if(response['backstat'] != true)
			{
				$("#fastbackup_err").modal('toggle');
			}
			else
			{
				$("#fastbackup_done").modal('toggle');
			}
		});
	}
	
});