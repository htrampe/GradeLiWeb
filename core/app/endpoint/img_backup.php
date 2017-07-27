<?php

$toSide[0] = false;

//Extract ZIP-File to Stu-Img-Files
try{
	$zip = new ZipArchive();
	$zip->open($_FILES['file']['tmp_name']);
	$zip->extractTo("../../../");
	$zip->close();	
	$toSide[0] = true;
}
catch(IOException $e)
{
	$toSide[1] = $e;
}		

echo json_encode($toSide);
?>