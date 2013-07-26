/////////////////// Plug-in file for CalendarXP 9.0 /////////////////
// This file is totally configurable. You may remove all the comments in this file to minimize the download size.
/////////////////////////////////////////////////////////////////////

///////////// Calendar Onchange Handler ////////////////////////////
// It's triggered whenever the calendar gets changed to y(ear),m(onth),d(ay)
// d = 0 means the calendar is about to switch to the month of (y,m); 
// d > 0 means a specific date [y,m,d] is about to be selected.
// e is a reference to the triggering event object
// Return a true value will cancel the change action.
// NOTE: DO NOT define this handler unless you really need to use it.
////////////////////////////////////////////////////////////////////
function fOnChange(y,m,d,e) {
	if (d==0) {
		var lastDay=fGetDays(y)[m];
		fUpdSelect(y,m,lastDay<gdSelect[2]?lastDay:gdSelect[2],true);	// keep day of month updated
	}
}


///////////// Calendar AfterSelected Handler ///////////////////////
// It's triggered whenever a date gets fully selected.
// The selected date is passed in as y(ear),m(onth),d(ay)
// e is a reference to the triggering event object
// NOTE: DO NOT define this handler unless you really need to use it.
////////////////////////////////////////////////////////////////////
// function fAfterSelected(y,m,d,e) {}


///////////// Calendar Cell OnDrag Handler ///////////////////////
// It triggered when you try to drag a calendar cell. (y,m,d) is the cell date. 
// aStat = 0 means a mousedown is detected (dragstart)
// aStat = 1 means a mouseover between dragstart and dragend is detected (dragover)
// aStat = 2 means a mouseup is detected (dragend)
// e is a reference to the triggering event object
// NOTE: DO NOT define this handler unless you really need to use it.
//       If you use fRepaint() here, fAfterSelected() will be ignored.
////////////////////////////////////////////////////////////////////

// function fOnDrag(y,m,d,aStat,e) {}



////////////////// Calendar OnResize Handler ///////////////////////
// It's triggered after the calendar panel has finished drawing.
// NOTE: DO NOT define this handler unless you really need to use it.
////////////////////////////////////////////////////////////////////
function fOnResize() {
	// update the time fields on the calendar
	// you may move the following lines into the fParseInput() if you don't want to support NN4.
	var bf=document.cxpBottomForm;
	var t=_timeVal.match(_timeFormat);
	var apIdx=3;
	if (t) {
		bf.hourF.value=t[1];
		bf.minF.value=t[2];
		if (gTimeUseSeconds){
			bf.secF.value=t[3];
			apIdx=4;
		}
		if (!gIs24Hour) bf.ampm.value=t[apIdx];
	}
}


////////////////// Calendar fOnWeekClick Handler ///////////////////////
// It's triggered when the week number is clicked.
// NOTE: DO NOT define this handler unless you really need to use it.
////////////////////////////////////////////////////////////////////
// function fOnWeekClick(year, weekNo) {}

////////////////// Calendar fOnDoWClick Handler ///////////////////////
// It's triggered when the week head (day of week) is clicked.
// dow ranged from 0-6 while 0 denotes Sunday, 6 denotes Saturday.
// NOTE: DO NOT define this handler unless you really need to use it.
////////////////////////////////////////////////////////////////////
// function fOnDoWClick(year, month, dow) {}


////////////////// Calendar fIsSelected Callback ///////////////////////
// It's triggered for every date passed in as y(ear) m(onth) d(ay). And if 
// the return value is true, that date will be rendered using the giMarkSelected,
// gcFGSelected, gcBGSelected and guSelectedBGImg theme options.
// NOTE: If NOT defined here, the engine will create one that checks the gdSelect only.
////////////////////////////////////////////////////////////////////
// function fIsSelected(y,m,d) {
//		return gdSelect[2]==d&&gdSelect[1]==m&&gdSelect[0]==y;
// }


////////////////// Calendar fParseInput Handler ///////////////////////
// Once defined, it'll be used to parse the input string stored in gdCtrl.value.
// It's expected to return an array of [y,m,d] to indicate the parsed date,
// or null if the input str can't be parsed as a date.
// NOTE: If NOT defined here, the engine will create one matching fParseDate().
////////////////////////////////////////////////////////////////////
function fParseInput(str) {
	if (gbHideCalMiddle) {
		_timeVal=formatTime(str);
		return [0,0,1]; // make date > 0 so as not to clear the input field
	} else {
		var dt=str.split(_separator_datetime);
		_timeVal=formatTime(str.substring(dt[0].length+_separator_datetime.length));
		return fParseDate(dt[0]);
	}
}


////////////////// Calendar fFormatInput Handler ///////////////////////
// Once defined, it'll be used to format the selected date - y(ear) m(onth) d(ay)
// into gdCtrl.value.
// It's expected to return a formated date string.
// NOTE: If NOT defined here, the engine will create one matching fFormatDate().
////////////////////////////////////////////////////////////////////
function fFormatInput(y,m,d) {
	if (gbHideCalMiddle)
		return _timeVal;
	else
		return fFormatDate(y,m,d)+_separator_datetime+_timeVal;
}

