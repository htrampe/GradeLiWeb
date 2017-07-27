<?php

//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));
$toSide = [];


//Check if a date is in Holidays
function checkHoliday($dbmod, $start, $end)
{
	//Get all Holidays
	$holidays = $dbmod->getHolidays();	
	foreach ($holidays as $holarea) 
	{	
		echo $holarea['title'];
		if($holarea['h_start'] <= $start && $holarea['h_end'] >= $end) 
		{			
			return true;
		}
	}
	return false;
}

//Get a single Class
if($data->todo == 0)
{	
	$classdata = $dbmod->getSingleClass($data->id)->fetch();
	$toSide['id'] = $classdata['id'];
	$toSide['w_mouth'] = $classdata['w_mouth'];
	$toSide['w_written'] = $classdata['w_written'];
	$toSide['name'] = $classdata['name'];
	$toSide['info'] = $classdata['info'];
	$toSide['color'] = $classdata['color'];
	$toSide['unitcount'] = $dbmod->getSingleClassUnitCount($data->id);
	echo json_encode($toSide);
}
//Save new Units for Class
elseif($data->todo == 1)
{
	if(!checkHoliday($dbmod, $data->start, $data->end)) $dbmod->saveNewUnit($data->classid, $data->start, $data->end, ("ToDo"));
}
//Get all ClassUnits-Data
elseif($data->todo == 2)
{
	$units = $dbmod->getAllClassUnits($data->id);		
	$counter = 0;
	while($row = $units->fetch())
	{
		$toSide[$counter]['id'] = $row['id'];
		$toSide[$counter]['title'] = $row['title'];
		$toSide[$counter]['short'] = $row['c_short'];
		$toSide[$counter]['long'] = $row['c_long'];
		$toSide[$counter]['start'] = $row['c_start'];
		$toSide[$counter]['end'] = $row['c_end'];		
		$counter++;
	}
	echo json_encode($toSide);
}
//Delete a Class-Unit
elseif($data->todo == 3)
{
	//Delete class Unit
	$dbmod->delUnit($data->id);
}
//Updtae a Unit
elseif($data->todo == 4)
{
	$dbmod->updateUnit($data->id, $data->title, $data->short_info, $data->info);		
}
//Get a single Unit witch Classinfo
elseif($data->todo == 5)
{
	$unit = $dbmod->getUnitWithClass($data->id)->fetch();	

	$toSide['id'] = $unit['id'];
	$toSide['title'] = $unit['title'];
	$toSide['short'] = $unit['c_short'];
	$toSide['long'] = $unit['c_long'];
	$toSide['start'] = $unit['c_start'];
	$toSide['end'] = $unit['c_end'];			
	$toSide['class'] = $unit['classname'];	
	$toSide['classid'] = $unit['classid'];
	$toSide['classsys'] = $unit['system'];
	
	echo json_encode($toSide);
}
//Update Date of a unit
elseif($data->todo == 6)
{
	$dbmod->updateUnitTime($data->id, $data->start, $data->end);	
}
/*
	NOTES DATA
*/
elseif($data->todo == 7)
{
	$classdata = $dbmod->getSingleClass($data->id)->fetch();
	$toSide['id'] = $classdata['id'];
	$toSide['w_mouth'] = $classdata['w_mouth'];
	$toSide['w_written'] = $classdata['w_written'];
	$toSide['name'] = $classdata['name'];
	$toSide['info'] = $classdata['info'];
	$toSide['color'] = $classdata['color'];
	$toSide['unitcount'] = $dbmod->getSingleClassUnitCount($data->id);

	//Get all Cats
	$toSide['cats'] = [];	
	$cats = $dbmod->getAllCats($data->id);
	$counter = 0;
	while($row = $cats->fetch())
	{
		$toSide['cats'][$counter]['id'] = $row['id'];
		$toSide['cats'][$counter]['title'] = $row['title'];
		$toSide['cats'][$counter]['weight'] = $row['weight'];
		$toSide['cats'][$counter]['ocat'] = $row['ocat'];

		//Get All notes for this cat
		$note_cats = $dbmod->getAllNotesCat($row['id']);
		$notecounter = 0;
		while($sndrow = $note_cats->fetch())
		{
			$toSide['cats'][$counter]['notes'][$notecounter]['id'] = $sndrow['id'];
			$toSide['cats'][$counter]['notes'][$notecounter]['title'] = $sndrow['title'];
			$toSide['cats'][$counter]['notes'][$notecounter]['weight'] = $sndrow['weight'];
			$toSide['cats'][$counter]['notes'][$notecounter]['upcat'] = $sndrow['upcat'];
			$notecounter++;
		}
		$counter++;
	}

	//Notes without down-cat
	$toSide['noten'] = [];
	$noten = $dbmod->getNotes($data->id, 'NA');
	$counter = 0;
	while($row = $noten->fetch())
	{
		$toSide['noten'][$counter]['id'] = $row['id'];
		$toSide['noten'][$counter]['title'] = $row['title'];
		$toSide['noten'][$counter]['weight'] = $row['weight'];
		$toSide['noten'][$counter]['upcat'] = $row['upcat'];
		$counter++;
	}
	echo json_encode($toSide);
}
//Save Mass Dates
elseif($data->todo == 8)
{
	if(!checkHoliday($dbmod, $data->start, $data->end))
	{
		$dbmod->saveNewUnit($data->classid, $data->start, $data->end, ("ToDo"));
	} 
	$time_start = strtotime('+1 week', ($data->start / 1000)) * 1000;
	$time_end = strtotime('+1 week', ($data->end / 1000)) * 1000;
	
	//Calculate Day from week_end
	while($time_start <= (($data->week_end+8.64e+7) + 1.65343915344E-9))
	{
		if(!checkHoliday($dbmod, $time_start, $time_end)) 
		{
			$dbmod->saveNewUnit($data->classid, $time_start, $time_end, ("ToDo"));
		}
		$time_start = strtotime('+1 week', ($time_start / 1000)) * 1000;
		$time_end = strtotime('+1 week', ($time_end / 1000)) * 1000;			
	}
}
//Delete mass units
elseif($data->todo == 9)
{
	for($i = 0; $i < sizeof($data->id_to_del); $i++)
	{
		$dbmod->delUnit($data->id_to_del[$i]);
	}
	echo json_encode(true);
}
?>

