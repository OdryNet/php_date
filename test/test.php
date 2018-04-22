<?php	//	$Id: date.php 170 2015-10-21 20:55:11Z thierry $
$letters = 'd D j l N w z F m M n t L Y y a A B g G h H i s u O P Z T I o W';
//	Default to now.
function _post($i, $d='') { return isset($_POST[$i]) ? $_POST[$i]: $d; }

$value = _post('newtime', 'now');
$format = _post('format', 'D j M Y H:i:s');

$epoch = strtotime($value);
//	If it failed, default to now.
if($epoch===false || $epoch==-1) $epoch = time();
?>
<!DOCTYPE HTML>
<html>
<head>
<title>Test Date</title>
<style>
fieldset {margin-top:1em;}
#fmtResult {background-color:#eee;padding:2px 4px;}
table.diff {border:1px solid black; border-collapse:collapse;}
table.diff th, table.diff td {
	border:1px solid black;
	padding:2px 1em;
} 
table.data th {font-size:small;text-align:right;font-family:Arial;}
</style>

<script type=text/javascript src=../php_date.js></script>
<!-- script type=text/javascript src=../php_date.fr.js></script -->
<script type=text/javascript>
var format = "c r "+<?php var_export($letters); ?>,
	epoch = <?php var_export($epoch*1000); ?>,
	date = new Date(epoch),
	descriptions = {
	"d": "day of the month (2 digits, 0 padded)",
	"D": "short week day name (3 letters in english, Mon to Sun)",
	"j": "day of the month (no leading 0)",
	"l": "(lower L) full week day name (Monday to Sunday)",
	"N": "ISO-8601 numeric day of the week (1=Mon to 7=Sun)",
	"w": "numeric day of the week (0=Sun to 6=Sat)",
	"z": "numeric day of the year (0 to 365 or 366)",
	"W": "ISO-8601 week number of year, weeks starting on Monday",
	"F": "full month name (January to December)",
	"m": "numeric month (2 digits, 0 padded, 01 to 12)",
	"M": "short month name (3 letters in english, Jan to Dec)",
	"n": "numeric month (no leading 0, 1 to 12)",
	"t": "number of days in the date's month",
	"L": "leap year (0 or 1)",
	"o": "ISO-8601 year number",
	"Y": "full year (4 digits)",
	"y": "short year (2 digits)",
	"a": "am/pm",
	"A": "AM/PM",
	"B": "Swatch Internet time",
	"g": "hours in 12-hour format with no leading 0 (1 to 12)",
	"G": "hours in 24-hours format with no leading 0 (0 to 23)",
	"h": "hours in 12-hours format with leading 0 (01 to 12)",
	"H": "hours in 24-hours format with leading 0 (00 to 24)",
	"i": "minutes with leading 0 (00 to 59)",
	"s": "seconds with leading 0 (00 to 59)",
	"u": "micro seconds (000000 to 999999)",
	"S": "ordinal suffic (st, nd, rd or th)",
	"I": "daylight saving active (0 or 1)",
	"O": "difference to GMT (+-)HHMM",
	"P": "difference to GMT (+-)HH:MM",
	"T": "timezone abbreviation (EST, MDT, CEST, etc...) does not work with all browsers",
	"Z": "offset to GMT in secconds",
	"c": "ISO 8601 date (2015-08-20T23:34:56+02:00)",
	"r": "RFC 2822 formatted date (Fri, 21 Aug 2015 12:34:56 +0200)"
	};

//	VERY VERY stripped down version of jQuery... just enought for this page
//	only works with id, compatible with everything, but VERY limited.
function vvsdjq(element) {
	var elements = [];
	this.val = function(v) {
		if(!elements.length) return undefined;
		if(v===undefined) return elements[0].value;
		else elements[0].value = v;
	};
	this.html = function(val) { if(elements.length) elements[0].innerHTML = val; };
	if(element!==null) elements.push(element);
}
function $(i) { return new vvsdjq(document.getElementById(i.substr(1))); }
//	end of VERY VERY stripped down version of jQuery

function setToday(_button)
{
	$("#newtime").val("now");
	_button.form.submit();
}

//	Delay loadArray... until all scripts are loaded.
(function() { setTimeout(loadArray, 10); })();

function loadArray() {
var i, l, letters = format.split(' ');

	for(i=0; i<letters.length; i++) {
		l = letters[i];
		$("#date_"+l).html(php_date(l, date));
		$("#desc_"+l).html(descriptions[l]);
	}
	test_format();
}

function test_format()
{
var f = $("#fldFormat").val();
	$("#fmtResult").html(php_date(f, date));
	$("#tstFormat").val(f);
	return false;
}

</script>

</head>
<body>

<form name=testit method=POST>
<input type=hidden name=format id=tstFormat value="" />
	<fieldset><legend>Change time to display</legend>
		<input type=text name=newtime id=newtime size=40 value="<?php echo $value; ?>" />
		<input type=submit />
		<input type=button value=Today onclick="setToday(this);" />
	</fieldset>
</form>

<form name=testformat onsubmit="return test_format();">
	<fieldset><legend>Test format dynamically</legend>
		<input type=text name=format id=fldFormat value="<?php echo $format; ?>" />
		<input type=button value=Show onclick="test_format();" />
		&nbsp; Result: <span id=fmtResult></span>
	</fieldset>
</form>

<p>
	Compare PHP date() and Javascript php_date() result for each possible argument.
</p>

<table class=diff>
<thead>
	<tr><th>Arg</th><th>PHP</th><th>Javascript</th></tr>
</thead>
<tbody>
	<tr><th>c</th><td><?php echo date('c', $epoch); ?></td><td id=date_c>-</td></tr>
	<tr><th>r</th><td><?php echo date('r', $epoch); ?></td><td id=date_r>-</td></tr>
</tbody>
</table>
<br />
<table class=diff>
<thead>
	<tr><th>Arg</th><th>PHP</th><th>Javascript</th><th>Description</th></tr>
</thead>
<tbody>
<?php
//	Set all PHP values, and IDs for JS to fill them up at load time.
foreach(explode(' ', $letters) as $l) {
	echo "\t<tr><th>$l</th><td>", date($l, $epoch), "</td><td id=date_$l>-</td><td id=desc_$l>-</td></tr>\n";
}
?>
</tbody>
</table>

</body>
</html>
