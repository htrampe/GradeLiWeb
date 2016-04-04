<?php
//Get all Dates from Database
//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
$dbmod = new dbmod();

//Get Events for the Area
$events =  $dbmod->getHolidays();

$out = array();
$counter = 0;

while($row = $events->fetch()) 
{	
	//Checking for Summer and Wintertime
	$start_time = new DateTime();
	$start_time->setTimestamp($row['h_start'] / 1000);
	$start = $start_time->format('Y-m-d H:i');
	$end_time = new DateTime();
	$end_time->setTimestamp($row['h_end'] / 1000);
	$end = $end_time->format('Y-m-d H:i');
	$title = $row['title'];
	//Creating data and add to array
    $out[] = array(
        'id' => $row['id'],
        'title' => $title,
        'start' => $start,
        'end' => $end,
        'color' => "#FF590F"
    );	
    $counter++;
}
//Sending to side
echo json_encode($out);
?>