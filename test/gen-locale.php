<?php	//	$Id$

$locale = 'fr_FR';

header('Content-type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');
setlocale(LC_ALL, $locale.'.UTF-8');
?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="iso-8859-1">
</head>
<body>
<pre>
<?php
$full_day = array();
$short_day = array();
$full_month = array();
$short_month = array();

$epoch = strtotime("Last Sunday 11:00");
for($i=0; $i<7; $i++) {
	$full_day[] = strftime('%A', $epoch);
	$short_day[] = strftime('%a', $epoch);
	$epoch += 86400;
}
for($m=1; $m<13; $m++) {
	$epoch = mktime(12, 0, 0, $m, 1, 2015);
	$full_month[] = strftime('%B', $epoch);
	$short_month[] = strftime('%b', $epoch);
}

echo "//	locale: $locale\n\n";

echo "calNames.set([\n";
echo '	"', implode(' ', $full_day), "\",\n";
echo '	"', implode(' ', $full_month), "\",\n";
echo '	"', implode(' ', $short_day), "\",\n";
echo '	"', implode(' ', $short_month), "\"\n";
echo "]);\n";
?>
</pre>
<br />
</body>
</html>
