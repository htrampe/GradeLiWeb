<html ng-app="GradeLiWeb">
	<meta charset="utf-8">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <title>GradeLiWeb - Schülerverwaltung</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="core/assets/css/bootstrap.css" rel="stylesheet">
        <link href="core/assets/css/style.css" rel="stylesheet">
    	<!-- Custom styles for this template -->
    	<link href="core/assets/css/offcanvas.css" rel="stylesheet">  
        <!-- CALENDAR -->
        <link href='core/assets/css/fullcalendar.css' rel='stylesheet' />
        <link href='core/assets/css/fullcalendar.print.css' rel='stylesheet' media='print' />
        <!-- TABLE -->
        <link href='core/assets/css/ng-table.min.css' rel='stylesheet' /> 
        <!-- Chart -->
        <link href='core/assets/css/angular-chart.css' rel='stylesheet' /> 

	</head>
	<body>
    	<!-- CONTENT -->
        <div id="main_div_content" ui-view></div>
        <!-- Bootstrap core JavaScript -->
        <script src="core/assets/js/jquery.min.js"></script>
        <!-- Bootstrap -->
        <script src="core/assets/js/bootstrap.min.js"></script>          
        <!-- Bootstrap assets -->
        <link href="core/assets/bootstrap-switch-master/dist/css/bootstrap2/bootstrap-switch.css" rel="stylesheet">
        <script src="core/assets/bootstrap-switch-master/dist/js/bootstrap-switch.js"></script>
        <!-- Angular Router -->
        <script src="core/assets/js/angular.min.js"></script>
        <!--<script src="https://angular-ui.github.io/ui-router/release/angular-ui-router.js"></script>-->
        <script src="core/assets/js/angular-ui-router.min.js"></script>
        <!-- Chart JS -->
        <script src="core/assets/js/chart.js"></script>
        <script src="core/assets/js/angular-chart.js"></script>

        
        <!-- Scripts and Controllers -->
        <script src="core/app.js"></script>
        <script src='core/assets/js/moment.js'></script>
        <script src="core/app/controllers/LoginController.js"></script>   
        <script src="core/app/controllers/PublicController.js"></script> 
        <script src="core/app/controllers/LoggedController.js"></script>   
        <script src="core/app/controllers/TopNavController.js"></script>
        <script src="core/app/controllers/TopNavLoggedController.js"></script> 
        <script src="core/app/controllers/ClassesConfController.js"></script> 
        <script src="core/app/controllers/DateController.js"></script> 
        <script src="core/app/controllers/ConfController.js"></script>
        <script src="core/app/controllers/ClassViewController.js"></script> 
        <script src="core/app/controllers/ClassStudentController.js"></script>
        <script src="core/app/controllers/AttendanceController.js"></script> 
        <script src="core/app/controllers/StudentController.js"></script> 
        <script src="core/app/controllers/SingleStudentController.js"></script>
        <script src="core/app/controllers/NotesController.js"></script> 
        <script src="core/app/controllers/ManageNotesController.js"></script>
        <script src="core/app/controllers/MassUnitsController.js"></script>
       
        <!-- CALENDAR -->
        <script src='core/assets/js/fullcalendar.min.js'></script>
        <script src='core/assets/js/fullcalendar.js'></script>
        <script src='core/assets/js/lang-all.js'></script>

        <!-- PAPA PARSE LICENSE http://papaparse.com/ -->
         <script src="core/assets/js/papaparse.min.js"></script>       
         <script src="core/assets/js/papaparse.js"></script>  

         <!-- Waiting for LICENSE https://github.com/abdennour/bootstrap-waitingfor -->
         <script src="core/assets/js/bootstrap-waitingfor.min.js"></script>       
         <script src="core/assets/js/bootstrap-waitingfor.js"></script>       

          <!--NG Table https://github.com/esvit/ng-table/ -->
         <script src="core/assets/js/ng-table.min.js"></script>   

         <!-- BOOTBOX http://bootboxjs.com/#download -->
        <script src="core/assets/js/bootbox.min.js"></script>
	</body>
</html>

