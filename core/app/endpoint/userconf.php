<?php
//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));
$toSide = [];

function createDataString($values)
{
	$first = true;
	$string = "";
	while($row = $values->fetch(MYSQLI_NUM))
	{
		if($first)
		{
			$string .= "(";
			$first_ele = false;
			foreach($row as $element)
			{
				if(!$first_ele)
				{
					$string .= "'".$element."'";
					$first_ele = true;
				}
				else
				{	
					$string .= ",'".$element."'";
				}
			}
			$string .= ")";	
			$first = false;			
		}
		else
		{
			$string .= ",(";
			$first_ele = false;
			foreach($row as $element)
			{
				if(!$first_ele)
				{
					$string .= "'".$element."'";
					$first_ele = true;
				}
				else
				{	
					$string .= ",'".$element."'";
				}
			}
			$string .= ")";				
		}		
	}
	$string .= ";";

	return $string;
}

//Upatde Username
if($data->todo == 0)
{	
	$username = $data->username;	

	//Check for existing Username
	$checkingusername = $dbmod->checkExistingUsername($username);

	//Username free - change it
	if($checkingusername[0] == 0)
	{
		//Update Username and reset token - new token to side
		$newtoken = $dbmod->updateUsername($username, $data->oldusername);
		$toSide['newtoken'] = hash('ripemd160', $newtoken['username'].$newtoken['tempnumb']);
	}
	//Username already in use
	else
	{		
		$toSide['err'] = 0;
	}	
}
//Update Password
//Checking for correct password
elseif($data->todo == 1)
{
	$newpass_temp = $data->newpass_1;
	$newpass = $dbmod->cryptPass($data->newpass_1);
	$old_pass = $dbmod->cryptPass($data->actpass);

	$password_db = $dbmod->getPass();

	//Passwords equal - update
	if(strcmp($old_pass, $password_db) == 0)
	{
		$toSide['passstat'] = true;		
		//Update Database and send true to re-set token local storage
		$dbmod->updatePassword($newpass_temp);
	}
	//Passwords not equal - err
	else
	{
		$toSide['passstat'] = false;		
	}	
}
//UpdateMySQL-Sync-Data
elseif($data->todo == 2)
{
	$dbmod->updateSyncData($data->username, $data->token, $data->target);
}
//CREATING MASTER-SYNC-STRING
elseif($data->todo == 3)
{
	$truncate_string = "
		TRUNCATE classes; 
		TRUNCATE schoolyear;
		TRUNCATE classdates; 
		TRUNCATE students;
		TRUNCATE unitdata;
		TRUNCATE holidays;
		TRUNCATE note;
		TRUNCATE stunote;
		TRUNCATE dates;
		TRUNCATE cats;
	";

	//CLASSES-String
	$classes = $dbmod->getAllClassesSingle();
	$final_string = "";
	if($classes->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `classes` (`id`, `name`, `info`, `color`, `system`, `w_mouth`, `w_written`, `schoolyear`) VALUES ";
		$final_string .= createDataString($classes);
	}
	
	//Classdates
	$classdates = $dbmod->getAllClassDates();
	if($classdates->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `classdates` (`id`, `title`, `c_short`, `c_long`, `c_start`, `c_end`, `classes_id`) VALUES ";
		$final_string .= createDataString($classdates);
	}
	//Students
	$students = $dbmod->getAllStudentsComp();
	if($students->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `students` (`id`, `name`, `prename`, `info`, `fotolink`, `classes_id`) VALUES ";
		$final_string .= createDataString($students);
	}
	//UNitdata
	$unitdata = $dbmod->getAllUnitDataComp();
	if($unitdata->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `unitdata` (`id`, `notice`, `attendance`, `tolate`, `students_id`, `classdates_id`, `classes_id`) VALUES ";
		$final_string .= createDataString($unitdata);
	}
	//StuNote
	$stunote = $dbmod->getAllStuNoteComp();
	if($stunote->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `stunote` (`id`, `note_id`, `students_id`, `classes_id`, `note`, `info` ) VALUES ";
		$final_string .= createDataString($stunote);	
	}

	//Noten
	$noten = $dbmod->getAllNoteComp();
	if($noten->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `note` (`id`, `classes_id`, `title`, `weight`, `upcat`, `cats_id` ) VALUES ";
		$final_string .= createDataString($noten);	
	}

	//Holidays
	$holidays = $dbmod->getHolidays();
	if($holidays->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `holidays` (`id`, `title`, `h_start`, `h_end`) VALUES ";
		$final_string .= createDataString($holidays);	
	}

	//Dates
	$dates = $dbmod->getEvents();
	if($dates->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `dates` (`id`, `title`, `d_short`, `d_long`, `d_start`, `d_end`, `color`) VALUES ";
		$final_string .= createDataString($dates);	
	}

	//cats
	$cats = $dbmod->getCatsComp();
	if($cats->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `cats` (`id`, `classes_id`, `weight`, `ocat`, `title`) VALUES ";
		$final_string .= createDataString($cats);	
	}	

	//Schoolyear
	$sy = $dbmod->getSYComplete();
	if($sy->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `schoolyear` (`id`, `name`, `status`) VALUES ";
		$final_string .= createDataString($sy);	
	}	

	/*

		FINAL STEPS

	*/
	//Save Actual synctime
	$time = time();
	$dbmod->updateSyncTime($time);

	$final_sql = $truncate_string.$final_string." UPDATE users SET synctime='".$time."' WHERE id = '1';";
	$toSide['sql'] = $final_sql;	

}
//Download Data in insert query to database
elseif($data->todo == 4)
{
	$dbmod->downloadData($data->sql);
}
//Delete MySQL-Sync-Date
elseif($data->todo == 5)
{
	$dbmod->deleteSyncData();
}

