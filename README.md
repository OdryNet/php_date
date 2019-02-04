# php_date
Javascript version of the PHP date function and some date tools

## Synopsis

string php_date(string format, Date date)

## Description

Format a javascript Date object according for the format string

Possible format characters:

	\?	print the character after the \

	d	day of the month (2 digits, 0 padded)

	D	short week day name (3 letters in english, Mon to Sun)

	j	day of the month (no leading 0)

	l	(lower L) full week day name (Monday to Sunday)

	N	ISO-8601 numeric day of the week (1=Mon to 7=Sun)

	w	numeric day of the week (0=Sun to 6=Sat)

	z	numeric day of the year (0 to 365/366)

	W	ISO-8601 week number of year, weeks starting on Monday

	F	full month name (January to December)

	m	numeric month (2 digits, 0 padded, 01 to 12)

	M	short month name (3 letters in english, Jan to Dec)

	n	numeric month (no leading 0, 1 to 12)

	t	number of days in the date's month

	L	leap year (0 or 1)

	o	ISO-8601 year number

	Y	full year (4 digits)

	y	short year (2 digits)

	a	am/pm

	A	AM/PM

	B	Swatch Internet time

	g	hours in 12-hour format with no leading 0 (1 to 12)	

	G	hours in 24-hours format with no leading 0 (0 to 23)

	h	hours in 12-hours format with leading 0 (01 to 12)

	H	hours in 24-hours format with leading 0 (00 to 24)

	i	minutes with leading 0 (00 to 59)

	s	seconds with leading 0 (00 to 59)

	u	micro seconds (000000 to 999999)

	S	ordinal suffix (st, nd, rd or th)

	I	daylight saving active (0 or 1)

	O	difference to GMT (+-)HHMM

	P	difference to GMT (+-)HH:MM

	T	timezone abbreviation (EST, MDT, CEST, etc...) does not work with all browsers

	Z	offset to GMT in secconds

	c	ISO 8601 date (2015-08-20T23:34:56+02:00)

	r	RFC 2822 formatted date (Fri, 21 Aug 2015 12:34:56 +0200)

	Any unrecognised character will be printed as is.

## Examples

	now = php_date("Y-m-d H:i:s");
	//	2015-08-20 12:34:56

	now = php_date("D, d M Y H:i:s O");
	//	Fri, 21 Aug 2015 12:34:56 +0200
	
	//	Using different locale
	<script src="/php_date/php_date.js"></script>
	<script src="/php_date/php_date.fr.js"></script>
	<script>
	var full_date = php_date("l d F Y à H\\hi");
	//	vendredi 21 août 2018 à 12h34
	</script>

## Known bugs

the 'z' argument looks to have a problem  around midnight, probably something to do with the fact that the PHP date function works with UTC time, whereas the Javascript version works with local time.