////////////////// Calendar fOnload Handler ///////////////////////
// It's triggered when the calendar engine is fully loaded by the browser.
// NOTE: DO NOT define this handler unless you really need to use it.
////////////////////////////////////////////////////////////////////
// function fOnload() {}


// ====== predefined utility functions for use with agendas. ========

// load an url in the window/frame designated by "framename".
function popup(url,framename) {	
	var w=parent.open(url,framename,"top=200,left=200,width=400,height=200,scrollbars=1,resizable=1");
	if (w&&url.split(":")[0]=="mailto") w.close();
	else if (w&&!framename) w.focus();
}

// ====== Following are self-defined and/or custom-built functions! =======



// ======= the following plugin is coded for the time picker ========
// To enable time picker in other themes, simply copy this part of code into their plugins.js files
// and merge the fOnResize, fParseInput and fFormatInput functions.

// If you hide top and middle part, you will get a time only picker.
//gbHideTop=true;
//gbHideCalMiddle=true;
gbHideBottom=false;
if(!gIs24Hour) var gIs24Hour=false;	// use 24-hour format or not.
if(!gHourMarker) var gHourMarker=":"; // the char between hour and minute
if(!gTimeMarker) var gTimeMarker=" "; // the char between the time and "AM|PM".
if(!gAMString) var gAMString="AM", gPMString="PM";
var _separator_datetime=" "; // the char between date and time.
var _scrollTime=200;	// scrolling delay in milliseconds
var _inc=1;	// incremental time interval in minutes
var _incSec=1; // incremental time interval in seconds

var _hourPattern=gIs24Hour?"^([0-1]?[0-9]|2[0-3])":"^([0]?[1-9]|1[0-2])";
var _secondPattern="[^0-9]+([0-5]?[0-9])";
var _amPMPattern=".*("+gAMString+"|"+gPMString+")$";
var _timeFormat=new RegExp(_hourPattern+_secondPattern+(gTimeUseSeconds?_secondPattern:"")+(gIs24Hour?"":_amPMPattern));

var _timeVal;
var styleStr=NN4?'':'style=" border:1px solid white"';
var imgPlusStr=' src="' + gPlusImagePath + '" onmouseup="stopTime()" width="13" height="9" onmouseover="this.style.borderColor=\'black\'" onmouseout="stopTime();this.style.borderColor=\'white\'" '+styleStr;
var imgMinusStr=' src="' + gMinusImagePath + '" onmouseup="stopTime()" width="13" height="9" onmouseover="this.style.borderColor=\'black\'" onmouseout="stopTime();this.style.borderColor=\'white\'" '+styleStr;

var _tempHour,_tempMinute,_tempSecond;

var hourMinuteHtml=('<form><table align="center" border="0" cellpadding="0" cellspacing="0">' + 
'<tr><td>&nbsp;</td><td>' + 
'<input type="text" name="hourF" size="2" maxlength="2" class="TimeBox" onchange="updateTimeStr()" onfocus="_tempHour=this.value;this.value=\'\';" onfocusout="if(this.value==\'\')this.value=_tempHour;">' +
'</td><td><img onmousedown="incHour();" ' +imgPlusStr+
'><br><img onmousedown="decHour();" ' +imgMinusStr+
'></td><td nowrap><b>&nbsp' +gHourMarker+
'</b>&nbsp;</td><td><input type="text" name="minF" size="2" maxlength="2" class="TimeBox" onchange="updateTimeStr()" onfocus="_tempMinute=this.value;this.value=\'\';" onfocusout="if(this.value==\'\')this.value=_tempMinute;">' +
'</td><td><img onmousedown="incMin();" '+imgPlusStr+
'><br><img onmousedown="decMin();" '+imgMinusStr+
'></td>');
var secondsHtml=('<td nowrap><b>&nbsp'+gHourMarker+
'</b>&nbsp;</td><td><input type="text" name="secF" size="2" maxlength="2" class="TimeBox" onchange="updateTimeStr()" onfocus="_tempSecond=this.value;this.value=\'\';" onfocusout="if(this.value==\'\')this.value=_tempSecond;"></td><td><img onmousedown="incSec();" '+imgPlusStr+
'><br><img onmousedown="decSec();" '+imgMinusStr+
'></td>');
var amPMHtml=(gIs24Hour?'':'<td>'+gTimeMarker+'&nbsp;</td><td height=100%><input type="Text" name="ampm" size="2" maxlength="2" class="TimeBox" readonly onfocus="flipAmPm();this.blur()"></td>');
var timeTailHtml=('</tr></table></form>');

gsBottom=hourMinuteHtml+(gTimeUseSeconds?secondsHtml:'')+amPMHtml+timeTailHtml;

if(NN4)_nn4_css.push("TimeBox");

