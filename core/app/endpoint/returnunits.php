<?php
//Get all Units from Database
//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();

//Get Units for the Area
//$events = $dbmod->getEvents($start, $end);
$events =  $dbmod->getUnits();

//Getting Info from actual view-time
$data = json_decode(file_get_contents("php://input"));

//Check for Summertime
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
	$start_time->setTimestamp($row['c_start'] / 1000);
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
	$end_time->setTimestamp($row['c_end'] / 1000);
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
	/*

	Info für URL: Wenn man die ID nimmt und da drauf-batscht, dann kann man wohin klicken - hier verlinkung einfügen!!!
		

	*/
	//Create nice and beautiful title
	/*

		if short set = Add short with | between title and short
		if long and short set = Add short and long |-seperator

		if only title is set = return only title

	*/
	$title = "";
	if(strlen($row['c_short']) > 0 && strlen($row['c_long']) == 0)
	{
		$title = $row['title']." | ".$row['c_short'];
	}
	elseif(strlen($row['c_short']) > 0 && strlen($row['c_long']) > 0)
	{
		$title = $row['title']." | ".$row['c_short']." | ".substr($row['c_long'],0,75)."...";
	}
	else $title = $row['title'];
	//Creating data and add to array
    $out[] = array(
        'id' => $row['id'],
        'title' => $row['classname']." - ".$title,
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