/*

	SCHOOLYEAR
	
*/
//Check, if a schoolyear exist
//Returns Counts Schoolyear
elseif($data->todo == 6)
{
	$count_sy = $dbmod->checkForSchoolyear()['0'];
	if($count_sy > 0) {
		$toSide['syc'] = true;
		//Get Active Schoolyear
		$toSide['syid'] = $dbmod->getActiveSY()['id'];
		$toSide['syname'] = $dbmod->getActiveSY()['name'];
	}
	else $toSide['syc'] = false;
}
//Save new Schoolyear
elseif($data->todo == 7)
{
	//Save new Schoolyear and set it to active!
	$dbmod->saveNewSy($data->sy_desc, 1);
}
//Get all Schoolyears
elseif($data->todo == 8)
{
	$schoolyears = $dbmod->getAllSy();
	$i = 0;
	while($row = $schoolyears->fetch())
	{
		$toSide[$i]['id'] = $row['id'];
		$toSide[$i]['name'] = $row['name'];
		$toSide[$i]['status'] = $row['status'];
		$i++;
	}

}
//Get name and id of active schoolyear
elseif($data->todo == 9)
{
	$schoolyeardata = $dbmod->getActiveSY();
	$toSide['name'] = $schoolyeardata['name'];
	$toSide['id'] = $schoolyeardata['id'];	
}
//Update a Schoolyear
elseif($data->todo == 10)
{
	$dbmod->updateSY($data->id, $data->sy_desc);
}
//Set Schoolyear active
elseif($data->todo == 11)
{
	$dbmod->activateSY($data->id);
}
//Get Specific Schoolyear with ID
elseif($data->todo == 12)
{
	$schoolyeardata = $dbmod->getSY($data->id);
	$toSide['name'] = $schoolyeardata['name'];
	$toSide['id'] = $schoolyeardata['id'];		
}
//Delete a Schoolyear with all classes in it
elseif($data->todo == 13)
{
	$classes = $dbmod->getAllClasses($dbmod->getSY($data->id)['id']);	
	while($row = $classes->fetch())
	{
		$dbmod->delClass($row['id']);
	}
	$dbmod->deleteSY($data->id);
}
//Get all Schoolyears witout activeone
elseif($data->todo == 14)
{
	$schoolyears = $dbmod->getAllSyWA();
	$i = 0;
	while($row = $schoolyears->fetch())
	{
		$toSide[$i]['id'] = $row['id'];
		$toSide[$i]['name'] = $row['name'];
		$toSide[$i]['status'] = $row['status'];
		$i++;
	}

}
//Changinge Show_Attendence-Status
elseif($data->todo == 15)
{
	$dbmod->changeShowAtt($data->newstat);
}
//Adding Password for Backup
elseif($data->todo == 16)
{
	$dbmod->saveBackupPass($data->dirpass1);
}
//Adding Backuped Data
elseif($data->todo == 17)
{
	$backupstring = $data->backupstring;
	$password = $data->password;
	$toSide['result'] = $dbmod->uploadBackup($backupstring, $password);
}
//Manage Write-Testing when user insert an alternative path for backup
elseif($data->todo == 18)
{
	//PATH
	$path = $data->path;
	$check = false;
	if($path[sizeof($path)] != DIRECTORY_SEPARATOR)
	{
		$path .= DIRECTORY_SEPARATOR;
	}
	//Check for writing
	$testing = fopen(utf8_decode($path)."testing.txt", "w");
	if(file_exists(utf8_decode($path)."testing.txt"))
	{
		fclose($testing);
		$check = true;
		unlink(utf8_decode($path)."testing.txt");
	}
			
	$toSide['result'] = $check;
}
//Save Path to Database
elseif($data->todo == 19)
{
	$path = $data->path;
	if($path[strlen($path)-1] != DIRECTORY_SEPARATOR)
	{
		$path .= DIRECTORY_SEPARATOR;
	}
	//New Placeholder GG_SEP_DATA_TEMP for Dir-Separator - DO NOT CHANGE!
	$path = str_replace(DIRECTORY_SEPARATOR, "GG_SEP_DATA_TEMP", $path);
	$dbmod->saveBackupPath($path);
	$toSide['result'] = true;
}
//Delete Extra-Path
elseif($data->todo == 20)
{
	$dbmod->removeBackupPath();
}
//Changinge Show_Attendence-Status
elseif($data->todo == 21)
{
	$dbmod->changeShowMySQL($data->newstat);
}
//Changinge Show_FastBackup-Status
elseif($data->todo == 22)
{
	$dbmod->changeShowFastBackup($data->newstat);
}
//Change Show_unitnote Stats
elseif($data->todo == 23)
{
	$dbmod->changeShowUnitNote($data->newstat);
}
//Save new GoogleCal-Data
elseif($data->todo == 24)
{
	$dbmod->updateGoogleData($data->clientid, $data->calid, $data->username);
}
elseif($data->todo == 25)
{
	$dbmod->deleteGoogleData($data->username);
}

echo json_encode($toSide);
?>
