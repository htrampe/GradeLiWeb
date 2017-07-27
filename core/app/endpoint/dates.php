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
		short_info: Short info		
		info : 		Long Info	
		start : 	Start time 	
		end: 		End Time
		week_end: 	Week End Time
		week_true: 	Is date weekly? True->Yes / False ->No
		todo :		0 --> Type of todo
*/
if($data->todo == 0)
{
	//No Week-Date - just save
	if($data->week_true == false)
	{
		$dbmod->saveNewDate($data->title, $data->short_info, $data->info, $data->start, $data->end, $data->color);
	}
	//Week Date - re-saveing every seven days till week_end
	else
	{
		$dbmod->saveNewDate($data->title, $data->short_info, $data->info, $data->start, $data->end, $data->color);
		//One Week in Mil-Seconds: 604800000
		$time_start = strtotime('+1 week', ($data->start / 1000)) * 1000;
		$time_end = strtotime('+1 week', ($data->end / 1000)) * 1000;
		
		//Calculate Day from week_end
		while($time_start <= (($data->week_end+8.64e+7) + 1.65343915344E-9))
		{
			$dbmod->saveNewDate($data->title, $data->short_info, $data->info, $time_start, $time_end, $data->color);		
			//One Week in Mil-Seconds: 604800000
			$time_start = strtotime('+1 week', ($time_start / 1000)) * 1000;
			$time_end = strtotime('+1 week', ($time_end / 1000)) * 1000;
		}		
	}
}
//TODO 1 = Getting single-Date-Data
elseif($data->todo == 1)
{
	//Sending to side
	$date = $dbmod->getSingleDate($data->id);
	//Check Char-set and save data
	$toSide['title'] = $date['title'];
	$toSide['d_short'] = $date['d_short'];
	$toSide['d_long'] = $date['d_long'];
	$toSide['start'] = date("Y-m-d", $date['d_start'] / 1000);
	$toSide['start_time'] = date("H:i", $date['d_start'] / 1000);
	$toSide['end'] = date("Y-m-d", $date['d_end'] / 1000);
	$toSide['end_time'] = date("H:i", $date['d_end'] / 1000);
	$toSide['color'] = $date['color'];

	//Give data to js-script
	echo json_encode($toSide);
}
//Delete a Date
elseif ($data->todo == 2) 
{
	$dbmod->deleteDate($data->id);
}
//Update a date
elseif($data->todo == 3)
{
	$dbmod->UpdateDate($data->id, $data->title, $data->short_info, $data->info, $data->start, $data->end, $data->color);
}
//Delete all Dates until a specific Time
elseif($data->todo == 4)
{
	$toSide[0] = $dbmod->deleteDateUntil($data->until);
	echo json_encode($toSide);
}

?>