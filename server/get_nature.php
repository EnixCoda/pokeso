<?php
//Connect DB
include 'db_con.php';

$sql_query = 'SELECT * FROM nature';
$sql_result = mysqli_query($con, $sql_query);
$natures = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
mysqli_free_result($sql_result);

$stat_names = ['HP', '攻击', '防御', '特攻', '特防', '速度'];
foreach ($natures as &$nature) {
	$nature['values'] = [1, 1, 1, 1, 1, 1];
	if (false != $i = array_search($nature['up'], $stat_names)) {
		$nature['values'][$i] = 1.1;
	}
	if (false != $i = array_search($nature['down'], $stat_names)) {
		$nature['values'][$i] = 0.9;
	}
}
echo json_encode($natures);
/*
echo "<pre>";
print_r($natures);
echo "</pre>";
 */
?>