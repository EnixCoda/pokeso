<?php
//Connect DB
include 'db_con.php';
include 'global.php';
$request_data = json_decode(file_get_contents('php://input'), true);
$id = $request_data['id'];
$id = intval($id);
if (!(1 <= $id && $id <= 721)) {
	http_response_code(400);
	die('invalid request');
}

$sql_query = 'SELECT * FROM poke_basic WHERE id=' . $id;
$sql_result = mysqli_query($con, $sql_query);
$poke_basic = mysqli_fetch_assoc($sql_result);

$sql_query = "SELECT * FROM ability WHERE
		ability.id IN (SELECT ability1 FROM poke_basic WHERE id='.$id.')
	OR  ability.id IN (SELECT ability2 FROM poke_basic WHERE id='.$id.')
	OR  ability.id IN (SELECT ability3 FROM poke_basic WHERE id='.$id.')
	";
$sql_result = mysqli_query($con, $sql_query);
$abilities = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
mysqli_free_result($sql_result);

$sql_query = 'SELECT * FROM poke_other WHERE id=' . $id;
$sql_result = mysqli_query($con, $sql_query);
$other_info = mysqli_fetch_assoc($sql_result);

$sql_query = 'SELECT * FROM base_stat WHERE id=' . $id;
$sql_result = mysqli_query($con, $sql_query);
$base_stat = mysqli_fetch_assoc($sql_result);
unset($base_stat['id']);

$sql_query = 'SELECT * FROM base_stats WHERE id=' . $id;
$sql_result = mysqli_query($con, $sql_query);
$base_stats = mysqli_fetch_assoc($sql_result);
unset($base_stats['id']);

$poke = $poke_basic;
if (is_array($other_info)) {
	$poke = array_merge($poke, $other_info);
}
$poke['base_stats'] = $base_stats;
$poke['base_stat'] = $base_stat;
$poke['abilities'] = $abilities;

$urls = scandir($storageAddr . '/apng/' . $id . '/');
unset($urls[0]);
unset($urls[1]);
foreach ($urls as &$url) {
	$url = $storageAddr . '/apng/' . $id . '/' . $url;
}
$poke['apngs'] = $urls;

echo json_encode($poke);
?>