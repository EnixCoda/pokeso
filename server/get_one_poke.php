<?php
$request_data = json_decode(file_get_contents('php://input'), true);
$id = $request_data['id'];

//Connect DB
include 'db_con.php';
include 'get_apng_url.php';
include 'set_sex.php';

$this_poke = array();

$sql_query = 'SELECT id,name,description FROM ability WHERE
	ability.id IN (SELECT ability1 FROM poke_basic WHERE id=' . $request_data['i'] . ')
	OR  ability.id IN (SELECT ability2 FROM poke_basic WHERE id=' . $request_dat['id'] . ')
	OR  ability.id IN (SELECT ability3 FROM poke_basic WHERE id=' . $request_data['id'] . ')';
$sql_result = mysqli_query($con, $sql_query);
$abilities = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
mysqli_free_result($sql_result);
$this_poke['abilities'] = $abilities;

$sql_query = 'SELECT * FROM poke_basic WHERE id=' . $id;
$sql_result = mysqli_query($con, $sql_query);
$row = mysqli_fetch_array($sql_result);
$this_poke['id'] = $row['id'];
$this_poke['name'] = $row['name'];
$this_poke['type1'] = $row['type1'];
$this_poke['type2'] = $row['type2'];
$this_poke['apng'] = get_apng_url($id);
$this_poke['moves'] = array();
$this_poke['level'] = 100;
$this_poke['nature'] = 0;
$this_poke['selected_ability_index'] = 1;
$this_poke['IV'] = [31, 31, 31, 31, 31, 31];
$this_poke['base_stat'] = [0, 0, 0, 0, 0, 0];
$this_poke['stats'] = [0, 0, 0, 0, 0, 0];
$this_poke['item'] = array('id' => 0, 'name' => '无', 'description' => '???');
$base_stats = array();
$sql_result = mysqli_query($con, 'SELECT * FROM base_stats WHERE id=' . $id);
$row = mysqli_fetch_array($sql_result);
$list_abbrev = array('hp', 'atk', 'def', 'sp_atk', 'sp_def', 'spd');
$sum = 0;
for ($i = 0; $i < 6; $i++) {
	$sum += $row[$list_abbrev[$i]];
	array_push($base_stats, intval($row[$list_abbrev[$i]]));
}
$this_poke['sum'] = $sum;
$this_poke['base_stats'] = $base_stats;

$this_poke['sex'] = set_sex($id);

echo json_encode($this_poke);
mysqli_close($con);
?>