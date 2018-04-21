//	$Id: date.js 176 2016-04-11 21:56:52Z thierry $
"use strict";

//	See php_date.??.js for localization

var calNames = {
	names: [
		"Sunday Monday Tuesday Wednesday Thursday Friday Saturday",
		"January February March April May June July August September October November December",
		"Sun Mon Tue Wed Thu Fri Sat",
		"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec"
	],
	set: function(n) {
		this.names = n;
	},
	get: function(what, idx) {
		//	No checks here, so don't call it with wrong values.
		return this.names[what].split(" ")[idx] || "";
	}
};


/*	Next 2 functions to be removed, replaced with format
 */
Date.prototype.dayName = function(len) {
	return calNames.get(0, this.getDay());
};
Date.prototype.monthName = function(len) {
	return calNames.get(1, this.getMonth());
};


//	returns new date from string YYYY-MM-DD[( |T)hh:mm:ss] (time part optional).
function iso2date(str)
{
var t = str.split(/[- :.T]/);
	return new Date(t[0], t[1]-1, t[2], t[3]||0, t[4]||0, t[5]||0);
}

//	Convert 'YYYY-MM-DD[ HH:mm:ss]' to date
Date.prototype.fromISO = function(s) {
	this.setTime(iso2date(s));
};

//	TODO: rename following function to fromCompact and toCompact, add toCompactFull.
//			or find better names :S

//	Convert 'YYYYMMDD[HHmmss]' to Date and reverse
Date.prototype.fromSort = function(s) {
var ed = s.match(/.{1,2}/g);
	if(!ed || ed.length<4) return false;
	this.setTime(new Date(ed[0]+ed[1], ed[2]-1, ed[3], ed[4]||0, ed[5]||0, ed[6]||0));
};
//	Should be renamed to fromShort and toShort.
Date.prototype.toSort = function() {
	return php_date('Ymd', this);
};

Date.prototype.toISODate = function() {
	return php_date('Y-m-d', this);
};

if(typeof(Date.prototype.toISOString)!='function') {
	Date.prototype.toISOString = function() {
		//	Can't use php_date as we need UTC time...
		var pad2digits = function(d) {return ('0'+d).slice(-2)};
		return ''+this.getUTCFullYear()+'-'+pad2digits(this.getUTCMonth())+'-'+pad2digits(this.getUTCDate())
			+'T'+pad2digits(this.getUTCHours())+':'+pad2digits(this.getUTCMinutes())+':'+pad2digits(this.getUTCSeconds())
			+'.'+('00'+this.getMilliseconds()).slice(-3)+'Z';
	}
}

//	Add [n] days to given date. Use negative value to substract
Date.prototype.addDays = function(n) {
	//	This must be changed to use setDate() to avoid time change if going over DST change.
	this.setTime(this.getTime() + n*864e5); 
}

Date.prototype.getWeek = function() {
	return getISOWeek(this);
}

function getISOWeek(d){
	d = new Date(+d);	//	Copy date to not modify original
	d.setHours(0,0,0);	//	Reset time
	d.setDate(d.getDate()+4-(d.getDay()||7));	//	Go to Thursday of same week
	//	return number of weeks since first day of the year.
	return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};
function getISOYear(date)   
{  
	date = new Date(+date);
    date.setDate(date.getDate()+4-(date.getDay()||7));  
    return date.getFullYear();  
}  

Date.prototype.dayOfYear = function(){
	return this.days(new Date(this.getFullYear(), 0, 1));
}

//	Date.days() return number of days between this and given date.
Date.prototype.days = function(date) {
	return (this-date)/864e5 | 0;
}

//	Date.date(): simulate PHP date() function.
//	TODO: add handling of baslashed letters ('\T' should display 'T')
//

