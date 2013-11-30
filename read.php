<?php
$timestring = $_POST['times'];
$times = explode(",",$timestring);
$con = mysqli_connect("localhost", "lberkley", "lincslink", "riverdeepdata");
$c=0;
foreach ($times as $time) {
    $result = mysqli_query($con,'SELECT data FROM river WHERE date="'.$time.'"');
    $row = mysqli_fetch_array($result) or (array)['0'];
if($row[0]!=''){$response[$c] = $row[0];}else{$response[$c] = '0';}
    $c++;
}
echo(implode(',',array_reverse($response)));
?>
