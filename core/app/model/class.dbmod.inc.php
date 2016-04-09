<?php
/*

Manage all Database-Stuff form public and logged

*/
class dbmod
{
	//Get DataCon
	private function getDataConn()
	{
		include("../../../gw-config.php");
		return $db;
	}

	//Get the salt
	private function getSalt()
	{
		include("../../.gw-salt");		
		return $salt;
	}

	//PASSWORD
	public function cryptPass($pass)
	{
		$cryptedPass = "";
		$salt = $this->getSalt();
		$cryptedPass = md5($pass.$salt);
		return $cryptedPass;
	}

	//Download data
	public function downloadData($sql)
	{
		$db = $this->getDataConn();
		$db->query($sql);
	}

	//Checking Login
	public function checkLogin($username, $password)
	{
		$db = $this->getDataConn();
		$sql = ("SELECT username, id FROM users WHERE username ='$username' and password='$password'");
		$result = $db->query($sql);
		return $result;
	}

	//Updating Random-Number in Database
	public function updateLogin($numb, $username)
	{
		$db = $this->getDataConn();
		$db->query("UPDATE users SET tempnumb='$numb' WHERE username = '$username'");
	}

	//Checking Authetifiaton
	public function checkingAuth()
	{
		$db = $this->getDataConn();
		$sql = "SELECT username, tempnumb, synctarget, synctoken FROM users";
		$result = $db->query($sql);
		return $result;
	}

