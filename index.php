<?php
include "gw-config.php";


// Create connection
$conn = new mysqli($host, $db_user, $db_pass);

// Check connection
if ($conn->connect_error) {
    //die("Connection failed: " . $conn->connect_error);
    ?> <script>alert("MYSQL-Server nicht erreichbar!");</script> <?php
} 
?>
<noscript>
    <h1>JAVASCRIPT IST DEAKTIVIERT! Diese Applikation kann ohne JavaScript nicht funktionieren.<br /><br />
    BITTE AKTIVIEREN SIE JAVASCRIPT IN IHREM BROWSER!
</noscript>
<html>
	<!-- Checking for Browser and give Info to user! -->
    <script src="core/assets/js/jquery.min.js"></script>
    <script>
    var browser = "";

    function checkChrome() 
    { 
        if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
        {
            browser = 1;
        }
        else if(navigator.userAgent.indexOf("Chrome") != -1 )
        {
            browser = 0;
        }
        else if(navigator.userAgent.indexOf("Safari") != -1)
        {
            browser = 1;
        }
        else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
        {
            browser = 1;
        }
        else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
        {
           browser = 1;
        }  
        else 
        {
           browser = 1;
        }
    } 

    $(document).ready(function(){
        checkChrome();
        if(browser != 0) alert("Achtung! Diese Anwendung wurde nur für Google Chrome entwickelt. Auf allen anderen Browsern gibt es Probleme. Bitte nutzen Sie ausschließlich Google Chrome für die Verwendung von GradeLiWeb.");    
    });
    </script>   	
    <?php include("core/gw_main.php"); ?>
</html>