function php_date(f, date)
{
var i, chunk, v, s, str = '', jsdate = date || new Date,
	wd = jsdate.getDay(),
	d = jsdate.getDate(), m = jsdate.getMonth(), y = jsdate.getFullYear(),
	h = jsdate.getHours(), tz = jsdate.getTimezoneOffset(),
	pad2digits = function(s) {return ('0'+s).slice(-2)};

	for(i=0; i<f.length; i++) {
		chunk = f.charAt(i);
//	replace switch with imbricated ternary conditions... ugly but much shorter...
//
		switch(chunk) {
			case '\\':	//	Show next char as is in the string.
				chunk = i<f.length-1 ? f.charAt(++i) : '';
				break;
			case 'd':	//	day of the month, 2 digits with leading 0
				chunk = pad2digits(d);
				break;
			case 'D':	//	3 letters representation of a day
				chunk = calNames.get(2, wd);
				break;
			case 'j':	//	day of the month without leading 0
				chunk = d;
				break;
			case 'l':	//	full day in letters
				chunk = calNames.get(0, wd);
				break;
			case 'N':	//	ISO-8601 numeric day of the week (1=Mon to 7=Sun)
				chunk = wd || 7;
				break;
			case 'w':	//	Numeric day of the week
				chunk = wd;
				break;
			case 'z':	//	day of the year
				chunk = jsdate.dayOfYear();
				break;
			case 'W':	//	ISO-8601 week number of year, weeks starting on Monday
				chunk = pad2digits(getISOWeek(jsdate));
				break;
			case 'F':	//	full textual representation of a month
				chunk = calNames.get(1, m);
				break;
			case 'm':	//	Numeric month, with leading zeros
				chunk = pad2digits(m+1);
				break;
			case 'M':	//	short month, three letters
				chunk = calNames.get(3, m);
				break;
			case 'n':	//	Numeric month, without leading zeros
				chunk = (m+1);
				break;
			case 't':	//	Number of days in the given month
				chunk = (new Date(y, m+1, 0)).getDate();
				break;
			case 'L':	//	Whether it's a leap year (0|1)
				chunk = ((((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0)) | 0);
				break;
			case 'o':	//	ISO-8601 year number
				chunk = getISOYear(jsdate);
				break;
			case 'Y':	//	full year (4 digits)
				chunk = y;
				break;
			case 'y':	//	short year (2 digits)
				chunk = pad2digits(y);
				break;
			case 'a':	//	am/pm
				chunk = h<12 ? 'am' : 'pm';
				break;
			case 'A':	//	AM/PM
				chunk = h<12 ? 'AM' : 'PM';
				break;
			case 'B':	//	Swatch Internet time
				chunk = ('00'+(((((jsdate/1000)+3600|0)%86400)/86.4)|0)).slice(-3);
				break;
			case 'g':	//	12-hour format of an hour without leading zeros	1 through 12
				v = h % 12; if(!v) v = 12;
				chunk = v;
				break;
			case 'G':	//	24-hour format of an hour without leading zeros	0 through 23
				chunk = h;
				break;
			case 'h':	//	12-hour format of an hour with leading zeros	01 through 12
				v = h % 12; if(!v) v = 12;
				chunk = pad2digits(v);
				break;
			case 'H':	//	24-hour format of an hour with leading zeros	00 through 23
				chunk = pad2digits(h);
				break;
			case 'i':	//	Minutes with leading zeros	00 to 59
				chunk = pad2digits(jsdate.getMinutes());
				break;
			case 's':	//	Seconds, with leading zeros	00 through 59
				chunk = pad2digits(jsdate.getSeconds());
				break;
			case 'u':	//	Microseconds
				chunk = ('000'+jsdate.getMilliseconds()).slice(-3)+'000';
				break;
			case 'S':	//	Ordinal suffix
				chunk = d==1 || d==21 || d==31 ? "st" : d==2 || d==22 ? "nd" : d==3 || d==23 ? "rd" : "th";
				break;
			case 'I':	//	Whether or not the date is in daylight saving time
				v = new Date(y, 0, 1);
				s = new Date(y, 6, 1);
				chunk = jsdate.getTimezoneOffset() < Math.max(v.getTimezoneOffset(), s.getTimezoneOffset()) ? '1' : '0';
				break;
			case 'O':	//	Difference to Greenwich time (GMT) in hours
				v = tz;
				s = v<0 ? (v=-v, '+') : '-';
				chunk = s + pad2digits((v/60)|0) + pad2digits(v%60);
				break;
			case 'P':	//	Difference to Greenwich time (GMT) with colon between hours and minutes
				v = tz;
				s = v<0 ? (v=-v, '+') : '-';
				chunk = s + pad2digits((v/60)|0) + ':' + pad2digits(v%60);
				break;
			case 'T':	//	Timezone abbreviation (EST, MDT, CEST, etc...)
				s = /\(([0-9A-Za-z]+)\)/g;
				v = s.exec(jsdate.toString());
				if(v) chunk = v[1];
				else chunk = php_date('O', jsdate);	//	Won't work under fucking IE, so show offset.
				break; 
			case 'Z':	//	Timezone offset in seconds
				chunk = (-tz*60);
				break;
			case 'c':	//	ISO 8601 date (2015-08-20T23:34:56+02:00)
				chunk = php_date('Y-m-d\\TH:i:sP', jsdate);
				break;
			case 'r':	//	RFC 2822 formatted date (Fri, 21 Aug 2015 12:34:56 +0200)
				chunk = php_date('D, d M Y H:i:s O', jsdate);
				break;
		}
		str += chunk;
	}
	return str;
}

//	Date.strftime(): simulate PHP strftime() function.

