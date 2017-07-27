<?php
header("Access-Control-Allow-Origin: *");
require_once("../../gw-config.php");
$DBH = new PDO("mysql:host=$host;dbname=$db_name; charset=utf8", $db_user, $db_pass);



//String for Date
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

//GET DATA
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

function getSchoolyearComp($db)
{
	$sql = "SELECT * FROM schoolyear";
	$result = $db->query($sql);
	return $result;
}

function getServerTime($db)
{
	$sql = "SELECT synctime FROM users WHERE id = 1";
	$result = $db->query($sql);
	return $result->fetch()[0];
}

//CREATE SQL-STRING
function getAllData($db)
{
	$create_string = "#GRADELI
		
CREATE TABLE IF NOT EXISTS `cats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classes_id` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `ocat` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `classdates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `c_short` varchar(200) DEFAULT NULL,
  `c_long` varchar(1000) DEFAULT NULL,
  `c_start` mediumtext,
  `c_end` mediumtext,
  `classes_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `info` varchar(1000) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `system` int(11) DEFAULT NULL,
  `w_mouth` varchar(45) DEFAULT NULL,
  `w_written` varchar(45) DEFAULT NULL,
  `schoolyear` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `dates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `d_short` varchar(200) DEFAULT NULL,
  `d_long` varchar(1000) DEFAULT NULL,
  `d_start` mediumtext,
  `d_end` mediumtext,
  `color` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `holidays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `h_start` mediumtext,
  `h_end` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `note` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classes_id` varchar(45) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `weight` varchar(45) DEFAULT NULL,
  `upcat` varchar(45) DEFAULT NULL,
  `cats_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `schoolyear` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `status` int(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `prename` varchar(200) DEFAULT NULL,
  `info` varchar(1000) DEFAULT NULL,
  `fotolink` varchar(1000) DEFAULT NULL,
  `classes_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `stunote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note_id` varchar(45) DEFAULT NULL,
  `students_id` varchar(45) DEFAULT NULL,
  `classes_id` varchar(45) DEFAULT NULL,
  `note` varchar(45) DEFAULT NULL,
  `info` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `unitdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notice` varchar(1000) DEFAULT NULL,
  `attendance` varchar(45) DEFAULT NULL,
  `tolate` varchar(45) DEFAULT NULL,
  `students_id` int(11) DEFAULT NULL,
  `classdates_id` int(11) DEFAULT NULL,
  `classes_id` int(11) DEFAULT NULL,
  `note` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

	//Crypt Database-Information
	$sql = "SELECT backup_pass FROM users";
	$key = $db->query($sql)->fetch()['backup_pass'];
	

	$string = $create_string.$final_string;
	//Encrypt Backup-String and return it to save it in Backup-File
	return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $string, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
}

//Create Backup-String
$backupstring = getAllData($db);

//Save to File
$date = new DateTime();
$date->setTimestamp(time());
$time = $date->format('Y_m_d_H_i_s');

$backupfile = fopen("../../backup/".$time.".sql", "w");

fwrite($backupfile, $backupstring);
fclose($backupfile);

if(file_exists("../../backup/".$time.".sql"))
{
	//If Extra-Path Exist save File to this Place, too
	$path = $db->query("SELECT backup_path FROM users");
	$path = utf8_decode($path->fetch()[0]);
	$toSide['pathsize'] = strlen($path);
	if(strlen($path) > 0)
	{
		$path = str_replace("GG_SEP_DATA_TEMP", DIRECTORY_SEPARATOR, $path);
		copy("../../backup/".$time.".sql", $path.$time.".sql");

		if(!file_exists($path.$time.".sql"))
		{
			$toSide['backstat'] = false;	
		}
		else $toSide['backstat'] = true;

		$directory_backup_path = $path;
		// Returns array of files
		$files = scandir($directory_backup_path);

		// Count number of files and store them to variable..
		$num_files = count($files)-2;
		if($num_files > 10)
		{
			unlink($directory_backup_path.$files[2]);			
		}

	}	
	else $toSide['backstat'] = true;	

	//Delete oldest files - remove last 10 Files
	// Directory
	$directory_backup = "../../backup/";
	// Returns array of files
	$files = scandir($directory_backup);

	// Count number of files and store them to variable..
	$num_files = count($files)-2;
	if($num_files > 10)
	{
		unlink($directory_backup.$files[2]);			
	}
}
else $toSide['backstat'] = false;


echo json_encode($toSide);

?>