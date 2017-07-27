<?php

	
//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
//SimplyCalDav
require_once('../../simplycaldav/SimpleCalDAVClient.php');

$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));
$toSide = [];

//Upload all Events
if($data->todo == 1)
{
	//Load all Normal Events
	$events_normal = $dbmod->getEvents();
	$events_holdiays = $dbmod->getHolidays();
	$events_classdates = $dbmod->getClassDatesForActSchoolyear();
	$toSide['normal_events'] = "";
	$toSide['holidays'] = "";
	$toSide['classdates'] = "";
	//Re-Write the ID, title and Times from events
	$counter = 0;
	foreach($events_normal as $event)
	{
		//ID - dd is split for correct comparing
		$toSide['normal_events'][$counter]['title'] = $event['title'];
		if($event['d_short'] != "")
		{
			$toSide['normal_events'][$counter]['title'] .= " | ".$event['d_short'];
		}
		if($event['d_long'] != "")
		{
			$toSide['normal_events'][$counter]['title'] .= " | ".$event['d_long'];
		}		

		$date = new DateTime();

		$date->setTimestamp($event['d_start']/1000);
		$toSide['normal_events'][$counter]['start'] = $date->format("Y-m-d")."T".$date->format("H:i:s");
		
		$date->setTimestamp($event['d_end']/1000);
		
		$toSide['normal_events'][$counter]['ende'] = $date->format("Y-m-d")."T".$date->format("H:i:s"); 
		$toSide['normal_events'][$counter]['id'] = "gradeliddndd".$event['id'];
		$counter++;
	}

	//Re-Write the ID, title and Times from events
	//HOLIDYS
	$counter = 0;
	foreach($events_holdiays as $event)
	{
		//ID - dd is split for correct comparing
		$toSide['holidays'][$counter]['title'] = $event['title'];
		
		$date = new DateTime();

		$date->setTimestamp($event['h_start']/1000);
		$toSide['holidays'][$counter]['start'] = $date->format("Y-m-d")."T".$date->format("H:i:s");
		
		$date->setTimestamp($event['h_end']/1000);
		
		$toSide['holidays'][$counter]['ende'] = $date->format("Y-m-d")."T".$date->format("H:i:s"); 
		$toSide['holidays'][$counter]['id'] = "gradeliddhdd".$event['id'];
		$counter++;
	}


	//Re-Write the ID, title and Times from events
	$counter = 0;
	foreach($events_classdates as $event)
	{
		//ID - dd is split for correct comparing
		$toSide['classdates'][$counter]['title'] = $event['name'].' | '.$event['title'];
		if($event['c_short'] != "")
		{
			$toSide['classdates'][$counter]['title'] .= " | ".$event['c_short'];
		}
		if($event['c_long'] != "")
		{
			$toSide['classdates'][$counter]['title'] .= " | ".$event['c_long'];
		}		

		$date = new DateTime();

		$date->setTimestamp($event['c_start']/1000);
		$toSide['classdates'][$counter]['start'] = $date->format("Y-m-d")."T".$date->format("H:i:s");
		
		$date->setTimestamp($event['c_end']/1000);
		
		$toSide['classdates'][$counter]['ende'] = $date->format("Y-m-d")."T".$date->format("H:i:s"); 
		$toSide['classdates'][$counter]['id'] = "gradeliddcdd".$event['id'];
		$counter++;
	}

	//Main-Counter 
	$toSide['maincounter'] = sizeof($toSide['normal_events']) + sizeof($toSide['holidays']) + sizeof($toSide['classdates']);
}
//Load specific event
elseif($data->todo == 2)
{
	if($data->date_kind == "n")	
	{
		$event = $dbmod->getEventById($data->id)->fetch();
		//ID - dd is split for correct comparing
		$toSide['title'] = $event['title'];
		if($event['d_short'] != "")
		{
			$toSide['title'] .= " | ".$event['d_short'];
		}
		if($event['d_long'] != "")
		{
			$toSide['title'] .= " | ".$event['d_long'];
		}		

		$date = new DateTime();

		$date->setTimestamp($event['d_start']/1000);
		$toSide['start'] = $date->format("Y-m-d")."T".$date->format("H:i:s");
		
		$date->setTimestamp($event['d_end']/1000);
		
		$toSide['ende'] = $date->format("Y-m-d")."T".$date->format("H:i:s"); 
		$toSide['id'] = "gradeliddndd".$event['id'];
	}
	elseif($data->date_kind == "h") 
	{
		$event = $dbmod->getHolidaysById($data->id)->fetch();

		//ID - dd is split for correct comparing
		$toSide['title'] = $event['title'];
		
		$date = new DateTime();

		$date->setTimestamp($event['h_start']/1000);
		$toSide['start'] = $date->format("Y-m-d")."T".$date->format("H:i:s");
		
		$date->setTimestamp($event['h_end']/1000);
		
		$toSide['ende'] = $date->format("Y-m-d")."T".$date->format("H:i:s"); 
		$toSide['id'] = "gradeliddhdd".$event['id'];
	}
	elseif($data->date_kind == "c")
	{
		$event = $dbmod->getClassDatesById($data->id)->fetch();	
		//ID - dd is split for correct comparing
		$toSide['title'] = $event['name'].' | '.$event['title'];
		if($event['c_short'] != "")
		{
			$toSide['title'] .= " | ".$event['c_short'];
		}
		if($event['c_long'] != "")
		{
			$toSide['title'] .= " | ".$event['c_long'];
		}		

		$date = new DateTime();

		$date->setTimestamp($event['c_start']/1000);
		$toSide['start'] = $date->format("Y-m-d")."T".$date->format("H:i:s");
		
		$date->setTimestamp($event['c_end']/1000);
		
		$toSide['ende'] = $date->format("Y-m-d")."T".$date->format("H:i:s"); 
		$toSide['id'] = "gradeliddcdd".$event['id'];
	} 

	
}

echo json_encode($toSide);
?>