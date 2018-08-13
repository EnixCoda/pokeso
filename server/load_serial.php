<?php
include 'hex62.php';

$request_data = json_decode(file_get_contents('php://input'), true);

$serial = $request_data['serial'];

$unit_length = 36;
$domain_lengths = array(
	'id' => 4, 'level' => 3, 'selected_ability_index' => 1, 'sex' => 1,
	'nature' => 2, 'item' => 3, 'move' => 4, 'base_stat' => 3, 'IV' => 2,
);
$a_number_greater_than_max_pokemon_id = 3000;

if ($serial == NULL || strlen($serial) % $unit_length > 0) {
	return;
}

$encoded_strs = array();
$decoded_strs = array();
for ($i = 0; $i < 6; $i++) {
	if (high_to_low('9') >= high_to_low($serial[$i * $unit_length]) || high_to_low($serial[$i * $unit_length]) >= high_to_low('A')) {
		array_push($encoded_strs, substr($serial, $i * $unit_length, $unit_length));
	}
}
foreach ($encoded_strs as &$serial) {
	$distance = max(0, high_to_low($serial[0]) - high_to_low('A') + 1);
	$serial = substr($serial, $distance);
	array_push($decoded_strs, set_length(60, decode($serial)));
}

$poke_codes = array();
foreach ($decoded_strs as $serial) {
	$this_poke_code = array();
	$pos = 0;
	$this_poke_code['id'] = intval(substr($serial, ($pos += $domain_lengths['id']) - $domain_lengths['id'], $domain_lengths['id']));
	$this_poke_code['level'] = intval(substr($serial, ($pos += $domain_lengths['level']) - $domain_lengths['level'], $domain_lengths['level']));
	$this_poke_code['selected_ability_index'] = substr($serial, ($pos += $domain_lengths['selected_ability_index']) - $domain_lengths['selected_ability_index'], $domain_lengths['selected_ability_index']);
	$this_poke_code['sex'] = substr($serial, ($pos += $domain_lengths['sex']) - $domain_lengths['sex'], $domain_lengths['sex']);
	$this_poke_code['nature'] = intval(substr($serial, ($pos += $domain_lengths['nature']) - $domain_lengths['nature'], $domain_lengths['nature']));
	$this_poke_code['item'] = substr($serial, ($pos += $domain_lengths['item']) - $domain_lengths['item'], $domain_lengths['item']);
	$this_poke_code['move'] = array();
	for ($i = 0; $i < 4; $i++) {
		array_push($this_poke_code['move'], intval(substr($serial, ($pos += $domain_lengths['move']) - $domain_lengths['move'], $domain_lengths['move'])));
	}
	$this_poke_code['base_stat'] = array();
	for ($i = 0; $i < 6; $i++) {
		array_push($this_poke_code['base_stat'], intval(substr($serial, ($pos += $domain_lengths['base_stat']) - $domain_lengths['base_stat'], $domain_lengths['base_stat'])));
	}
	$this_poke_code['IV'] = array();
	for ($i = 0; $i < 6; $i++) {
		array_push($this_poke_code['IV'], intval(substr($serial, ($pos += $domain_lengths['IV']) - $domain_lengths['IV'], $domain_lengths['IV'])));
	}
	array_push($poke_codes, $this_poke_code);
}

//Connect DB
include 'db_con.php';
include 'get_apng_url.php';
$pokemons = array();
foreach ($poke_codes as $this_poke_code) {
	$this_poke = array();
	$this_poke['id'] = $this_poke_code['id'];
	$this_poke['level'] = $this_poke_code['level'];
	$this_poke['selected_ability_index'] = $this_poke_code['selected_ability_index'];
	$this_poke['sex'] = $this_poke_code['sex'];
	$this_poke['nature'] = $this_poke_code['nature'];
	$this_poke['base_stat'] = $this_poke_code['base_stat'];
	$this_poke['IV'] = $this_poke_code['IV'];
	$this_poke['apng'] = get_apng_url($this_poke['id']);

	$sql_query = 'SELECT * FROM poke_basic WHERE id=' . $this_poke['id'];
	$sql_result = mysqli_query($con, $sql_query);
	$row = mysqli_fetch_array($sql_result);
	$this_poke['name'] = $row['name'];
	$this_poke['type1'] = $row['type1'];
	$this_poke['type2'] = $row['type2'];
	mysqli_free_result($sql_result);

	$sql_query = 'SELECT id,name,description FROM ability WHERE
     ability.id IN (SELECT ability1 FROM poke_basic WHERE id=' . $this_poke['id'] . ')
     OR  ability.id IN (SELECT ability2 FROM poke_basic WHERE id=' . $this_poke['id'] . ')
     OR  ability.id IN (SELECT ability3 FROM poke_basic WHERE id=' . $this_poke['id'] . ')';
	$sql_result = mysqli_query($con, $sql_query);
	$abilities = mysqli_fetch_all($sql_result, MYSQLI_ASSOC);
	mysqli_free_result($sql_result);
	$this_poke['abilities'] = $abilities;

	$this_poke['item'] = array('id' => 0, 'name' => '无', 'description' => '???');

	$moves = array();
	foreach ($this_poke_code['move'] as $move) {
		if ($move < $a_number_greater_than_max_pokemon_id) {
			$sql_query = 'SELECT * FROM move WHERE id=' . $move;
			$sql_result = mysqli_query($con, $sql_query);
			$row = mysqli_fetch_array($sql_result);
			array_push($moves, $row);
		}
	}
	$this_poke['moves'] = $moves;

	$base_stats = array();
	$sql_query = 'SELECT * FROM base_stats WHERE id=' . $this_poke['id'];
	$sql_result = mysqli_query($con, $sql_query);
	$row = mysqli_fetch_array($sql_result);
	$list_abbrev = array('hp', 'atk', 'def', 'sp_atk', 'sp_def', 'spd');
	$sum = 0;
	for ($i = 0; $i < 6; $i++) {
		array_push($base_stats, intval($row[$list_abbrev[$i]]));
		$sum += intval($row[$list_abbrev[$i]]);
	}
	$this_poke['base_stats'] = $base_stats;
	$this_poke['stats'] = [0, 0, 0, 0, 0, 0];
	mysqli_free_result($sql_result);
	array_push($pokemons, $this_poke);
}
echo json_encode($pokemons);

mysqli_close($con);
return;
?>