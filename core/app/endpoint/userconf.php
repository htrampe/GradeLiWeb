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
	$classes = $dbmod->getAllClasses();
	$final_string = "";
	if($classes->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `classes` (`id`, `name`, `info`, `color`, `system`, `w_mouth`, `w_written`) VALUES ";
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

echo json_encode($toSide);


?>
