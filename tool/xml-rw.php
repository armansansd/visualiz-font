<?php 
// /$f_json = "data.json";
$f_ttx = "ttx/ZCispeo-Mini._g_l_y_f.ttx";

//read xml
if(isset($_GET['read_xml'])) {
	$ttx = file_get_contents($f_ttx);
	echo $ttx;
};

//write xml
if(isset($_POST['write_xml'])) {
	$ttx = $_POST['write_xml'];
	file_put_contents($f_ttx, $ttx);
	echo $ttx;
};
?>