<?php
require_once 'checkpass.php'; //File not uploaded to Github for security
$sqluser = 'lberkley';
//Password in chackpass file as $sqlpass
$sqldb = 'riverdeepdata';
$sqlhost = 'localhost';
$allowed = checkpass($_GET['authcode']);
if($allowed) {
    $rawdata = $_GET['data']; //Delimit timestamp with periods
    $data = explode(';', $rawdata);
    $con = mysqli_connect($sqlhost, $sqluser, $sqlpass, $sqldb);
    foreach($data as $dpoint) {
        $points = explode(',', $dpoint);
        if(count(mysqli_fetch_array(mysqli_query($con, 'SELECT * FROM river WHERE date="'.$points[0].'"'), MYSQLI_NUM)) === 0) {
            if(!mysqli_query($con, 'INSERT INTO river VALUES ("'.$points[0].'","'.$points[1].'")')) {
                echo(mysqli_error($con));
            }
            echo("Written ".$points[0].' '.$points[1].'<br/>');
        } else {
            echo("Write skipped<br/>");
        }
    }
    echo('Success');
} else {
    header('HTTP/1.1 403 Forbidden');
    exit();
}
?>
