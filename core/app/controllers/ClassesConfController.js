app.controller("ClassesConfController", function($scope, $http, $state){


	//Schoolyear
	$scope.schoolyear = false;
	$scope.syid = false;
	$scope.syname = false;

	//Count Copy for copy classes
	$scope.countcopy = 0;

	//Functions
	/*

		INITIAL CLASS LOADING

	*/
	//Loading Scope with Class-Data
	var init = function()
	{	
		check_sy = false;
		syid_temp = false;
		//Check, if there are schooleyears
		var data = { todo : 6};
		$http.post("core/app/endpoint/userconf.php", data).success(function(response){
			$scope.schoolyear = response['syc'];			
			//Save Schoolyearinfos
			if($scope.schoolyear == true)
			{
				check_sy = true;
				$scope.syid = response['syid'];
				$scope.syname = response['syname'];		
				var data = { todo : 1, syid : $scope.syid };				
				$http.post("core/app/endpoint/classes.php", data).success(function(response){
					$scope.classes = response;					
					//Reload Menue
					$scope.loadingClassDataMenue();				
				});				
			}		
		});
	}	
	init();

		/*
			Class-Modal-Functions
			Located in views/logged/logged_classes.html

		*/
		//Show Modal
		$scope.newClass = function(id)
		{		
			$scope.classTodo = false;
			$("#inputerr").hide();

			//No ID set - just toggle empty new-class-modal
			if(id == undefined)
			{				
				$("#class_name").val("");		
				$("#class_info").val("");		
				//Initial-Color - relaxed blue
				$("#class_color").val("#68A1BD");						
			}			
			$("#newclass").modal('toggle');	
		}

		//Validate and save new Class
		$scope.saveNewClass = function()
		{
			//Validate Data
			var data = {
				name : 	$("#class_name").val(),		
				info: $("#class_info").val(),		
				color: $("#class_color").val(),
				system: $("#notesystem").val(),
				syid : $scope.syid,
				todo : 0
			}
			
			//Validate Inputs
			if(data['name'] == "" || 
				$scope.valTextInput(data['name']) == false ||				
				(data['info'] != "" && $scope.valTextInput(data['info']) == false)				
			)
			{
				$scope.errmess = "Falsche Daten! Bitte auf Sonderzeichen achten!";
				$("#inputerr").fadeIn();
			}	
			//All check ok - save new Class to Database		
			else
			{
				//Save to Database
				$http.post("core/app/endpoint/classes.php", data).success(function(response){
					init();
				});							
				//New Loading Scope-Data
				init();
				//Hide Modal
				$("#newclass").modal('toggle');
			}
		}


		//Delete Class
		$scope.doDeleteClass = function(id)
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
			  message: "Achtung! Klasse wird inkl. aller enthaltenen Schüler, Noten und Einheiten gelöscht und kann nicht wiederhergestellt werden. ",
			  title: "Klasse löschen",
			  buttons: {
			    success: {
			      label: "Fortfahren",
			      className: "btn-danger",
			      callback: function() {
			        	//Validate Data
						var data = {
							id : id,
							todo : 2
						}
						$http.post("core/app/endpoint/classes.php", data).success(function(response){
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

		//Update a Class
		$scope.doUpdateClass = function(id)
		{
			//Validate Data
			var data = {
				id : id,
				name : 	$("#class_name_" + id).val(),		
				info: $("#class_info_" + id).val(),		
				color: $("#class_color_" + id).val(),
				todo : 3
			}
			
			//Validate Inputs
			if(data['name'] == "" || 
				$scope.valTextInput(data['name']) == false ||				
				(data['info'] != "" && $scope.valTextInput(data['info']) == false)				
			)
			{
				$scope.errmess = "Falsche Daten! Titel angeben und Sonderzeichen beachten!";
				$("#inputerr_" + id).fadeIn();
				$("#inputerr_" + id).delay(4000).fadeOut();
			}	
			//All check ok - save new Class to Database		
			else
			{
				//Save to Database
				$http.post("core/app/endpoint/classes.php", data).success(function(response){
					//New Loading Scope-Data	
					$scope.okmess = "Daten gespeichert.";
				   	$("#saveok").fadeIn();
					$("#saveok").delay(2000).fadeOut();
					init();						
				});	
			}
			
		}

		//Switching to ClassView
		/*
		@param
				id : Class ID

		*/
		$scope.watchClassPlan = function(id)
		{
			$state.go("logged.classview", {classid:id});	
		}

		//Switching to StudentClassView
		$scope.studentClass = function(id)
		{
			
			$state.go("logged.studentclassview", {classid: id});
		}

		//Copy class
		/*
			
			COPY ONLY STUDENTS, INFOS, FOTOLINKS and CLASSDATA Link name, color, system and info

			NO NOTES/UNITS etc. will be copyied!!!

		*/
		$scope.copyClass = function(classid)
		{
			var data = {todo:4, classid : classid};
			$http.post("core/app/endpoint/classes.php", data).success(function(response){
				//New Loading Scope-Data					
				init();	
			});
		}

		/*

			COPY CLASS PREYEAR

		*/
		//Disabled/Enable SaveCopyButton
		$scope.checkSaveButton = function()
		{
			if($scope.countcopy > 0)
			{
				$("#copyClasses").prop("disabled", false);
			}
			else $("#copyClasses").prop("disabled", true);
		}

		$scope.copyClassPreSY = function()
		{	
			$scope.choosesy = false;
			//Loading all Schoolyears without active Schoolyear
			var data = {todo : 14 };
			$http.post("core/app/endpoint/userconf.php", data).success(function(response){
				$scope.schoolyears = response;				
			});
			$("#copyclasserr").hide();
			$("#copyClass").modal('toggle');
			$scope.countcopy = 0;
			$scope.checkSaveButton();
		}

		//Loading Classes
		$scope.loadClassSy = function()
		{
			syid = $("#schoolyear_choose").val();
			$scope.choosesy = true;
			var data = {
				todo : 5,
				syid : syid
			}
			//Loading Classes with Copy-Checkbox
			$http.post("core/app/endpoint/classes.php", data).success(function(response){
				$scope.sy_classes = response;				
			});
		}

		//Disable/Un-Disable New-Name inputfield
		$scope.copyValue = function(id)
		{			
			if($("#copy_newname_" + id).prop("disabled") == true)
			{
				$("#copy_newname_" + id).prop("disabled", false);				
				$("#copy_newname_" + id).val("");		
				$scope.countcopy = $scope.countcopy + 1;		
			}
			else
			{
				$("#copy_newname_" + id).prop("disabled", true);
				$("#copy_newname_" + id).val("");
				$scope.countcopy = $scope.countcopy - 1;
			}			
			$scope.checkSaveButton();
		}

		//Copy Classes
		$scope.copyClassesSY = function()
		{	
			var index;
			err = false;
			new_name = false;
			for (index = 0; index < Object.keys($scope.sy_classes).length; ++index) {	
				classid = $scope.sy_classes[index]['id'];
				//Check if Class need to Copy
				if($("#copy_" + classid).prop("checked") == true)
				{			
					//Check for new Name
					name = $("#copy_newname_" + classid).val();
					var data = "";
					if(name.length > 0)
					{
						var data = {
							todo : 6, 
							classid : classid,
							syid : $scope.syid,
							name : name
						};	
						new_name = true;
					}
					else
					{
						var data = {
							todo : 7, 
							classid : classid,
							syid : $scope.syid
						};
					}
					//Validate Name					
					if(new_name == true && $scope.valTextInput(data['name']) == false)
					{
						$scope.cperrmess = "Fehler bei neuem Klassennamen. Bitte auf Sonderzeichen achten.";
						$("#copyclasserr").fadeIn();
						$("#copyclasserr").delay(3000).fadeOut();
						err = true;
					}
					else
					//All OK - Copy Class in new Schoolyear
					{	
						$http.post("core/app/endpoint/classes.php", data).success(function(response){});
					}
					new_name = false;
				}				
			}	
			if(!err) 
			{
				$("#copyClass").modal('toggle');
				init();
			}
		}
})