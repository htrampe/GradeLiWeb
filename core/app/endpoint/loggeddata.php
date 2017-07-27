<?php

	require_once '../model/class.dbmod.inc.php';
	$dbmod = new dbmod();

	$toSide = [];

	//Gives the Schoolname as String
	$toSide['schoolname'] = utf8_encode("GradeLiWeb");//Data-Array for returning data to side

	//Username
	$token = "";
	
	//Convert LoginInfo to an array
	$data = json_decode(file_get_contents("php://input"));
	
	if(isset($data->token))
	{
		$token = $data->token;		
	}
	
	$checking = $dbmod->checkingAuth();
	//Find Combination of Username and tempnumb to compare the token  to auth the logged-user by server
	while ($row = $checking->fetch()) {
		if(hash('ripemd160', $row['username'].$row['tempnumb']) == $token)
		{
			//Comb found - send ok
			$toSide['username'] = $row['username'];		
			$toSide['synctarget'] = $row['synctarget'];
			$toSide['synctoken'] = $row['synctoken'];
			$toSide['version'] = $row['version'];
			$toSide['show_attendence'] = $row['show_attendence'];
			$toSide['show_mysqlsync'] = $row['show_mysqlsync'];
			$toSide['show_fastbackup'] = $row['show_fastbackup'];
			$toSide['show_unitnote'] = $row['show_unitnote'];
			$toSide['backup_path'] = $row['backup_path'];
			$toSide['backup_pass'] = $row['backup_pass'];
			$toSide['caldav_link'] = $row['caldav_link'];
			$toSide['caldav_cal'] = $row['caldav_cal'];
			$toSide['caldav_user'] = $row['caldav_user'];
			$toSide['caldav_pass'] = $row['caldav_pass'];
			$toSide['google_calendarid'] = $row['google_calendarid'];
			$toSide['google_clientid'] = $row['google_clientid'];
			
			//Replace Special Path-Infos, ""
			$toSide['backup_path'] = str_replace("GG_SEP_DATA_TEMP", DIRECTORY_SEPARATOR, $toSide['backup_path']);

		}
    }
	echo json_encode($toSide);	
?>