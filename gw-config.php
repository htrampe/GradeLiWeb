<?php 

//CREDENTIALS FOR DATABSE
/*

	HIER ALLE DATEN DES LOKALEN RECHNERS EINTRAGEN!

*/
$host = "localhost";
$db_user ="root";
$db_pass = "";
$db_name = "gradeli";

$db = new PDO("mysql:host=".$host.";dbname=".$db_name.';charset=utf8', $db_user, $db_pass);
?>