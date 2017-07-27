<?php
//Get all Dates from Database
//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();

//Get Events for the Area
$events =  $dbmod->getEvents();

//Getting Info from actual view-time
$data = json_decode(file_get_contents("php://input"));

//Check for Summertime
$summercheck = new DateTime();
$summercheck->setTimestamp(time());

if($summercheck->format('I') == 1)
{
	$summercheck = true;
}
else $summercheck = false;


$out = array();
$counter = 0;

while($row = $events->fetch()) 
{	
	//Checking for Summer and Wintertime
	$start_time = new DateTime();
	$start_time->setTimestamp($row['d_start'] / 1000);
	if($summercheck && $start_time->format('I') != 1)
	//Summer
	{
		$start_time->setTimestamp($start_time->format('U') + 3600);
	}	
	elseif(!$summercheck && $start_time->format('I') == 1)
	{
		$start_time->setTimestamp($start_time->format('U') - 3600);
	}
	$start = $start_time->format('Y-m-d H:i');

	$end_time = new DateTime();
	$end_time->setTimestamp($row['d_end'] / 1000);
	if($summercheck && $end_time->format('I') != 1)
	//Summer
	{
		$end_time->setTimestamp($end_time->format('U') + 3600);
	}	
	elseif(!$summercheck && $end_time->format('I') == 1)
	{
		$end_time->setTimestamp($end_time->format('U') - 3600);
	}
	$end = $end_time->format('Y-m-d H:i');
	//Create nice and beautiful title
	/*

		if short set = Add short with | between title and short
		if long and short set = Add short and long |-seperator

		if only title is set = return only title

	*/
	$title = "";
	if(strlen($row['d_short']) > 0 && strlen($row['d_long']) == 0)
	{
		$title = $row['title']." | ".$row['d_short'];
	}
	elseif(strlen($row['d_short']) > 0 && strlen($row['d_long']) > 0)
	{
		$title = $row['title']." | ".$row['d_short']." | ".substr($row['d_long'],0,75)."...";
	}
	else $title = $row['title'];
	//Creating data and add to array
    $out[] = array(
        'id' => $row['id'],
        'title' => $title,
        'start' => $start,
        'end' => $end,
        'url' => $row['id'],
        'color' => $row['color']
    );	
    $counter++;

}
//Sending to side
echo json_encode($out);
?>