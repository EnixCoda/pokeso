<?php
$debug=false;
$chars = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
function low_to_high($low){
	global $chars;
	if ($low < 62) {
		return $chars[$low];
	}
	return false;
}
function high_to_low($high){
	global $chars;
	foreach ($chars as $index => $char) {
		if ($char == $high) {
			return $index;
		}
	}
}
function print_num($description, $num_array){
	global $debug;
	if (!$debug) {
		return;
	}
	echo $description;
	foreach ($num_array as $key => $value) {
		echo $value.' ';
	}
	echo '<br>';
}
function set_length($length, $ori) {
	for ($i = strlen($ori); $i < $length; $i++) {
		$ori = '0'.$ori;
	}
	return $ori;
}
function encode($num_str) {
	$result = '';
	$unit = 7;
	$limit = pow(10, $unit);
	$num = [];
	if (strlen($num_str) % $unit > 0) {
		array_push($num, intval(substr($num_str, 0, strlen($num_str) % $unit)));
	}
	for ($i = 0; $i < intval(strlen($num_str) / $unit); $i++) {
		array_push($num, intval(substr($num_str, $i * $unit + strlen($num_str) % $unit, $unit)));
	}

	print_num('cut num: ', $num);

	$finish = false;
	$remainder = 0;
	while (!$finish) {
		$remainder = 0;
		for ($j = 0; $j < count($num); $j++) {
			$num[$j] += $remainder * $limit;
			$remainder = $num[$j] % 62;
			$num[$j] = intval($num[$j] / 62);
		}
		$result = low_to_high($remainder).$result;
		$finish = true;
		for ($k = 0; $k < count($num); $k++) {
			if ($num[$k] > 0) {
				$finish = false;
			}
		}
		print_num(' current num: ', $num);
	}
	return $result;
}
function decode($num_str) {
	$unit = 7;
	$limit = pow(10, $unit);
	$num = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$base = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
	for ($i = strlen($num_str) - 1; $i >= 0; $i--) {
		$cur_bit = high_to_low($num_str[$i]);
		//$tmp = base.slice();
		$tmp=$base;
		print_num('current base: ', $tmp);
		for ($j = 0; $j < count($tmp); $j++) {
			$tmp[$j] *= $cur_bit;
		}
		for ($j = count($tmp) - 1; $j > 0; $j--) {
			$tmp[$j - 1] += intval($tmp[$j] / $limit);
			$tmp[$j] = $tmp[$j] % $limit;
		}
		for ($j = count($tmp) - 1; $j > 0; $j--) {
			$tmp[$j - 1] += intval($tmp[$j] / $limit);
			$tmp[$j] = $tmp[$j] % $limit;
		}
		print_num('current bit: '.$cur_bit.', value to add: ',$tmp);
		for ($j = 0; $j < count($num); $j++) {
			$num[$j] += $tmp[$j];
		}
		print_num('waiting to cut: ', $num);
		for ($j = count($num) - 1; $j > 0 ; $j--) {
			$num[$j - 1] += intval($num[$j] / $limit);
			$num[$j] = $num[$j] % $limit;
		}
		print_num('cut: ', $num);
		for ($j = 0; $j < count($base); $j++) {
			$base[$j] *= 62;
		}
		for ($j = count($base) - 1; $j > 0; $j--) {
			$base[$j - 1] += intval($base[$j] / $limit);
			$base[$j] = $base[$j] % $limit;
		}
		print_num('', []);
	}
	$num_str = '';
	$span=false;
	for ($i = 0; $i < count($num); $i++) {
		if ($num[$i]>0 && !$span) {
			$span=true;
			$num_str = $num_str.$num[$i];
			continue;
		}
		if ($span) {
			$num_str = $num_str.set_length($unit, $num[$i]);
		}
	}
	return $num_str;
}
?>
