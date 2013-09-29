<?php
//File not uploaded to Github for security
include 'checkpass.php';
$sqlpass = 'root';
$sqluser = 'root';
$sqldb = 'RiverWatch';
$sqlhost = 'localhost';
$allowed = checkpass($_GET['authcode']);
if($allowed){
    $rawdata = $_GET['data'];
    $data = explode(';',$rawdata);
    $con = mysqli_connect($sqlhost,$sqluser,$sqlpass,$sqldb);
    foreach($data as $dpoint){
        $points = explode(',',$dpoint);
        if(!mysqli_query($con, 'SELECT * FROM river WHERE tstamp="'.$points[0].'"')){
            mysqli_query($con,'INSERT INTO river VALUES ('.$points[0].','.$points[1].')');
            echo("Written");
        }
    }
    echo('Success');
}else{
    header('HTTP/1.1 403 Forbidden');
    exit();
}
?>
