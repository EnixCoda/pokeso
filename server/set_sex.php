<?php
function set_sex($id) {
	$lock_male = array();
	$lock_female = array();
	$lock_none = array();
	foreach ($lock_male as $this_id) {
		if ($id == $this_id) {
			return 3;
		}
	}
	foreach ($lock_female as $this_id) {
		if ($id == $this_id) {
			return 4;
		}
	}
	foreach ($lock_none as $this_id) {
		if ($id == $this_id) {
			return 0;
		}
	}
	return 1; //male
}
?>