	//Unlogg a User
	public function unlogUser($username)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET tempnumb=NULL WHERE username = '$username'";
		$db->query($sql);
	}

	//Update synctime for Single-User
	public function updateSyncTime($time)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET synctime='$time' WHERE id = 1";
		$db->query($sql);
	}

	//Delete Sync Data
	public function deleteSyncData()
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET synctarget = '', synctoken ='', synctime='' WHERE id = 1";
		$db->query($sql);
	}

	//Getting all Events
	public function getEvents()
	{
		
		$db = $this->getDataConn();
		/*$sql = "
			SELECT * FROM dates 
			WHERE d_start >= '$start' AND 
			d_end <= '$end'";
		*/
		$sql = "
			SELECT * FROM dates 
			";
		$result = $db->query($sql);
		return $result;
	}

	//Get Cats complete
	public function getCatsComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM cats";
		$result = $db->query($sql);
		return $result;
	}

	//FUNCTIONS DATE
	//Saving some data
	/*
	@param
		title
		short_info
		info
		start
		end		
		color
		type (0 - normale Date - 1 ClassDate with ClassID)
	*/
	public function saveNewDate($title, $short_info, $info, $start, $end, $color)
	{		
		$db = $this->getDataConn();
		$sql = "INSERT INTO dates (title, d_short, d_long, d_start, d_end, color) VALUES ('$title', '$short_info', '$info', '$start', '$end', '$color')";
		$db->query($sql);			
	}

	/*

			USERDATA

	*/
	public function checkExistingUsername($username)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(*) FROM users WHERE username = '$username'";
		$result = $db->query($sql);				
		return $result->fetch();
	}

	//Update Username and re-build token
	public function updateUsername($username, $old)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET username = '$username' WHERE username = '$old'";
		$db->query($sql);

		$sql = "SELECT username, tempnumb FROM users WHERE username = '$username'";
		$result = $db->query($sql);
		return $result->fetch();
	}

	//Update Password
	public function updatePassword($password)
	{
		$db = $this->getDataConn();
		$password = $this->cryptPass($password);
		$sql = "UPDATE users SET password = '$password' WHERE id = 1";
		$db->query($sql);
	}

	//Get Password
	public function getPass()
	{
		$db = $this->getDataConn();
		$sql = "SELECT password FROM users WHERE id = 1";
		$result = $db->query($sql);
		return $result->fetch()[0];
	}

	//Return on single data by ID	
	public function getSingleDate($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM dates WHERE id = '$id'";
		$result = $db->query($sql);				
		return $result->fetch();
	}

	//Delete single Date
	public function deleteDate($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM dates WHERE id = '$id'";
		$db->query($sql);				
	}

	//Update existing date
	public function UpdateDate($id, $title, $short_info, $info, $start, $end, $color)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE dates SET title = '$title', d_short = '$short_info', d_long = '$info', d_start = '$start', d_end = '$end', color = '$color' WHERE id = '$id'";
		$db->query($sql);	
	}

	/*
		CLASS AREA
	*/
	//Save new Class
	public function saveNewClass($name, $info, $color, $system)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO classes (name, info, color, system, w_mouth, w_written) VALUES ('$name', '$info', '$color', '$system', '50', '50')";
		$db->query($sql);		
	}

	//Get all Classes
	public function getAllClasses()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classes order by name ASC";		
		return $db->query($sql);				
	}

	//Get all Classdates
	public function getAllClassDates()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classdates";		
		return $db->query($sql);	
	}

	//Delete a Class
	//Delete Class from dates (classes_id) and from classes
	public function delClass($id)
	{
		$db = $this->getDataConn();
		$sql = "
				DELETE FROM classdates WHERE classes_id = '$id';
				DELETE FROM students WHERE classes_id = '$id';
				DELETE FROM unitdata WHERE classes_id = '$id';
				DELETE FROM stunote WHERE classes_id = '$id';
				DELETE FROM note WHERE classes_id = '$id';
				DELETE FROM cats WHERE classes_id = '$id';
				DELETE FROM classes WHERE id = '$id'
			";
		$db->query($sql);
	}

	//Updtae Class Data
	public function updateClass($id, $name, $info, $color)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE classes SET name = '$name', info = '$info', color = '$color' WHERE id = '$id'";
		$db->query($sql);
	}

	//get Single Class
	public function getSingleClass($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classes WHERE id = '$id'";		
		return $db->query($sql);
	}

	//Get UnitCount
	public function getSingleClassUnitCount($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(*) AS unitscount FROM classdates WHERE classes_id = '$id'";		
		return $db->query($sql)->fetch()['unitscount'];
	}

	//Units
	public function saveNewUnit($classid, $start, $end, $title)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO classdates (classes_id, title, c_start, c_end) VALUES ('$classid', '$title', '$start', '$end')";
		$db->query($sql);
	}

	//Get all Units for one class
	public function getAllClassUnits($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM classdates WHERE classes_id = '$id' ORDER BY c_start ASC";		
		return $db->query($sql);
	}

	//Get all Units
	public function getUnits()
	{
		$db = $this->getDataConn();
		$sql = "SELECT classdates.id, classdates.title, classdates.c_short, classdates.c_long, classdates.c_start, classdates.c_end, classes.color as color, classes.name as classname FROM classdates JOIN classes ON classdates.classes_id = classes.id";
		$result = $db->query($sql);
		return $result;
	}

	//Get complete StuNote
	public function getAllStuNoteComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM stunote";		
		return $db->query($sql);
	}

	//Get all Unitdata COmplete
	//Get all Units for one class
	public function getAllUnitDataComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM unitdata";		
		return $db->query($sql);
	}

	//Get all Note
	public function getAllNoteComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM note";		
		return $db->query($sql);
	}


	//Delete a Unit
	public function delUnit($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM unitdata WHERE classdates_id = '$id'; DELETE FROM classdates WHERE id = '$id'";
		$db->query($sql);
	}

	//Update a Unit
	public function updateUnit($id, $title, $short_info, $info)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE classdates SET title = '$title', c_short = '$short_info', c_long = '$info' WHERE id = '$id'";
		$db->query($sql);
	}

	//get a single unit with Classinfo for Modal-Window and link to Classplan
	public function getUnitWithClass($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT classes.id as classid, classdates.id, classdates.title, classdates.c_short, classdates.c_long, classdates.c_start, classdates.c_end, classes.name as classname FROM classdates JOIN classes ON classdates.classes_id = classes.id WHERE classdates.id = '$id'";
		$result = $db->query($sql);
		return $result;
	}

	//Updae a time of a unit
	public function updateUnitTime($id, $start, $end)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE classdates SET c_start = '$start', c_end = '$end' WHERE id = '$id'";
		$db->query($sql);
	}

	/*

		STUDENTS

	*/
	//Save new Student
	public function saveNewStudent($classid, $name, $prename)	
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO students (classes_id, name, prename) VALUES ('$classid', '$name', '$prename')";
		$db->query($sql);
	}

	//Save new Student
	public function saveNewStudentCopy($classid, $name, $prename, $info, $fotolink)	
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO students (classes_id, name, prename, info, fotolink) VALUES ('$classid', '$name', '$prename', '$info', '$fotolink')";
		$db->query($sql);
	}

	//Get all Students from one Class
	public function getAllStudentsClass($classid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT id, name, prename, info, fotolink FROM students WHERE classes_id = '$classid' ORDER BY name ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Check if a student has a data-set for a unit
	public function checkForUnitStuData($unitid, $studentid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(*) AS unitsstu FROM unitdata WHERE classdates_id = '$unitid' AND students_id = '$studentid'";		
		return $db->query($sql)->fetch()['unitsstu'];
	}

	//Create inital Dataset
	public function newUnitStuData($unitid, $studentid, $attendance, $classid)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO unitdata (classdates_id, students_id, attendance, classes_id) VALUES ('$unitid', '$studentid', '$attendance', '$classid')";
		$db->query($sql);
	}

	//Getting SUM UE
	public function getUnitSumUE($unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(attendance) FROM unitdata WHERE classdates_id = '$unitid' AND attendance = '0' ";
		return $db->query($sql)->fetch()[0];
	}



	//Getting SUM E	
	public function getUnitSumE($unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT COUNT(attendance) FROM unitdata WHERE classdates_id = '$unitid' AND attendance = '1' ";
		return $db->query($sql)->fetch()[0];
	}

	//Get a Unit
	public function getUnit($unitid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT 
		unitdata.id, students.id, students.fotolink, students.name, students.prename, unitdata.classdates_id, unitdata.students_id, unitdata.attendance, unitdata.tolate, unitdata.notice  
		FROM unitdata JOIN students ON unitdata.students_id = students.id WHERE classdates_id = '$unitid' ORDER BY students.name ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Updtae UnitAttendance
	public function upAtt($unitid, $studentid, $attendance)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE unitdata SET attendance = '$attendance' WHERE classdates_id = '$unitid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Updtae the Time
	public function upTime($unitid, $studentid, $time)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE unitdata SET tolate = '$time' WHERE classdates_id = '$unitid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Update Notice
	public function upNotice($unitid, $studentid, $notice)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE unitdata SET notice = '$notice' WHERE classdates_id = '$unitid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Get all Students in Database
	public function getAllStudents()
	{
		$db = $this->getDataConn();
		$sql = "SELECT students.id as studentsid, classes.id as classid, students.name, students.prename, classes.name as classname FROM students JOIN classes ON students.classes_id = classes.id ORDER BY students.name ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Get all Students in Database COMPLETE
	public function getAllStudentsComp()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM students";
		$result = $db->query($sql);
		return $result;
	}

	//Get single Student with Data from all Units
	public function getSingleStudent($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT 
			students.id, students.name, students.prename, students.fotolink, students.info,
			classes.name as classname, classes.id as classid
			FROM students 
			JOIN classes ON students.classes_id = classes.id 
			WHERE students.id = '$id'
			ORDER BY students.name ASC
			";
		$result = $db->query($sql);
		return $result;
	}

	//Get single Student with Data from all Units 
	public function getSingleStudentUD($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT 
			students.id, students.name, students.prename, students.fotolink, students.info,
			classes.name as classname, classes.id as classid, 
			unitdata.id as unitid, unitdata.attendance, unitdata.tolate, unitdata.notice,
            classdates.c_start as date_start, classdates.c_end as date_end, classdates.title as unittitle, unitdata.classdates_id as classdateid
			FROM students 
			JOIN classes ON students.classes_id = classes.id 
			JOIN unitdata ON unitdata.students_id = students.id
			JOIN classdates ON classdates.id = unitdata.classdates_id
			WHERE students.id = '$id'
			ORDER BY classdates.c_start ASC
			";
		$result = $db->query($sql);
		return $result;
	}

	//Update a Student
	public function updateStudent($id, $name, $prename, $foto, $info)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE students SET name = '$name', prename = '$prename', fotolink = '$foto', info = '$info' WHERE id = '$id'";
		$db->query($sql);
	}

	/*

		HOLIDAYS

	*/
	public function saveNewHolidays($title, $start, $end)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO holidays (title, h_start, h_end) VALUES ('$title', '$start', '$end')";
		$db->query($sql);
	}

	
	//get all Holidays
	public function getHolidays()
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM holidays ORDER BY h_start ASC";
		$result = $db->query($sql);
		return $result;
	}

	//Delete a Holiday
	public function deleteHoliday($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM holidays WHERE id = '$id'";
		$db->query($sql);
	}

	//Truncate Holidays
	public function deleteAllHolidays()
	{
		$db = $this->getDataConn();
		$sql = "TRUNCATE holidays";
		$db->query($sql);
	}


	/*

		SYNC

	*/
	public function updateSyncData($username, $token, $target)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE users SET synctarget = '$target', synctoken = '$token' WHERE username = '$username'";
		$db->query($sql);
	}

	//Get Token
	public function getToken($username)
	{
		$db = $this->getDataConn();
		$sql = "SELECT synctoken FROM users WHERE username = '$username'";
		$result = $db->query($sql);
		return $result->fetch();
	}

	/*
		NOTES

	*/
	public function updateWeight($classid, $weight, $kind)
	{
		$db = $this->getDataConn();
		if($kind == 0)	$sql = "UPDATE classes SET w_mouth = '$weight' WHERE id = '$classid'";
		if($kind == 1)	$sql = "UPDATE classes SET w_written = '$weight' WHERE id = '$classid'";
		$db->query($sql);
	}	

	//New Cat
	public function newCat($classid, $kind)
	{
		$db = $this->getDataConn();
		if($kind == 0)	$sql = "INSERT INTO cats (title, classes_id, weight, ocat) VALUES ('Neue Kategorie', '$classid', '100', 0)";
		if($kind == 1)	$sql = "INSERT INTO cats (title, classes_id, weight, ocat) VALUES ('Neue Kategorie', '$classid', '100', 1)";
		$db->query($sql);
	}

	//Get all Cats of one Class
	public function getAllCats($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM cats WHERE classes_id = '$id' ORDER BY weight DESC";
		$result = $db->query($sql);
		return $result;
	}

	//Name
	public function updateCatName($cat, $name)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE cats SET title = '$name' WHERE id = '$cat'";
		$db->query($sql);
	}


	//Weight
	public function updateCatWeight($cat, $weight)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE cats SET weight = '$weight' WHERE id = '$cat'";
		$db->query($sql);
	}

	//Delete a Cat
	public function deleteCat($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM note WHERE cats_id = '$id'; DELETE FROM cats WHERE id = '$id'";
		$db->query($sql);
	}

	//New Note
	public function newNote($classid, $kind)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO note (classes_id, upcat, title, weight, cats_id) VALUES ('$classid', '$kind', 'Neue Note', '100', 'NA')";
		$db->query($sql);
	}

	public function newNoteCat($classid, $kind, $catid)
	{
		$db = $this->getDataConn();
		$sql = "INSERT INTO note (classes_id, upcat, title, weight, cats_id) VALUES ('$classid', '$kind', 'Neue Note', '100', '$catid')";
		$db->query($sql);
	}

	//Get Noten
	public function getNotes($classid, $cats)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM note WHERE classes_id = '$classid' and cats_id = '$cats' ORDER BY weight DESC";
		$result = $db->query($sql);
		return $result;
	}

	//Del Note
	public function deleteNote($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM stunote WHERE note_id = '$id'; DELETE FROM note WHERE id = '$id'";
		$db->query($sql);
	}

	//Updtae Notename
	public function updateNotenName($note, $name)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE note SET title = '$name' WHERE id = '$note'";
		$db->query($sql);
	}

	//Update Notenweight
	public function updateNotenWeight($id, $weight)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE note SET weight = '$weight' WHERE id = '$id'";
		$db->query($sql);
	}

	//Get all notes by Categorie
	public function getAllNotesCat($catid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM note WHERE cats_id = '$catid' ORDER BY weight DESC";
		$result = $db->query($sql);
		return $result;
	}

	//Get Data for ClassNote-View
	public function getClassNoteData($classid, $notenid)
	{
		$db = $this->getDataConn();
		$sql = 
		"
			SELECT classes.name as classname, note.title as title, classes.system FROM classes
			JOIN note 
			ON note.classes_id = classes.id
			WHERE note.classes_id = '$classid'
			AND note.id = '$notenid'
		";
		$result = $db->query($sql);
		return $result;
	}

	//Check if note exist

	public function getNote($studentid, $notenid, $classid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM stunote WHERE note_id = '$notenid' and students_id = '$studentid' AND classes_id = '$classid'";
		return $result = $db->query($sql);
	}

	//Create new Note
	public function newStuNote($studentid, $notenid, $classid, $numb, $info)
	{
		$db = $this->getDataConn();
		$sql = "
			INSERT INTO stunote (classes_id, note_id, students_id, note, info) 
			VALUES ('$classid', '$notenid', '$studentid', '$numb', '$info')";
		$db->query($sql);
	}

	//Update Note
	public function updateStuNote($notenid, $studentid, $note)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE stunote SET note = '$note' WHERE note_id = '$notenid' and students_id = '$studentid'";
		$db->query($sql);
	}

	//Update Notice
	public function updateStuNoteNotice($notenid, $studentid, $notice)
	{
		$db = $this->getDataConn();
		$sql = "UPDATE stunote SET info = '$notice' WHERE note_id = '$notenid' and students_id = '$studentid'";
		$db->query($sql);
	}
	
	//Average
	public function getAllNotenAv($notenid)
	{		
		$db = $this->getDataConn();
		$sql = "SELECT AVG(note) FROM stunote WHERE note_id = '$notenid' and note != 'NA'";
		return $result = round($db->query($sql)->fetch()[0], 2);
		
	}

	//Get Note from a Student
	public function getNoteStudent($note, $studentid)
	{
		$db = $this->getDataConn();
		$sql = "SELECT * FROM stunote WHERE note_id = '$note' and students_id = '$studentid'";
		return $result = $db->query($sql);
	}

	//Dekete a Student
	public function deleteStudent($id)
	{
		$db = $this->getDataConn();
		$sql = "DELETE FROM unitdata WHERE students_id = '$id'; DELETE FROM stunote WHERE students_id = '$id'; DELETE FROM students WHERE id = '$id'";
		$db->query($sql);
	}

	//Get all notes of one category
	public function getNotesOfCat($id)
	{
		$db = $this->getDataConn();
		$sql = "SELECT note.id FROM note WHERE note.cats_id = '$id'";
		return $result = $db->query($sql);
	}



	//Get max id of classes
	public function getMaxClassID()
	{
		$db = $this->getDataConn();
		$sql = "SELECT MAX(id) FROM classes";
		return $result = $db->query($sql);
	}


	//Get Token
	public function getSyncToken()
	{
		$db = $this->getDataConn();
		$sql = "SELECT synctoken FROM users";
		return $result = $db->query($sql)->fetch();
	}
}
?>