function time2str(hour, minute, ampm) { // format time and round it according to interval
	return padZero(hour)+gHourMarker+padZero(Math.floor(minute/_inc)*_inc)+(gIs24Hour?'':gTimeMarker+ampm);
}

function time2SecStr(hour, minute, second, ampm) { // format time and round it according to interval
	return padZero(hour)+gHourMarker+padZero(Math.floor(minute/_inc)*_inc)+gHourMarker+padZero(Math.floor(second/_incSec)*_incSec)+(gIs24Hour?'':gTimeMarker+ampm);
}

function formatTime(str) {
	if (_timeFormat.test(str)==false) { // use current time if str is invalid
		var nd=new Date(), h=nd.getHours(), sign=h>11?gPMString:gAMString;
		if (!gIs24Hour&&(h>12||h==0)) h=Math.abs(h-12);
		if (gTimeUseSeconds)
			return time2SecStr(h,nd.getMinutes(),nd.getSeconds(),sign);
		else
			return time2str(h,nd.getMinutes(),sign);
	} else
		return str;
}

function padZero(n) {
	n=parseInt(n,10);
	return n<10?'0'+n:n;
}

function updateTimeStr() {
	var bf=document.cxpBottomForm
	var hv=parseInt(bf.hourF.value,10), mv=parseInt(bf.minF.value,10);
	if (gIs24Hour) bf.hourF.value=hv>=0&&hv<=23?padZero(hv):"00";
	else  bf.hourF.value=hv>=1&&hv<=12?padZero(hv):"12";
	bf.minF.value=mv>=0&&mv<=59?padZero(Math.floor(mv/_inc)*_inc):"00";
	if (gTimeUseSeconds){
		var sv=parseInt(bf.secF.value,10);
		bf.secF.value=sv>=0&&sv<=59?padZero(Math.floor(sv/_incSec)*_incSec):"00";
		_timeVal=time2SecStr(bf.hourF.value,bf.minF.value,bf.secF.value,gIs24Hour?"":bf.ampm.value);
	}
	else
		_timeVal=time2str(bf.hourF.value,bf.minF.value,gIs24Hour?"":bf.ampm.value);
//	if (gdSelect[2]>0) {
//		gdCtrl.value=fFormatInput(gdSelect[0],gdSelect[1],gdSelect[2]);
//	}
}

function fCloseCal() {
	gdCtrl.value=fFormatInput(gdSelect[0],gdSelect[1],gdSelect[2]);
	if (gdCtrl.onchange) gdCtrl.onchange();
	fHideCal();
}

var _th=null;
function incMin(){
	if (!_th) _th=setInterval(NN4?incMin:"incMin()",_scrollTime);  // must be first line
	var bf=document.cxpBottomForm, m=parseInt(bf.minF.value,10)+_inc;
	if (m>59) { m=0; incHour(); }
	bf.minF.value=padZero(m);
	updateTimeStr();
}
function decMin(){
	if (!_th) _th=setInterval(NN4?decMin:"decMin()",_scrollTime);  // must be first line
	var bf=document.cxpBottomForm, m=parseInt(bf.minF.value,10)-_inc;
	if (m<0) { m=60-_inc; decHour(); }
	bf.minF.value=padZero(m);
	updateTimeStr();
}
function incHour(){
	if (!_th) _th=setInterval(NN4?incHour:"incHour()",_scrollTime);
	var bf=document.cxpBottomForm, h=parseInt(bf.hourF.value,10), maxh=gIs24Hour?23:12;
	if (++h>maxh) h=gIs24Hour?0:1;
	if (h==12) flipAmPm();
	bf.hourF.value=padZero(h);
	updateTimeStr();
}
function decHour(){
	if (!_th) _th=setInterval(NN4?decHour:"decHour()",_scrollTime);
	var bf=document.cxpBottomForm, h=parseInt(bf.hourF.value,10);
	if (gIs24Hour) {
		if (--h<0) h=23;
	} else
		if (--h==0) h=12; 
	if (h==11) flipAmPm();
	bf.hourF.value=padZero(h);
	updateTimeStr();
}
function incSec(){
	if (!_th) _th=setInterval(NN4?incSec:"incSec()",_scrollTime);
	var bf=document.cxpBottomForm, s=parseInt(bf.secF.value,10)+_incSec;
	if (s>59) { s=0; incMin(); }
	bf.secF.value=padZero(s);
	updateTimeStr();
}
function decSec(){
	if (!_th) _th=setInterval(NN4?decSec:"decSec()",_scrollTime);
	var bf=document.cxpBottomForm, s=parseInt(bf.secF.value,10)-_incSec;
	if (s<0) { s=60-_incSec; decMin(); }
	bf.secF.value=padZero(s);
	updateTimeStr();
}
function stopTime(){
	clearInterval(_th);
	_th=null;
}
function flipAmPm() {
	if (gIs24Hour) return;
	var bf=document.cxpBottomForm;
	bf.ampm.value=bf.ampm.value==gAMString?gPMString:gAMString;
	updateTimeStr();
}
// ======= end of time picker plugin ========

