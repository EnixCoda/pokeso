<?php
/*
[0]: 1.fakeserials, range: a-z, function: telling this serial is fake
2.tag, range: A-Z, function: telling distance from the real begining of this serial
else are real
 */
$long_space = '                                                            ';
$request_data = json_decode(file_get_contents('php://input'), true);
$team = $request_data['team'];

if (count($team) == 0) {
	echo false;
	return;
}

include 'hex62.php';
$a_number_greater_than_max_pokemon_id = 3000;
$unit_length = 36;
$domain_lengths = array(
	'id' => 4, 'level' => 3, 'selected_ability_index' => 1, 'sex' => 1,
	'nature' => 2, 'item' => 3, 'move' => 4, 'base_stat' => 3, 'IV' => 2,
); //total length: 4 + 3 + 1 + 1 + 2 + 3 + 4*4 + 3*6 + 2*6 = 60

$str = '';
for ($i = 0; $i < 6; $i++) {
	if ($i < count($team)) {
		$poke = $team[$i];
		$tmp = '';
		$tmp .= set_length($domain_lengths['id'], $poke['id']);
		$tmp .= set_length($domain_lengths['level'], $poke['level']);
		$tmp .= set_length($domain_lengths['selected_ability_index'], $poke['selected_ability_index']);
		$tmp .= set_length($domain_lengths['sex'], $poke['sex']);
		$tmp .= set_length($domain_lengths['nature'], $poke['nature']);
		$tmp .= set_length($domain_lengths['item'], $poke['item']['id']);
		for ($j = 0; $j < 4; $j++) {
			if ($j < count($poke['moves'])) {
				$tmp .= set_length($domain_lengths['move'], $poke['moves'][$j]['id']);
			} else {
				$tmp .= set_length($domain_lengths['move'], (rand(0, 7000 - 1) + $a_number_greater_than_max_pokemon_id));
			}
		}
		for ($j = 0; $j < 6; $j++) {
			$tmp .= set_length($domain_lengths['base_stat'], $poke['base_stat'][$j]);
		}
		for ($j = 0; $j < 6; $j++) {
			$tmp .= set_length($domain_lengths['IV'], $poke['IV'][$j]);
		}

		$tmp = encode($tmp);

		if (strlen($tmp) < $unit_length) {
			$distance = $unit_length - strlen($tmp);
			for ($j = 1; $j < $distance; $j++) {
				$tmp = low_to_high(rand(0, 61)) . $tmp;
			}
			//[0]tag for $distance, A = 1, B = 2, etc..
			$tmp = low_to_high($distance + 35) . $tmp;
		}
		$str .= $tmp;
	} else {
		//fakeserials, begin with a-z
		$tmp = '';
		$tmp .= low_to_high(rand(1, 26) + 9);
		while (strlen($tmp) < $unit_length) {
			$tmp .= low_to_high(rand(0, 61));
		}
		$str .= $tmp;
	}
}
echo $str;

?>