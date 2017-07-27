<?php
header("Access-Control-Allow-Origin: *");

//Getting Databaseobject
require_once("../../gw-config.php");

//SYNC FUNCTIONS
//Get Token
function getToken($username, $db)
{
	$sql = "SELECT synctoken FROM users WHERE username = '$username'";
	$result = $db->query($sql);
	return $result->fetch();
}

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

function getAllClasses($db)
{
	$sql = "SELECT * FROM classes";
	$result = $db->query($sql);
	return $result;
}

function getAllClassDates($db)
{
	$sql = "SELECT * FROM classdates";
	$result = $db->query($sql);
	return $result;
}

function getAllStudentsComp($db)
{
	$sql = "SELECT * FROM students";
	$result = $db->query($sql);
	return $result;
}

function getAllUnitDataComp($db)
{
	$sql = "SELECT * FROM unitdata";
	$result = $db->query($sql);
	return $result;
}

function getAllStuNoteComp($db)
{
	$sql = "SELECT * FROM stunote";
	$result = $db->query($sql);
	return $result;
}

function getAllNoteComp($db)
{
	$sql = "SELECT * FROM note";
	$result = $db->query($sql);
	return $result;
}

function getHolidays($db)
{
	$sql = "SELECT * FROM holidays";
	$result = $db->query($sql);
	return $result;
}

function getEvents($db)
{
	$sql = "SELECT * FROM dates";
	$result = $db->query($sql);
	return $result;
}

function getCatsComp($db)
{
	$sql = "SELECT * FROM cats";
	$result = $db->query($sql);
	return $result;
}

function getServerTime($db)
{
	$sql = "SELECT synctime FROM users WHERE id = 1";
	$result = $db->query($sql);
	return $result->fetch()[0];
}

function getSchoolyearComp($db)
{
	$sql = "SELECT * FROM schoolyear";
	$result = $db->query($sql);
	return $result;
}

function getAllData($db)
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
		TRUNCATE schoolyear;
";

	//CLASSES-String
	$final_string = "";
	$classes = getAllClasses($db);
	if($classes->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `classes` (`id`, `name`, `info`, `color`, `system`, `w_mouth`, `w_written`, `schoolyear`) VALUES ";
		$final_string .= createDataString($classes);
	}
	
	//Classdates
	$classdates = getAllClassDates($db);
	if($classdates->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `classdates` (`id`, `title`, `c_short`, `c_long`, `c_start`, `c_end`, `classes_id`) VALUES ";
		$final_string .= createDataString($classdates);
	}
	//Students
	$students = getAllStudentsComp($db);
	if($students->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `students` (`id`, `name`, `prename`, `info`, `fotolink`, `classes_id`) VALUES ";
		$final_string .= createDataString($students);
	}
	//UNitdata
	$unitdata = getAllUnitDataComp($db);
	if($unitdata->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `unitdata` (`id`, `notice`, `attendance`, `tolate`, `students_id`, `classdates_id`, `classes_id`, `note`) VALUES ";
		$final_string .= createDataString($unitdata);
	}
	//StuNote
	$stunote = getAllStuNoteComp($db);
	if($stunote->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `stunote` (`id`, `note_id`, `students_id`, `classes_id`, `note`, `info` ) VALUES ";
		$final_string .= createDataString($stunote);	
	}

	//Noten
	$noten = getAllNoteComp($db);
	if($noten->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `note` (`id`, `classes_id`, `title`, `weight`, `upcat`, `cats_id` ) VALUES ";
		$final_string .= createDataString($noten);	
	}

	//Holidays
	$holidays = getHolidays($db);
	if($holidays->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `holidays` (`id`, `title`, `h_start`, `h_end`) VALUES ";
		$final_string .= createDataString($holidays);	
	}

	//Dates
	$dates = getEvents($db);
	if($dates->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `dates` (`id`, `title`, `d_short`, `d_long`, `d_start`, `d_end`, `color`) VALUES ";
		$final_string .= createDataString($dates);	
	}

	//cats
	$cats = getCatsComp($db);
	if($cats->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `cats` (`id`, `classes_id`, `weight`, `ocat`, `title`) VALUES ";
		$final_string .= createDataString($cats);	
	}
	//Schoolyear
	$schoolyear = getSchoolyearComp($db);
	if($schoolyear->rowCount() > 0)
	{
		$final_string .= "INSERT INTO `schoolyear` (`id`, `name`, `status`) VALUES ";
		$final_string .= createDataString($schoolyear);	
	}
	/*

		FINAL STEPS

	*/	
	return $truncate_string.$final_string." UPDATE users SET synctime='".getServerTime($db)."' WHERE id = '1';";

}

$toSide['stat'] = false;
$data = json_decode(file_get_contents("php://input"));

if(isset($data->token))
{	
	
	//Getting Token from Database and check for same data
	if(strcmp((getToken($data->username, $db)[0]), $data->token) == 0)
	{
		//TOKEN OK - SYNC DATA
		$toSide['stat'] = true;
		//Query
		$toSide['sql'] = getAllData($db);
		//Save new Classes
		echo json_encode($toSide);	
	}
	else echo json_encode($toSide);		
}
else
{
	echo json_encode($toSide);
}

?>