<?php


//Getting Databaseobject
require_once '../model/class.dbmod.inc.php';
//SimplyCalDav
require_once('../../simplycaldav/SimpleCalDAVClient.php');

$dbmod = new dbmod();
	
//Getting Data from side
$data = json_decode(file_get_contents("php://input"));
$toSide = [];

//Connect to CalDav

$client = new SimpleCalDAVClient();
try {
	//Normal Connection 
	$caldavdata = $dbmod->getCalDavData();
	if($data->todo != 5)
	{		
		//LOAD DATABASEINFOS AND DE-CRYPT
		$client->connect($caldavdata['caldav_link'], $caldavdata['caldav_user'], $caldavdata['caldav_pass']);
		$arrayOfCalendars = $client->findCalendars(); 
		$client->setCalendar($arrayOfCalendars[$caldavdata['caldav_cal']]);
	}
	//LATER: Add here Infos from Database
	
	//Check Connection
	if($data->todo == 1)
	{		
		$client->setCalendar($arrayOfCalendars[$caldavdata['caldav_cal']]); 
		if(!is_object($arrayOfCalendars)) $toSide['message'] = true;				
	}
	//Insert NORMAL EVENTS
	elseif($data->todo == 2)
	{
		//Create special id to difference dates from each other
		$data_id = "";
		switch($data->type)
		{
			//Normal Event
			case 0:
			{
				$data_id = "N_".$data->id;
			}
			break;
			//Holiday Event
			case 1:
			{
				$data_id = "H_".$data->id;
			}
			break;
			//Unit Event
			case 2:
			{
				$data_id = "U_".$data->id;
			}
			break;
		}

		$event_caldavstring = '
BEGIN:VCALENDAR
PRODID:-//GradeLiWeb//EN
VERSION:2.0
BEGIN:VTIMEZONE
TZID:Europe/Berlin
X-LIC-LOCATION:Europe/Berlin
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
CREATED:'.$data->start.'
LAST-MODIFIED:'.$data->start.'
DTSTAMP:'.$data->start.'
UID:GradeLiWebID_'.$data_id.'
SUMMARY:'.$data->title.'
DTSTART;TZID=Europe/Berlin:'.$data->start.'
DTEND;TZID=Europe/Berlin:'.$data->end.'
LOCATION:
DESCRIPTION:
END:VEVENT
END:VCALENDAR
';		
		$client->create($event_caldavstring);

	}
	//Getting all Events
	elseif($data->todo == 3)
	{
		$events = $client->getEvents('20160101T000000Z', '21991231T000000Z');

		$counter = 0;
		foreach ($events as $event) 
		{
			$toSide[$counter]['href'] = $event->getHref();
			$toSide[$counter]['etag'] = $event->getEtag();
			$toSide[$counter]['data'] = $event->getData();
			$counter++;
		}		
	}
	//Delete Events
	elseif($data->todo == 4)
	{
		$client->delete($data->href, $data->etag);	
	}
	//CHeck new Connection
	elseif($data->todo == 5)
	{
		$link = $data->link;
		$calname = $data->calname;
		$user = $data->user;
		$pass = $data->pass;
		$client->connect($link, $user, $pass);
		$arrayOfCalendars = $client->findCalendars(); 
		$client->setCalendar($arrayOfCalendars[$calname]); 
		if(!is_object($arrayOfCalendars)) {
			//OK - Save to Database
			$toSide['message'] = true;
			$dbmod->updateCalDavData($link, $calname, $user, $pass);
		}		
		else $toSide['message'] = false;
	}
	//Delete CALDAV-Data
	elseif($data->todo == 6)
	{
		$dbmod->deleteCalDavData();
	}
}
catch (Exception $e) {
	$toSide['err'] = true;
	exit;
}

echo json_encode($toSide);

?>