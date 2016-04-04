<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));

//Save new Date (NO CLASSDATE - normal Date!) - todo == 0
/*
@param 

	data - content:
		title : 	Title of Date		
		start : 	Start time 	
		end: 		End Time
		todo :		0 --> Type of todo
*/
if($data->todo == 0)
{
	$dbmod->saveNewHolidays($data->title, $data->start, $data->end);
	
}
//TODO 1 = Getting single-Date-Data
elseif($data->todo == 1)
{
	//Sending to side
	$date = $dbmod->getSingleHoliday($data->id);
	//Check Char-set and save data	

	//Give data to js-script
	echo json_encode($toSide);
}
//Delete a Date
elseif ($data->todo == 2) 
{
	$dbmod->deleteHoliday($data->id);
}
//Delete all Holidays
elseif($data->todo == 3)
{
	$dbmod->deleteAllHolidays();
}

?>