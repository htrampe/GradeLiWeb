app.controller("ClassStudentController", function($scope, $http, $state, $stateParams){


	//Userdata
	var data = {
		token : localStorage.getItem('user')
	}
	$http.post("core/app/endpoint/loggeddata.php", data).success(function(response)
	{
		$scope.userdata = response;	
	});	

	//Init
	var init = function()
	{
		$scope.classid = $stateParams.classid;
		$scope.studentcount = 0;
		//Get Classname
		var data = { 
			id : $scope.classid, 
			todo : 0
		};
		//Classdata
		$http({
			method : "POST",
			data : data,
			url : "core/app/endpoint/class_orga.php"
		}).then(
			function successCallback(response)
			{			
				$scope.classname = response['data']['name'];		
			}
		);		
		//Studentsdata
		var data = { todo : 4, classid: $scope.classid };
		$http({
			method : "POST",
			data : data,
			url : "core/app/endpoint/students.php"
		}).then(
			function successCallback(response)
			{			
				$scope.studentsdata = response['data'][0];
				$scope.studentcount = response['data'][1];
				$scope.sum_average = response['data'][2];
			}
		);
	}
	init();

	/*
		
		Managed Students Section

	*/

	//Show new Student Modal
	$scope.newStudent = function()
	{
		$("#prename").val("");
		$("#name").val("");
		$("#inputerr").hide();
		$("#newstudent").modal('toggle');
	}

	//Validate and Save new Student
	$scope.saveNewStudent = function()
	{
		//Validate Data
		var data = {
			classid : $scope.classid,
			prename : 	$("#prename").val(),		
			name: 		$("#name").val(),		
			todo : 1
		}
		//Validate Inputs
		if(	data['prename'] == "" || 
			$scope.valTextInput(data['prename']) == false ||				
			data['name'] == "" || 
			$scope.valTextInput(data['name']) == false
		)
		{
			$scope.errmess = "Falsche Daten! Vor- und Nachname angeben. Auf Sonderzeichen achten.";
			$("#inputerr").fadeIn();
		}	
		//All check ok - save new Date to Database		
		else
		{				
			//Save to Database
			$http.post("core/app/endpoint/students.php", data).success(function(response)
		   	{				   		
		   		$("#newstudent").modal('toggle');	
		   		init();	   		   		
			});	
			init();				
		}
	}
	/*

		CSV INPUT
	
	*/
	$scope.submitCSV = function()
	{
		file = document.getElementById('csv_file').files[0];    	
		if(file == undefined)
		{
			$scope.csvmess = "Keine CSV-Datei gefunden.";
			$("#csvmod").modal('toggle');
			$scope.progvalue = 100;
			setTimeout(function () {
			  $("#csvmod").modal('toggle');
			}, 2000);
		}
		else
		{
			$scope.csvmess = "Daten werden verarbeitet.";
			$("#csvmod").modal('toggle');
			$scope.progvalue = 50;
			// Parse local CSV file
			Papa.parse(file, {
				complete: function(results) 
				{
					$scope.csvmess = "Import startet.";
					$scope.progvalue = 75;
					var students = results.data;
					//results.data is an array of students
					var index;
					for (index = 1; index < students.length; ++index) {				
						//0 Prename 1 Name
						//Validate and Insert					
						if( students[index][0] != undefined && students[index][1] != undefined &&
							$scope.valTextInput(students[index][0]) != false &&	
							$scope.valTextInput(students[index][1]) != false &&
							students[index][0].length > 0 && students[index][1].length > 0						 
						)
						{
							//Validate Data
							var data = {
								classid : $scope.classid,
								prename : 	students[index][0],		
								name: 		students[index][1],		
								todo : 1
							}
							$http.post("core/app/endpoint/students.php", data).success(function(response){});
							$scope.progvalue = 75;						
						}
					}							
				}
			});	
			//After import reload view
			$scope.csvmess = "Schüler importiert. Neu-Laden wird vorbereitet.";			
			$scope.progvalue = 100;
			setTimeout(function () {
			  $("#csvmod").modal('toggle');
			  $('#csvmod').on('hidden.bs.modal', function () {
	    		init();	
			})		  	
			}, 2000);		
		}		
	}

	//Download CSV-Pre
	$scope.downloadCSV = function()
	{
		window.location.href = "core/assets/gradeliweb_csv_Vorlage.csv";
	}

	//Go To class view
	$scope.toClassView = function()
	{					
		$state.go("logged.classes");	
	}


	/*
	
	CLASS VIEW TO PDF

	*/
	$scope.classViewPDF = function()
	{
		//Create nice Date-Strin
		temp_date = new Date();
		string_date = $scope.createDateString(temp_date.getTime());
		//Columns for Stuff
		var columns = ["Nr.", "Vorname", "Nachname", "UE", "E", "S"];

		if($scope.userdata.show_attendence == 1) 
		{
			columns[6] = "--";
			columns[7] = "-";
			columns[8] = "o";
			columns[9] = "+";
			columns[10] = "++";			
		}
		if($scope.userdata.show_unitnote == 1) 
		{
			columns[columns.length] = "SN(C)";
		}
		columns[columns.length] = "Versp.";
		columns[columns.length] = "S";
		columns[columns.length] = "M";
		columns[columns.length] = "SUM";
		//Rows-Array Content
		var rows = [];
		for (index = 0; index < $scope.studentsdata.length; ++index) 
		{			
			//Push Student to Array
			rows.push([
				parseInt(index+1), 
				$scope.studentsdata[index].prename, 
				$scope.studentsdata[index].name,
				$scope.studentsdata[index].ue.count,
				$scope.studentsdata[index].e.count,
				$scope.studentsdata[index].se.count]);

			if($scope.userdata.show_attendence == 1)
			{
				rows[index][6] = $scope.studentsdata[index].mm;
				rows[index][7] = $scope.studentsdata[index].m;
				rows[index][8] = $scope.studentsdata[index].o;
				rows[index][9] = $scope.studentsdata[index].p;
				rows[index][10] = $scope.studentsdata[index].pp;
			}
			if($scope.userdata.show_unitnote == 1)
			{
				rows[index][rows[index].length] = $scope.studentsdata[index].note + " (" + $scope.studentsdata[index].notecounter + ")";
			}			
				
			rows[index][rows[index].length] = $scope.studentsdata[index].time + " ("+$scope.studentsdata[index].sum_tolate+")";
			rows[index][rows[index].length] = $scope.studentsdata[index].noten_final.written_nf,
			rows[index][rows[index].length] = $scope.studentsdata[index].noten_final.mouth_nf;
			rows[index][rows[index].length] = $scope.studentsdata[index].noten_final.nf;
			
		}		
		
		//PDF
		var doc = new jsPDF('l', 'pt');
		doc.autoTable(columns, rows,
			{
    			margin: {top: 50},
			    beforePageContent: function(data) { 
			        doc.text($scope.classname + " - Klassenübersicht - " + string_date, 40, 30);
			    }
			}
		);
		//Replace Dots in Date for better Filename
		string_date = string_date.replace(".", "_");
		string_date = string_date.replace(".", "_");
		string_date = string_date.replace(".", "_");
		doc.save("GradeLi_Klasse_" + $scope.classname + "_" + string_date + ".pdf");		
	}


	
	//Create one Single Student-Doc-Elemente
	//Need pre-Formated doc and studentsdata/classdata-Array
	$scope.printAllStudents = function()
	{
		//Print Single-View-PDF		
		var doc = new jsPDF('p', 'pt');
		classname = $scope.classname;
		studentsdata_source = $scope.studentsdata;
		temp_date = new Date();
		string_date = $scope.createDateString(temp_date.getTime());
		
		for(i = 0; i < studentsdata_source.length; i++)			
		{
			studentsdata = studentsdata_source[i];
		

			//DATA
			noten = studentsdata['noten_final']['noten'];
			cats = studentsdata['noten_final']['cats'];
			//PDF
			doc.setFontType("bold");
			doc.setFontSize(22);
			doc.text(40, 30, classname + " - " + studentsdata['name'] + ", " + studentsdata['prename'] + " - " + string_date);

			//NOTES
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(40, 60, "Notenaufstellung");

			
			doc.setFontSize(12);
			doc.text(40, 80, "Abschlussnote: " + studentsdata['noten_final']['nf']);
			doc.setFontType("normal");
			doc.text(60, 100, "Mündlich (" + studentsdata['noten_final']['w_mouth'] + "): " + studentsdata['noten_final']['mouth_nf']);
			doc.text(60, 120, "Schriftlich (" + studentsdata['noten_final']['w_written'] + "): " + studentsdata['noten_final']['written_nf']);
			
			//Attendance
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(40, 160, "Anwesenheit");
			doc.setFontType("normal");
			doc.setFontSize(12);
			doc.text(60, 180, "Unentschuldigte Stunden: " + studentsdata.ue.count);
			doc.text(60, 200, "Entschuldigte Stunden: " + studentsdata.e.count);
			doc.text(60, 220, "Schulveranstaltungen: " + studentsdata.se.count);
			doc.text(60, 240, "Verspätung Gesamt: " + studentsdata.time);
			
			border = 0;
			//SINGLENOTES MOUTH
			doc.setFontType("bold");
			doc.setFontSize(16);
			doc.text(40, 280, "Einzelnoten - Mündlich");		
			doc.setFontSize(12);
			doc.text(60, 300, "Ohne Kategorie");	
			doc.setFontType("normal");
			
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
			if((i + 1) < studentsdata_source.length)
			{
				doc.addPage();	
			}			
		}
		//DATE-String for PDF
		string_date = string_date.replace(".", "_");
		string_date = string_date.replace(".", "_");
		string_date = string_date.replace(".", "_");

		//SAVE FInal PDF
		doc.save("Einzelansicht_" + classname + "_" + string_date + ".pdf");		
	}

	/*

		ADD MULTIPLE STUDENTS

	*/
	$scope.newRoster = function()
	{
		$scope.errmessmulti = "";
		$("#inputerrmulti").hide();
		$("#newstudent_multi").modal('toggle');
		$('#multistudents').val("");
	}

	$scope.saveNewStudentMulti = function()
	{
		csv_string = $("#multistudents").val();
		if(csv_string == "" || $scope.valTextInput(csv_string) == false)
		{
			$scope.errmessmulti = "Bitte keine Sonderzeichen eingeben und Daten eintragen.";
			$("#inputerrmulti").fadeIn();
		}		
		else
		{
			$('#newstudent_multi').modal('toggle');
			$('#newstudent_multi').on('hidden.bs.modal', function () 
			{	    		
				$scope.csvmess = "Daten werden verarbeitet.";
				$("#csvmod").modal('toggle');
				$scope.progvalue = 50;
				// Parse local CSV file
				Papa.parse(csv_string, {
					complete: function(results) 
					{
						$scope.csvmess = "Import startet.";
						$scope.progvalue = 75;
						var students = results.data;
						//results.data is an array of students
						var index;
						for (index = 0; index < students.length; ++index) {				
							//Validate and Insert					
							if( students[index][0] != undefined && students[index][1] != undefined &&
								$scope.valTextInput(students[index][0]) != false &&	
								$scope.valTextInput(students[index][1]) != false &&
								students[index][0].length > 0 && students[index][1].length > 0						 
							)
							{
								//Validate Data
								var data = {
									classid : $scope.classid,
									prename : 	students[index][0],		
									name: 		students[index][1],		
									todo : 1
								}
								$http.post("core/app/endpoint/students.php", data).success(function(response){});
								$scope.progvalue = 75;						
							}
						}							
					}
				});	
				//After import reload view
				$scope.csvmess = "Schüler importiert. Neu-Laden wird vorbereitet.";			
				$scope.progvalue = 100;
				//Delete String to prevent Re-Saving Students
				csv_string = "";
				setTimeout(function () {
				  $("#csvmod").modal('toggle');
				  $('#csvmod').on('hidden.bs.modal', function () {
				  		init();	
					})		  	
					}, 2000);
			});
		}
	}
})