app.controller("SingleStudentController", function($scope, $http, $state, $stateParams, Upload){


	//Userdata
	var data = {
		token : localStorage.getItem('user')
	}
	$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
	{
		$scope.userdata = response;	
	});	

	var studentid = $stateParams.studentid;
	//Array of all id's students in act class
	$scope.stuarr = [];
	$("#inputerr").hide();
	$("#saveok").hide();
	$("#img_fail").hide();	
	
	//Loading Data	
	var init = function()
	{
		$("#img_fail").hide();	
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
			info : $("#info").val(),
			todo : 5
		}

		if(data['info'] == "") data['info'] = null;
		
		//Validate
		if(	$scope.valTextInput(data['name']) == "" ||	
			$scope.valTextInput(data['prename']) == "" ||	
			$scope.valTextInput(data['name']) == false ||	
			$scope.valTextInput(data['prename']) == false ||				
			(data['info'] != null && data['info'] != "" && $scope.valTextInput(data['info']) == false)
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

	//Print Single Student PDF
	$scope.printStudent = function()
	{
		//Date
		temp_date = new Date();
		string_date = $scope.createDateString(temp_date.getTime());


		//PDF
		var doc = new jsPDF('p', 'pt');
		doc.setFontType("bold");
		doc.setFontSize(22);
		doc.text(40, 30, $scope.classdata.name + " - " + $scope.studentsdata.name + ", " + $scope.studentsdata.prename + " - " + string_date);

		//NOTES
		doc.setFontType("bold");
		doc.setFontSize(16);
		doc.text(40, 60, "Notenaufstellung");

		
		doc.setFontSize(12);
		doc.text(40, 80, "Abschlussnote: " + $scope.classdata.nf);
		doc.setFontType("normal");
		doc.text(60, 100, "Mündlich (" + $scope.classdata.w_mouth + "): " + $scope.classdata.mouth_nf);
		doc.text(60, 120, "Schriftlich (" + $scope.classdata.w_written + "): " + $scope.classdata.written_nf);

		//Attendance
		doc.setFontType("bold");
		doc.setFontSize(16);
		doc.text(40, 160, "Anwesenheit");
		doc.setFontType("normal");
		doc.setFontSize(12);
		doc.text(60, 180, "Unentschuldigte Stunden: " + $scope.studentsdata.ue.count);
		doc.text(60, 200, "Entschuldigte Stunden: " + $scope.studentsdata.e.count);
		doc.text(60, 220, "Schulveranstaltungen: " + $scope.studentsdata.se.count);
		doc.text(60, 240, "Verspätung Gesamt: " + $scope.studentsdata.time);

		border = 0;
		//SINGLENOTES MOUTH
		doc.setFontType("bold");
		doc.setFontSize(16);
		doc.text(40, 280, "Einzelnoten - Mündlich");		
		doc.setFontSize(12);
		doc.text(60, 300, "Ohne Kategorie");	
		doc.setFontType("normal");
		
		noten = $scope.classdata.noten;
		index = 0;
		while(noten[index] != undefined)
		{
			if(noten[index].upcat == "0")
			{
				doc.text(80, 320 + border, noten[index].title + " (" + noten[index].weight + ") - " + noten[index].note.note + " (" + noten[index].note.info + ")");
				border += 20;					
			}			
			index++;
		}
		
		doc.setFontType("bold");
		doc.text(60, 320 + border, "Mit Kategorie");	
		doc.setFontType("normal");

		index = 0;
		cats = $scope.classdata.cats;

		while(cats[index] != undefined)
		{
			if(cats[index].ocat == "0")
			{
				note = cats[index].notes;
				noten_index = 0;
				while(note != undefined && note[noten_index] != undefined)
				{
					if(note[noten_index].upcat == "0")
					{
						doc.text(80, 340 + border, cats[index].title + " - " + note[noten_index].title + " (" + note[noten_index].weight + ") - " + note[noten_index].note.note + " (" + note[noten_index].note.info + ")");
						border += 20;					
					}	
					noten_index++;	
				}				
			}
			index++;
		}

		//SINGLENOTES WRITTEN
		doc.setFontType("bold");
		doc.setFontSize(16);
		doc.text(40, 360 + border, "Einzelnoten - Schriftlich");		
		doc.setFontSize(12);
		doc.text(60, 380 + border, "Ohne Kategorie");	
		doc.setFontType("normal");
		
		noten = $scope.classdata.noten;
		index = 0;
		while(noten[index] != undefined)
		{
			if(noten[index].upcat == "1")
			{
				doc.text(80, 400 + border, noten[index].title + " (" + noten[index].weight + ") - " + noten[index].note.note + " (" + noten[index].note.info + ")");
				border += 20;					
			}			
			index++;
		}
		
		doc.setFontType("bold");
		doc.text(60, 400 + border, "Mit Kategorie");	
		doc.setFontType("normal");

		index = 0;
		cats = $scope.classdata.cats;
		while(cats[index] != undefined)
		{
			if(cats[index].ocat == "1")
			{
				note = cats[index].notes;
				noten_index = 0;
				while(note != undefined && note[noten_index] != undefined)
				{
					if(note[noten_index].upcat == "1")
					{
						doc.text(80, 420 + border, cats[index].title + " - " + note[noten_index].title + " (" + note[noten_index].weight + ") - " + note[noten_index].note.note + " (" + note[noten_index].note.info + ")");
						border += 20;					
					}	
					noten_index++;	
				}				
			}
			index++;
		}
		//Save PDF
		string_date = string_date.replace(".", "_");
		string_date = string_date.replace(".", "_");
		string_date = string_date.replace(".", "_");
		doc.save($scope.classdata.name + "_" + $scope.studentsdata.name + "_" + $scope.studentsdata.prename + "_" + string_date + ".pdf");
	}

	//Uplaod IMG-File
	$scope.uploadImg = function(files)
	{
		//files = file to upload
		filename = files[0]['name'];
		filename_splitted = filename.split(".");
		if(filename_splitted[1] == "jpg" || 
			filename_splitted[1] == "JPG" ||
			filename_splitted[1] == "png" ||
			filename_splitted[1] == "PNG" ||
			filename_splitted[1] == "jpeg" ||
			filename_splitted[1] == "JPEG")
		{
			$("#img_fail").hide();
			$("#img_upload").prop("disabled", false);
		}
		else
		{
			$("#img_fail").fadeIn();		
			$("#img_upload").prop("disabled", true);
		}
	}

	//DO Upload Img
	$scope.doImgUpload = function()
	{
		//Show Loading-Modal
		$("#progressupload").modal('toggle');
		filedata = $("#imgfile").prop('files')[0];
		//name
		//filename = filedata[0]['name'];
		Upload.upload(
		{
			url: 'core/app/endpoint/img_upload.php',
			data: {				
				file: filedata
			}
		}).then(function(resp) 
		{
			// file is uploaded successfully
			if(resp['data'][1])
			{
				//Update Database and reload Scope
				var data = {
					todo : 9, 
					imgpath : (resp['data'][0] + ".jpg"), 
					id : studentid
				};
				$http.post("core/app/endpoint/students.php", data).success(function(response){			
					init();
					$("#progressupload").modal('toggle');	
				});
			}
			//upload fail
			else
			{
				$("#progressupload").modal('toggle');
				$("#progressupload").on("hidden.bs.modal", function () {
    				$("#progressupload_fail").modal('toggle');	
				});	
			}
		});		
	}

	//Delete IMG-File
	$scope.delImg = function()
	{
		var data = {
			todo : 10, 
			id : studentid
		};
		$http.post("core/app/endpoint/students.php", data).success(function(response){			
			init();
		});
	}

})