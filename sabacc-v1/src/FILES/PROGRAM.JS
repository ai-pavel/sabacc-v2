var cpu1, cpu2;
var b, burka, barka;
var name; var game = 0;
var m = 0; var muzon = 0;
var lak = 0; var bomb = 0;
var lim1, lim2, lam1, lam2;
var field = "cards/field.gif"
var wallp = "cards/wallp.gif"
var blank = "cards/blank.gif"
var lozhka1 = 0; var lozhka2 = 0;
var race1 = "none"; var race2 = "none";
var pas = 0; var pas1 = 0; var pas2 = 0;
var score = 0; var score1 = 0; var score2 = 0;
var inter = 20; var inter1 = 20; var inter2 = 20;
var points1 = 0; var points2 = 0; var points3 = 0;

var cards = new Array(20, 20, 20, 20, 20)
var cards1 = new Array(20, 20, 20, 20, 20)
var cards2 = new Array(20, 20, 20, 20, 20)
var clocs = new Array("jpg", "jpg", "jpg", "jpg", "jpg")
var clocs1 = new Array("jpg", "jpg", "jpg", "jpg", "jpg")
var clocs2 = new Array("jpg", "jpg", "jpg", "jpg", "jpg")
var favcart1 = new Array("jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg")
var favcart2 = new Array("jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg")

var ac = new Array("1c.jpg", "1f.jpg", "1p.jpg", "1s.jpg", "2c.jpg", "2f.jpg", "2p.jpg", "2s.jpg", "3c.jpg", "3f.jpg", "3p.jpg", "3s.jpg", "4c.jpg", "4f.jpg", "4p.jpg", "4s.jpg", "5c.jpg", "5f.jpg", "5p.jpg", "5s.jpg", "6c.jpg", "6f.jpg", "6p.jpg", "6s.jpg", "7c.jpg", "7f.jpg", "7p.jpg", "7s.jpg", "8c.jpg", "8f.jpg", "8p.jpg", "8s.jpg", "9c.jpg", "9f.jpg", "9p.jpg", "9s.jpg", "10c.jpg", "10f.jpg", "10p.jpg", "10s.jpg", "11c.jpg", "11f.jpg", "11p.jpg", "11s.jpg", "12c.jpg", "12f.jpg", "12p.jpg", "12s.jpg", "13c.jpg", "13f.jpg", "13p.jpg", "13s.jpg", "14c.jpg", "14f.jpg", "14p.jpg", "14s.jpg", "15c.jpg", "15f.jpg", "15p.jpg", "15s.jpg", "i1.jpg", "i2.jpg", "q1.jpg", "q2.jpg", "e1.jpg", "e1.jpg", "b1.jpg", "b2.jpg", "d1.jpg", "d2.jpg", "c1.jpg", "c2.jpg", "a1.jpg", "a2.jpg", "s1.jpg", "s2.jpg")
var as = new Array("1c.jpg", "1f.jpg", "1p.jpg", "1s.jpg", "2c.jpg", "2f.jpg", "2p.jpg", "2s.jpg", "3c.jpg", "3f.jpg", "3p.jpg", "3s.jpg", "4c.jpg", "4f.jpg", "4p.jpg", "4s.jpg", "5c.jpg", "5f.jpg", "5p.jpg", "5s.jpg", "6c.jpg", "6f.jpg", "6p.jpg", "6s.jpg", "7c.jpg", "7f.jpg", "7p.jpg", "7s.jpg", "8c.jpg", "8f.jpg", "8p.jpg", "8s.jpg", "9c.jpg", "9f.jpg", "9p.jpg", "9s.jpg", "10c.jpg", "10f.jpg", "10p.jpg", "10s.jpg", "11c.jpg", "11f.jpg", "11p.jpg", "11s.jpg", "12c.jpg", "12f.jpg", "12p.jpg", "12s.jpg", "13c.jpg", "13f.jpg", "13p.jpg", "13s.jpg", "14c.jpg", "14f.jpg", "14p.jpg", "14s.jpg", "15c.jpg", "15f.jpg", "15p.jpg", "15s.jpg", "i1.jpg", "i2.jpg", "q1.jpg", "q2.jpg", "e1.jpg", "e1.jpg", "b1.jpg", "b2.jpg", "d1.jpg", "d2.jpg", "c1.jpg", "c2.jpg", "a1.jpg", "a2.jpg", "s1.jpg", "s2.jpg")
var favc = new Array("1c.jpg", "1f.jpg", "1p.jpg", "1s.jpg", "2c.jpg", "2f.jpg", "2p.jpg", "2s.jpg", "3c.jpg", "3f.jpg", "3p.jpg", "3s.jpg", "4c.jpg", "4f.jpg", "4p.jpg", "4s.jpg", "5c.jpg", "5f.jpg", "5p.jpg", "5s.jpg", "6c.jpg", "6f.jpg", "6p.jpg", "6s.jpg", "7c.jpg", "7f.jpg", "7p.jpg", "7s.jpg", "8c.jpg", "8f.jpg", "8p.jpg", "8s.jpg", "9c.jpg", "9f.jpg", "9p.jpg", "9s.jpg", "10c.jpg", "10f.jpg", "10p.jpg", "10s.jpg", "11c.jpg", "11f.jpg", "11p.jpg", "11s.jpg", "12c.jpg", "12f.jpg", "12p.jpg", "12s.jpg", "13c.jpg", "13f.jpg", "13p.jpg", "13s.jpg", "14c.jpg", "14f.jpg", "14p.jpg", "14s.jpg", "15c.jpg", "15f.jpg", "15p.jpg", "15s.jpg", "i1.jpg", "i2.jpg", "q1.jpg", "q2.jpg", "e1.jpg", "e1.jpg", "b1.jpg", "b2.jpg", "d1.jpg", "d2.jpg", "c1.jpg", "c2.jpg", "a1.jpg", "a2.jpg", "s1.jpg", "s2.jpg")

function scheck() {
if (bomb == 1) { void(0) }
else {
if (score == 0 || score > 23 || score < -23) {
	alert("Вы размбомблены!")
	document.getElementById("turn").disabled = true
	pas = 1; bomb = 1;
}
else if (score == 23 || score == -23) {
	alert("Вы собрали чистый сабакк!")
	document.getElementById("turn").disabled = true
	pas = 1; bomb = 1;
}
else { void(0) }
}//big else end
}

function turn() {
updatelog("************************************************************")
aiscore();
//for cpu
if (pas1 == 1) { void(0) }
else {
if (score1 > lim1 || score1 < lam1 || score1 == 0) { updatelog("- " + race1 + " пасует"); pas1 = 1 }
else {
var c1,d1,f1,n1;
c1 = randomize(c1)
d1 = convert(c1)
f1 = compile(c1)
var u1 = 0
updatelog("- " + race1 + " получил карту \"" + f1 + "\"")
while (u1 == 0) { 
if (cards1[2] == 20) {
u1 = 1; cards1[2] = d1; clocs1[2] = c1
document.getElementById("cpuc2").src = "cards/" + c1
document.getElementById("cpuc2").alt = f1
}
else if (cards1[3] == 20) {
u1 = 1; cards1[3] = d1; clocs1[3] = c1
document.getElementById("cpuc3").src = "cards/" + c1
document.getElementById("cpuc3").alt = f1
}
else if (cards1[4] == 20) {
u1 = 1; cards1[4] = d1; clocs1[4] = c1
document.getElementById("cpuc4").src = "cards/" + c1
document.getElementById("cpuc4").alt = f1
updatelog("- " + race1 + " пасует"); pas1 = 1
}
} // end of while
} // end of else
} // end of bigelse

//***************************************************************
//for human
scheck()
if (pas == 1) { void(0) }
else {
var c,d,f,n;
c = randomize(c)
d = convert(c)
f = compile(c)
var u = 0
updatelog("- Вы получили карту \"" + f + "\"")
while (u == 0) { 
if (cards[2] == 20) {
u = 1; cards[2] = d; clocs[2] = c
document.getElementById("cart2").src = "cards/" + c
document.getElementById("cart2").alt = f
}
else if (cards[3] == 20) {
u = 1; cards[3] = d; clocs[3] = c
document.getElementById("cart3").src = "cards/" + c
document.getElementById("cart3").alt = f
}
else if (cards[4] == 20) {
u = 1; cards[4] = d; clocs[4] = c
document.getElementById("cart4").src = "cards/" + c
document.getElementById("cart4").alt = f
document.getElementById("turn").disabled = true
}
} // end of while
} // end of big else
//***************************************************************

//for cpu2
if (pas2 == 1) { void(0) }
else {
if (score2 > lim2 || score2 < lam2 || score2 == 0) { updatelog("- " + race2 + " пасует"); pas2 = 1 }
else {
var c2,d2,f2,n2;
c2 = randomize(c2)
d2 = convert(c2)
f2 = compile(c2)
var u2 = 0
updatelog("- " + race2 + " получил карту \"" + f2 + "\"")
while (u2 == 0) { 
if (cards2[2] == 20) {
u2 = 2; cards2[2] = d2; clocs2[2] = c2
document.getElementById("kpuc2").src = "cards/" + c2
document.getElementById("kpuc2").alt = f2
}
else if (cards2[3] == 20) {
u2 = 2; cards2[3] = d2; clocs2[3] = c2
document.getElementById("kpuc3").src = "cards/" + c2
document.getElementById("kpuc3").alt = f2
}
else if (cards2[4] == 20) {
u2 = 2; cards2[4] = d2; clocs2[4] = c2
document.getElementById("kpuc4").src = "cards/" + c2
document.getElementById("kpuc4").alt = f2
updatelog("- " + race2 + " пасует"); pas2 = 1
}
} // end of while
} // end of else
} // end of bigelse
interai1(); interai2();
generate(); scrollit();
aiscore(); scheck();
}

function pass() {
pas = 1; var zi,z1,z2
do { turn() } while (pas1 != 1 && pas2 != 1)
zi = msg(score)
z1 = msg(score1)
z2 = msg(score2)
document.getElementById("cpuc0").src = "cards/" + clocs1[0]
document.getElementById("cpuc1").src = "cards/" + clocs1[1]
document.getElementById("kpuc0").src = "cards/" + clocs2[0]
document.getElementById("kpuc1").src = "cards/" + clocs2[1]
aiscore()
alert("Круг окончен!\nРезультаты:\n" + race1 + z1 + "\n" + name + zi + "\n" + race2 + z2)
gamescr(); nullifier()
if (points1 <= 500 && points2 <= 500 && points3 <= 500) { gamer() }
else if (points1 > 500) { alert("Турнир по сабакку выиграл " + cpu1 + "!"); ref() } 
else if (points2 > 500) { alert("Турнир по сабакку выиграл " + cpu2 + "!"); ref() }
else if (points3 > 500) { alert("Турнир по сабакку выиграл " + name + "!"); ref() } 
else if (points1 > 500 && points2 > 500 && points1 > points2) { alert("Турнир по сабакку выиграл " + cpu1 + "!"); ref() }
else if (points1 > 500 && points2 > 500 && points1 < points2) { alert("Турнир по сабакку выиграл " + cpu2 + "!"); ref() }
else if (points2 > 500 && points3 > 500 && points2 < points3) { alert("Турнир по сабакку выиграл " + cpu2 + "!"); ref() }
else if (points2 > 500 && points2 > 500 && points2 < points3) { alert("Турнир по сабакку выиграл " + name + "!"); ref() }
else if (points1 > 500 && points3 > 500 && points1 < points3) { alert("Турнир по сабакку выиграл " + cpu1 + "!"); ref() }
else if (points1 > 500 && points3 > 500 && points1 < points3) { alert("Турнир по сабакку выиграл " + name + "!"); ref() }
else { alert("Турнир по сабакку завершился боевой ничьей!"); ref() }
}

function msg(inputvalue) {
var temp = inputvalue
if (inputvalue == 0 || inputvalue > 23 || inputvalue < -23) { inputvalue = " разбомблен :(" }
else if (inputvalue == 23 || inputvalue == -23) { inputvalue = " собрал чистый сабакк!"  }
else { inputvalue = " набрал " + temp + " очк." }
return inputvalue	
}

function gamescr() {
var p3 = 0; var p1 = 0; var p2 = 0

if (score == 0 || score > 23 || score < -23) { p3 = -24 }
else if (score == 23 || score == -23) { points3 = points3 + 46; p3 = 24 }
else if (score >= -22 && score <= -1) { points3 = points3 + (score * -1); p3 = (score * -1) }
else { points3 = points3 + score; p3 = score }

if (score1 == 0 || score1 > 23 || score1 < -23) { p1 = -24 }
else if (score1 == 23 || score1 == -23) { points1 = points1 + 46; p1 = 24 }
else if (score1 >= -22 && score1 <= -1) { points1 = points1 + (score1 * -1); p1 = (score1 * -1) }
else { points1 = points1 + score1; p1 = score1 }

if (score2 == 0 || score2 > 23 || score2 < -23) { p2 = -24 }
else if (score2 == 23 || score2 == -23) { points2 = points2 + 46; p2 = 24 }
else if (score2 >= -22 && score2 <= -1) { points2 = points2 + (score2 * -1); p2 = (score2 * -1) }
else { points2 = points2 + score2; p2 = score2 }

if (p1 == 24 || p2 == 24 || p3 == 24) { void(0) }
else {
if (p1 > p2 && p1 > p3) { points1 = points1 + Math.round(p1/2) }
else if (p2 > p1 && p2 > p3) { points2 = points2 + Math.round(p2/2) }
else if (p3 > p1 && p3 > p2) { points3 = points3 + Math.round(p3/2) }
else { void(0) }
}// else end
}

function givecards() {
//for human
var a,b
a = randomize(a); clocs[0] = a
b = randomize(b); clocs[1] = b
document.getElementById("cart0").src = "cards/" + a
document.getElementById("cart1").src = "cards/" + b
a = convert(a); cards[0] = a
b = convert(b); cards[1] = b
a = compile(clocs[0]);
b = compile(clocs[1]);
document.getElementById("cart0").alt = a
document.getElementById("cart1").alt = b
updatescr()
//for cpu1
var a1,b1
a1 = randomize(a1)
b1 = randomize(b1)
clocs1[0] = a1
clocs1[1] = b1
a1 = convert(a1)
b1 = convert(b1)
cards1[0] = a1
cards1[1] = b1
document.getElementById("cpuc0").alt = ""
document.getElementById("cpuc1").alt = ""
//for cpu2
var a2,b2
a2 = randomize(a2)
b2 = randomize(b2)
clocs2[0] = a2
clocs2[1] = b2
a2 = convert(a2)
b2 = convert(b2)
cards2[0] = a2
cards2[1] = b2
document.getElementById("kpuc0").alt = ""
document.getElementById("kpuc1").alt = ""
clearlog()
scrollit()
scheck()
}

function gamer() {
lozhka1 = 0; lozhka2 = 0
pas = 0; pas1 = 0; pas2 = 0;
var avatar = document.getElementById("ava").value
if (avatar != "") { document.getElementById("av2").src = avatar }
name = document.getElementById("name").value
if (name == "") {
alert("Введите корректное имя!") }
else
{ 
document.getElementById("turn").disabled = false
document.getElementById("av2").alt = name
document.getElementById("vvod").style.visibility = "hidden"
document.getElementById("game").style.visibility = "visible"
muschan()
favorcgen()
givecards()
}
} 

function opps() {
if (race1 != "none" && race2 != "none") { void(0) }
else {
var j, k, l
l = 1
while (l == 1) {
j = arnum(5)
k = arnum(5)
if (j != k) { l = 0 }
else { l = 1 }  
} //end of while

if (j == 0) { cpu1 = "ботан"; lim1 = 15; lam1 = -15
document.getElementById("av1").src = "files/cpu1.gif"
document.getElementById("av1").alt = "Ботан"
race1 = "Ботан"
}
else if (j == 1) { cpu1 = "чадра-фан"; lim1 = 16; lam1 = -16
document.getElementById("av1").src = "files/cpu2.gif"
document.getElementById("av1").alt = "Чадра-фан"
race1 = "Чадра-фан"
}
else if (j == 2) { cpu1 = "иторианец"; lim1 = 17; lam1 = -17
document.getElementById("av1").src = "files/cpu3.gif"
document.getElementById("av1").alt = "Иторианец"
race1 = "Иторианец"
}
else if (j == 3) { cpu1 = "родианец"; lim1 = 18; lam1 = -18
document.getElementById("av1").src = "files/cpu4.gif"
document.getElementById("av1").alt = "Родианец"
race1 = "Родианец"
}
else if (j == 4) { cpu1 = "суллустианин"; lim1 = 19; lam1 = -19
document.getElementById("av1").src = "files/cpu5.gif"
document.getElementById("av1").alt = "Суллустианин"
race1 = "Суллустианин"
}

if (k == 0) { cpu2 = "ботан"; lim2 = 15; lam2 = -15
document.getElementById("av3").src = "files/cpu1.gif"
document.getElementById("av3").alt = "Ботан"
race2 = "Ботан"
}
else if (k == 1) { cpu2 = "чадра-фан"; lim2 = 16; lam2 = -16
document.getElementById("av3").src = "files/cpu2.gif"
document.getElementById("av3").alt = "Чадра-фан"
race2 = "Чадра-фан"
}
else if (k == 2) {cpu2 = "иторианец";  lim2 = 17; lam2 = -17
document.getElementById("av3").src = "files/cpu3.gif"
document.getElementById("av3").alt = "Иторианец"
race2 = "Иторианец"
}
else if (k == 3) { cpu2 = "родианец"; lim2 = 18; lam2 = -18
document.getElementById("av3").src = "files/cpu4.gif"
document.getElementById("av3").alt = "Родианец"
race2 = "Родианец"
}
else if (k == 4) { cpu2 = "суллустианин"; lim2 = 19; lam2 = -19
document.getElementById("av3").src = "files/cpu5.gif"
document.getElementById("av3").alt = "Суллустианин"
race2 = "Суллустианин"
}
updatelog("- Против вас играют " + cpu1 + " и " + cpu2)
updatelog("- Вы получили свои начальные карты")
} // big else end
}

function aiscore() {
pts1 = 0
if (cards1[0] != 20) { pts1 = pts1 + cards1[0] }
if (cards1[1] != 20) { pts1 = pts1 + cards1[1] }
if (cards1[2] != 20) { pts1 = pts1 + cards1[2] }
if (cards1[3] != 20) { pts1 = pts1 + cards1[3] }
if (cards1[4] != 20) { pts1 = pts1 + cards1[4] }
if (inter1 != 20) { pts1 = pts1 + inter1 }
pts2 = 0
if (cards2[0] != 20) { pts2 = pts2 + cards2[0] }
if (cards2[1] != 20) { pts2 = pts2 + cards2[1] }
if (cards2[2] != 20) { pts2 = pts2 + cards2[2] }
if (cards2[3] != 20) { pts2 = pts2 + cards2[3] }
if (cards2[4] != 20) { pts2 = pts2 + cards2[4] }
if (inter2 != 20) { pts2 = pts2 + inter2 }
score1 = pts1
score2 = pts2
}

function favorcgen() {
var i, m1, m2
i = 0
while (i <= 9) {
m1 = randomize2(m1)
m2 = randomize2(m2)
favcart1[i] = m1
favcart2[i] = m2
i = i + 1
} // while end
}

function arnum(limit){
  return Math.floor(Math.random()*limit);
}

function randomize(r) {
var zu = 0
while (zu == 0) {
var z = arnum(76)
if (z == 0 && ac[0] == "1c.jpg") { r = ac[0]; ac[0] = "0"; zu = 1; }
else
if (z == 1 && ac[1] == "1f.jpg") { r = ac[1]; ac[1] = "0"; zu = 1; }
else
if (z == 2 && ac[2] == "1p.jpg") { r = ac[2]; ac[2] = "0"; zu = 1; }
else
if (z == 3 && ac[3] == "1s.jpg") { r = ac[3]; ac[3] = "0"; zu = 1; }
else
if (z == 4 && ac[4] == "2c.jpg") { r = ac[4]; ac[4] = "0"; zu = 1; }
else
if (z == 5 && ac[5] == "2f.jpg") { r = ac[5]; ac[5] = "0"; zu = 1; }
else
if (z == 6 && ac[6] == "2p.jpg") { r = ac[6]; ac[6] = "0"; zu = 1; }
else
if (z == 7 && ac[7] == "2s.jpg") { r = ac[7]; ac[7] = "0"; zu = 1; }
else
if (z == 8 && ac[8] == "3c.jpg") { r = ac[8]; ac[8] = "0"; zu = 1; }
else
if (z == 9 && ac[9] == "3f.jpg") { r = ac[9]; ac[9] = "0"; zu = 1; }
else
if (z == 10 && ac[10] == "3p.jpg") { r = ac[10]; ac[10] = "0"; zu = 1; }
else
if (z == 11 && ac[11] == "3s.jpg") { r = ac[11]; ac[11] = "0"; zu = 1; }
else
if (z == 12 && ac[12] == "4c.jpg") { r = ac[12]; ac[12] = "0"; zu = 1; }
else
if (z == 13 && ac[13] == "4f.jpg") { r = ac[13]; ac[13] = "0"; zu = 1; }
else
if (z == 14 && ac[14] == "4p.jpg") { r = ac[14]; ac[14] = "0"; zu = 1; }
else
if (z == 15 && ac[15] == "4s.jpg") { r = ac[15]; ac[15] = "0"; zu = 1; }
else
if (z == 16 && ac[16] == "5c.jpg") { r = ac[16]; ac[16] = "0"; zu = 1; }
else
if (z == 17 && ac[17] == "5f.jpg") { r = ac[17]; ac[17] = "0"; zu = 1; }
else
if (z == 18 && ac[18] == "5p.jpg") { r = ac[18]; ac[18] = "0"; zu = 1; }
else
if (z == 19 && ac[19] == "5s.jpg") { r = ac[19]; ac[19] = "0"; zu = 1; }
else
if (z == 20 && ac[20] == "6c.jpg") { r = ac[20]; ac[20] = "0"; zu = 1; }
else
if (z == 21 && ac[21] == "6f.jpg") { r = ac[21]; ac[21] = "0"; zu = 1; }
else
if (z == 22 && ac[22] == "6p.jpg") { r = ac[22]; ac[22] = "0"; zu = 1; }
else
if (z == 23 && ac[23] == "6s.jpg") { r = ac[23]; ac[23] = "0"; zu = 1; }
else
if (z == 24 && ac[24] == "7c.jpg") { r = ac[24]; ac[24] = "0"; zu = 1; }
else
if (z == 25 && ac[25] == "7f.jpg") { r = ac[25]; ac[25] = "0"; zu = 1; }
else
if (z == 26 && ac[26] == "7p.jpg") { r = ac[26]; ac[26] = "0"; zu = 1; }
else
if (z == 27 && ac[27] == "7s.jpg") { r = ac[27]; ac[27] = "0"; zu = 1; }
else
if (z == 28 && ac[28] == "8c.jpg") { r = ac[28]; ac[28] = "0"; zu = 1; }
else
if (z == 29 && ac[29] == "8f.jpg") { r = ac[29]; ac[29] = "0"; zu = 1; }
else
if (z == 30 && ac[30] == "8p.jpg") { r = ac[30]; ac[30] = "0"; zu = 1; }
else
if (z == 31 && ac[31] == "8s.jpg") { r = ac[31]; ac[31] = "0"; zu = 1; }
else
if (z == 32 && ac[32] == "9c.jpg") { r = ac[32]; ac[32] = "0"; zu = 1; }
else
if (z == 33 && ac[33] == "9f.jpg") { r = ac[33]; ac[33] = "0"; zu = 1; }
else
if (z == 34 && ac[34] == "9p.jpg") { r = ac[34]; ac[34] = "0"; zu = 1; }
else
if (z == 35 && ac[35] == "9s.jpg") { r = ac[35]; ac[35] = "0"; zu = 1; }
else
if (z == 36 && ac[36] == "10c.jpg") { r = ac[36]; ac[36] = "0"; zu = 1; }
else
if (z == 37 && ac[37] == "10f.jpg") { r = ac[37]; ac[37] = "0"; zu = 1; }
else
if (z == 38 && ac[38] == "10p.jpg") { r = ac[38]; ac[38] = "0"; zu = 1; }
else
if (z == 39 && ac[39] == "10s.jpg") { r = ac[39]; ac[39] = "0"; zu = 1; }
else
if (z == 40 && ac[40] == "11c.jpg") { r = ac[40]; ac[40] = "0"; zu = 1; }
else
if (z == 41 && ac[41] == "11f.jpg") { r = ac[41]; ac[41] = "0"; zu = 1; }
else
if (z == 42 && ac[42] == "11p.jpg") { r = ac[42]; ac[42] = "0"; zu = 1; }
else
if (z == 43 && ac[43] == "11s.jpg") { r = ac[43]; ac[43] = "0"; zu = 1; }
else
if (z == 44 && ac[44] == "12c.jpg") { r = ac[44]; ac[44] = "0"; zu = 1; }
else
if (z == 45 && ac[45] == "12f.jpg") { r = ac[45]; ac[45] = "0"; zu = 1; }
else
if (z == 46 && ac[46] == "12p.jpg") { r = ac[46]; ac[46] = "0"; zu = 1; }
else
if (z == 47 && ac[47] == "12s.jpg") { r = ac[47]; ac[47] = "0"; zu = 1; }
else
if (z == 48 && ac[48] == "13c.jpg") { r = ac[48]; ac[48] = "0"; zu = 1; }
else
if (z == 49 && ac[49] == "13f.jpg") { r = ac[49]; ac[49] = "0"; zu = 1; }
else
if (z == 50 && ac[50] == "13p.jpg") { r = ac[50]; ac[50] = "0"; zu = 1; }
else
if (z == 51 && ac[51] == "13s.jpg") { r = ac[51]; ac[51] = "0"; zu = 1; }
else
if (z == 52 && ac[52] == "14c.jpg") { r = ac[52]; ac[52] = "0"; zu = 1; }
else
if (z == 53 && ac[53] == "14f.jpg") { r = ac[53]; ac[53] = "0"; zu = 1; }
else
if (z == 54 && ac[54] == "14p.jpg") { r = ac[54]; ac[54] = "0"; zu = 1; }
else
if (z == 55 && ac[55] == "14s.jpg") { r = ac[55]; ac[55] = "0"; zu = 1; }
else
if (z == 56 && ac[56] == "15c.jpg") { r = ac[56]; ac[56] = "0"; zu = 1; }
else
if (z == 57 && ac[57] == "15f.jpg") { r = ac[57]; ac[57] = "0"; zu = 1; }
else
if (z == 58 && ac[58] == "15p.jpg") { r = ac[58]; ac[58] = "0"; zu = 1; }
else
if (z == 59 && ac[59] == "15s.jpg") { r = ac[59]; ac[59] = "0"; zu = 1; }
else
if (z == 60 && ac[60] == "i1.jpg") { r = ac[60]; ac[60] = "0"; zu = 1; }
else
if (z == 61 && ac[61] == "i2.jpg") { r = ac[61]; ac[61] = "0"; zu = 1; }
else
if (z == 62 && ac[62] == "q1.jpg") { r = ac[62]; ac[62] = "0"; zu = 1; }
else
if (z == 63 && ac[63] == "q2.jpg") { r = ac[63]; ac[63] = "0"; zu = 1; }
else
if (z == 64 && ac[64] == "e1.jpg") { r = ac[64]; ac[64] = "0"; zu = 1; }
else
if (z == 65 && ac[65] == "e2.jpg") { r = ac[65]; ac[65] = "0"; zu = 1; }
else
if (z == 66 && ac[66] == "b1.jpg") { r = ac[66]; ac[66] = "0"; zu = 1; }
else
if (z == 67 && ac[67] == "b2.jpg") { r = ac[67]; ac[67] = "0"; zu = 1; }
else
if (z == 68 && ac[68] == "d1.jpg") { r = ac[68]; ac[68] = "0"; zu = 1; }
else
if (z == 69 && ac[69] == "d2.jpg") { r = ac[69]; ac[69] = "0"; zu = 1; }
else
if (z == 70 && ac[70] == "c1.jpg") { r = ac[70]; ac[70] = "0"; zu = 1; }
else
if (z == 71 && ac[71] == "c2.jpg") { r = ac[71]; ac[71] = "0"; zu = 1; }
else
if (z == 72 && ac[72] == "a1.jpg") { r = ac[72]; ac[72] = "0"; zu = 1; }
else
if (z == 73 && ac[73] == "a2.jpg") { r = ac[73]; ac[73] = "0"; zu = 1; }
else
if (z == 74 && ac[74] == "s1.jpg") { r = ac[74]; ac[74] = "0"; zu = 1; }
else
if (z == 75 && ac[75] == "s2.jpg") { r = ac[75]; ac[75] = "0"; zu = 1; }
else { zu = 0 }
} // end of while
return r;
}

function randomize2(r2) {
var zu2 = 0
while (zu2 == 0) {
var z = arnum(76)
if (z == 0 && favc[0] == "1c.jpg") { r2 = favc[0]; favc[0] = "0"; zu2 = 1; }
else
if (z == 1 && favc[1] == "1f.jpg") { r2 = favc[1]; favc[1] = "0"; zu2 = 1; }
else
if (z == 2 && favc[2] == "1p.jpg") { r2 = favc[2]; favc[2] = "0"; zu2 = 1; }
else
if (z == 3 && favc[3] == "1s.jpg") { r2 = favc[3]; favc[3] = "0"; zu2 = 1; }
else
if (z == 4 && favc[4] == "2c.jpg") { r2 = favc[4]; favc[4] = "0"; zu2 = 1; }
else
if (z == 5 && favc[5] == "2f.jpg") { r2 = favc[5]; favc[5] = "0"; zu2 = 1; }
else
if (z == 6 && favc[6] == "2p.jpg") { r2 = favc[6]; favc[6] = "0"; zu2 = 1; }
else
if (z == 7 && favc[7] == "2s.jpg") { r2 = favc[7]; favc[7] = "0"; zu2 = 1; }
else
if (z == 8 && favc[8] == "3c.jpg") { r2 = favc[8]; favc[8] = "0"; zu2 = 1; }
else
if (z == 9 && favc[9] == "3f.jpg") { r2 = favc[9]; favc[9] = "0"; zu2 = 1; }
else
if (z == 10 && favc[10] == "3p.jpg") { r2 = favc[10]; favc[10] = "0"; zu2 = 1; }
else
if (z == 11 && favc[11] == "3s.jpg") { r2 = favc[11]; favc[11] = "0"; zu2 = 1; }
else
if (z == 12 && favc[12] == "4c.jpg") { r2 = favc[12]; favc[12] = "0"; zu2 = 1; }
else
if (z == 13 && favc[13] == "4f.jpg") { r2 = favc[13]; favc[13] = "0"; zu2 = 1; }
else
if (z == 14 && favc[14] == "4p.jpg") { r2 = favc[14]; favc[14] = "0"; zu2 = 1; }
else
if (z == 15 && favc[15] == "4s.jpg") { r2 = favc[15]; favc[15] = "0"; zu2 = 1; }
else
if (z == 16 && favc[16] == "5c.jpg") { r2 = favc[16]; favc[16] = "0"; zu2 = 1; }
else
if (z == 17 && favc[17] == "5f.jpg") { r2 = favc[17]; favc[17] = "0"; zu2 = 1; }
else
if (z == 18 && favc[18] == "5p.jpg") { r2 = favc[18]; favc[18] = "0"; zu2 = 1; }
else
if (z == 19 && favc[19] == "5s.jpg") { r2 = favc[19]; favc[19] = "0"; zu2 = 1; }
else
if (z == 20 && favc[20] == "6c.jpg") { r2 = favc[20]; favc[20] = "0"; zu2 = 1; }
else
if (z == 21 && favc[21] == "6f.jpg") { r2 = favc[21]; favc[21] = "0"; zu2 = 1; }
else
if (z == 22 && favc[22] == "6p.jpg") { r2 = favc[22]; favc[22] = "0"; zu2 = 1; }
else
if (z == 23 && favc[23] == "6s.jpg") { r2 = favc[23]; favc[23] = "0"; zu2 = 1; }
else
if (z == 24 && favc[24] == "7c.jpg") { r2 = favc[24]; favc[24] = "0"; zu2 = 1; }
else
if (z == 25 && favc[25] == "7f.jpg") { r2 = favc[25]; favc[25] = "0"; zu2 = 1; }
else
if (z == 26 && favc[26] == "7p.jpg") { r2 = favc[26]; favc[26] = "0"; zu2 = 1; }
else
if (z == 27 && favc[27] == "7s.jpg") { r2 = favc[27]; favc[27] = "0"; zu2 = 1; }
else
if (z == 28 && favc[28] == "8c.jpg") { r2 = favc[28]; favc[28] = "0"; zu2 = 1; }
else
if (z == 29 && favc[29] == "8f.jpg") { r2 = favc[29]; favc[29] = "0"; zu2 = 1; }
else
if (z == 30 && favc[30] == "8p.jpg") { r2 = favc[30]; favc[30] = "0"; zu2 = 1; }
else
if (z == 31 && favc[31] == "8s.jpg") { r2 = favc[31]; favc[31] = "0"; zu2 = 1; }
else
if (z == 32 && favc[32] == "9c.jpg") { r2 = favc[32]; favc[32] = "0"; zu2 = 1; }
else
if (z == 33 && favc[33] == "9f.jpg") { r2 = favc[33]; favc[33] = "0"; zu2 = 1; }
else
if (z == 34 && favc[34] == "9p.jpg") { r2 = favc[34]; favc[34] = "0"; zu2 = 1; }
else
if (z == 35 && favc[35] == "9s.jpg") { r2 = favc[35]; favc[35] = "0"; zu2 = 1; }
else
if (z == 36 && favc[36] == "10c.jpg") { r2 = favc[36]; favc[36] = "0"; zu2 = 1; }
else
if (z == 37 && favc[37] == "10f.jpg") { r2 = favc[37]; favc[37] = "0"; zu2 = 1; }
else
if (z == 38 && favc[38] == "10p.jpg") { r2 = favc[38]; favc[38] = "0"; zu2 = 1; }
else
if (z == 39 && favc[39] == "10s.jpg") { r2 = favc[39]; favc[39] = "0"; zu2 = 1; }
else
if (z == 40 && favc[40] == "11c.jpg") { r2 = favc[40]; favc[40] = "0"; zu2 = 1; }
else
if (z == 41 && favc[41] == "11f.jpg") { r2 = favc[41]; favc[41] = "0"; zu2 = 1; }
else
if (z == 42 && favc[42] == "11p.jpg") { r2 = favc[42]; favc[42] = "0"; zu2 = 1; }
else
if (z == 43 && favc[43] == "11s.jpg") { r2 = favc[43]; favc[43] = "0"; zu2 = 1; }
else
if (z == 44 && favc[44] == "12c.jpg") { r2 = favc[44]; favc[44] = "0"; zu2 = 1; }
else
if (z == 45 && favc[45] == "12f.jpg") { r2 = favc[45]; favc[45] = "0"; zu2 = 1; }
else
if (z == 46 && favc[46] == "12p.jpg") { r2 = favc[46]; favc[46] = "0"; zu2 = 1; }
else
if (z == 47 && favc[47] == "12s.jpg") { r2 = favc[47]; favc[47] = "0"; zu2 = 1; }
else
if (z == 48 && favc[48] == "13c.jpg") { r2 = favc[48]; favc[48] = "0"; zu2 = 1; }
else
if (z == 49 && favc[49] == "13f.jpg") { r2 = favc[49]; favc[49] = "0"; zu2 = 1; }
else
if (z == 50 && favc[50] == "13p.jpg") { r2 = favc[50]; favc[50] = "0"; zu2 = 1; }
else
if (z == 51 && favc[51] == "13s.jpg") { r2 = favc[51]; favc[51] = "0"; zu2 = 1; }
else
if (z == 52 && favc[52] == "14c.jpg") { r2 = favc[52]; favc[52] = "0"; zu2 = 1; }
else
if (z == 53 && favc[53] == "14f.jpg") { r2 = favc[53]; favc[53] = "0"; zu2 = 1; }
else
if (z == 54 && favc[54] == "14p.jpg") { r2 = favc[54]; favc[54] = "0"; zu2 = 1; }
else
if (z == 55 && favc[55] == "14s.jpg") { r2 = favc[55]; favc[55] = "0"; zu2 = 1; }
else
if (z == 56 && favc[56] == "15c.jpg") { r2 = favc[56]; favc[56] = "0"; zu2 = 1; }
else
if (z == 57 && favc[57] == "15f.jpg") { r2 = favc[57]; favc[57] = "0"; zu2 = 1; }
else
if (z == 58 && favc[58] == "15p.jpg") { r2 = favc[58]; favc[58] = "0"; zu2 = 1; }
else
if (z == 59 && favc[59] == "15s.jpg") { r2 = favc[59]; favc[59] = "0"; zu2 = 1; }
else
if (z == 60 && favc[60] == "i1.jpg") { r2 = favc[60]; favc[60] = "0"; zu2 = 1; }
else
if (z == 61 && favc[61] == "i2.jpg") { r2 = favc[61]; favc[61] = "0"; zu2 = 1; }
else
if (z == 62 && favc[62] == "q1.jpg") { r2 = favc[62]; favc[62] = "0"; zu2 = 1; }
else
if (z == 63 && favc[63] == "q2.jpg") { r2 = favc[63]; favc[63] = "0"; zu2 = 1; }
else
if (z == 64 && favc[64] == "e1.jpg") { r2 = favc[64]; favc[64] = "0"; zu2 = 1; }
else
if (z == 65 && favc[65] == "e2.jpg") { r2 = favc[65]; favc[65] = "0"; zu2 = 1; }
else
if (z == 66 && favc[66] == "b1.jpg") { r2 = favc[66]; favc[66] = "0"; zu2 = 1; }
else
if (z == 67 && favc[67] == "b2.jpg") { r2 = favc[67]; favc[67] = "0"; zu2 = 1; }
else
if (z == 68 && favc[68] == "d1.jpg") { r2 = favc[68]; favc[68] = "0"; zu2 = 1; }
else
if (z == 69 && favc[69] == "d2.jpg") { r2 = favc[69]; favc[69] = "0"; zu2 = 1; }
else
if (z == 70 && favc[70] == "c1.jpg") { r2 = favc[70]; favc[70] = "0"; zu2 = 1; }
else
if (z == 71 && favc[71] == "c2.jpg") { r2 = favc[71]; favc[71] = "0"; zu2 = 1; }
else
if (z == 72 && favc[72] == "a1.jpg") { r2 = favc[72]; favc[72] = "0"; zu2 = 1; }
else
if (z == 73 && favc[73] == "a2.jpg") { r2 = favc[73]; favc[73] = "0"; zu2 = 1; }
else
if (z == 74 && favc[74] == "s1.jpg") { r2 = favc[74]; favc[74] = "0"; zu2 = 1; }
else
if (z == 75 && favc[75] == "s2.jpg") { r2 = favc[75]; favc[75] = "0"; zu2 = 1; }
else { zu2 = 0 }
} // end of while
return r2;
}

function generaze(f) {
var za = 0
while (za == 0) {
var b = arnum(76)
if (b == 0) { f = as[0]; za=1; }
else
if (b == 1) { f = as[1]; za=1; }
else
if (b == 2) { f = as[2]; za=1; }
else
if (b == 3) { f = as[3]; za=1; }
else
if (b == 4) { f = as[4]; za=1; }
else
if (b == 5) { f = as[5]; za=1; }
else
if (b == 6) { f = as[6]; za=1; }
else
if (b == 7) { f = as[7]; za=1; }
else
if (b == 8) { f = as[8]; za=1; }
else
if (b == 9) { f = as[9]; za=1; }
else
if (b == 10) { f = as[10]; za=1; }
else
if (b == 11) { f = as[11]; za=1; }
else
if (b == 12) { f = as[12]; za=1; }
else
if (b == 13) { f = as[13]; za=1; }
else
if (b == 14) { f = as[14]; za=1; }
else
if (b == 15) { f = as[15]; za=1; }
else
if (b == 16) { f = as[16]; za=1; }
else
if (b == 17) { f = as[17]; za=1; }
else
if (b == 18) { f = as[18]; za=1; }
else
if (b == 19) { f = as[19]; za=1; }
else
if (b == 20) { f = as[20]; za=1; }
else
if (b == 21) { f = as[21]; za=1; }
else
if (b == 22) { f = as[22]; za=1; }
else
if (b == 23) { f = as[23]; za=1; }
else
if (b == 24) { f = as[24]; za=1; }
else
if (b == 25) { f = as[25]; za=1; }
else
if (b == 26) { f = as[26]; za=1; }
else
if (b == 27) { f = as[27]; za=1; }
else
if (b == 28) { f = as[28]; za=1; }
else
if (b == 29) { f = as[29]; za=1; }
else
if (b == 30) { f = as[30]; za=1; }
else
if (b == 31) { f = as[31]; za=1; }
else
if (b == 32) { f = as[32]; za=1; }
else
if (b == 33) { f = as[33]; za=1; }
else
if (b == 34) { f = as[34]; za=1; }
else
if (b == 35) { f = as[35]; za=1; }
else
if (b == 36) { f = as[36]; za=1; }
else
if (b == 37) { f = as[37]; za=1; }
else
if (b == 38) { f = as[38]; za=1; }
else
if (b == 39) { f = as[39]; za=1; }
else
if (b == 40) { f = as[40]; za=1; }
else
if (b == 41) { f = as[41]; za=1; }
else
if (b == 42) { f = as[42]; za=1; }
else
if (b == 43) { f = as[43]; za=1; }
else
if (b == 44) { f = as[44]; za=1; }
else
if (b == 45) { f = as[45]; za=1; }
else
if (b == 46) { f = as[46]; za=1; }
else
if (b == 47) { f = as[47]; za=1; }
else
if (b == 48) { f = as[48]; za=1; }
else
if (b == 49) { f = as[49]; za=1; }
else
if (b == 50) { f = as[50]; za=1; }
else
if (b == 51) { f = as[51]; za=1; }
else
if (b == 52) { f = as[52]; za=1; }
else
if (b == 53) { f = as[53]; za=1; }
else
if (b == 54) { f = as[54]; za=1; }
else
if (b == 55) { f = as[55]; za=1; }
else
if (b == 56) { f = as[56]; za=1; }
else
if (b == 57) { f = as[57]; za=1; }
else
if (b == 58) { f = as[58]; za=1; }
else
if (b == 59) { f = as[59]; za=1; }
else
if (b == 60) { f = as[60]; za=1; }
else
if (b == 61) { f = as[61]; za=1; }
else
if (b == 62) { f = as[62]; za=1; }
else
if (b == 63) { f = as[63]; za=1; }
else
if (b == 64) { f = as[64]; za=1; }
else
if (b == 65) { f = as[65]; za=1; }
else
if (b == 66) { f = as[66]; za=1; }
else
if (b == 67) { f = as[67]; za=1; }
else
if (b == 68) { f = as[68]; za=1; }
else
if (b == 69) { f = as[69]; za=1; }
else
if (b == 70) { f = as[70]; za=1; }
else
if (b == 71) { f = as[71]; za=1; }
else
if (b == 72) { f = as[72]; za=1; }
else
if (b == 73) { f = as[73]; za=1; }
else
if (b == 74) { f = as[74]; za=1; }
else
if (b == 75) { f = as[75]; za=1; }
else { za=0 }
} // end of while
return f;
}

function scrollit() {
document.getElementById("log").scrollTop = 600
}

function ref() { self.location.reload() }

function updatescr() {
var pts = 0
if (cards[0] != 20) { pts = pts + cards[0] }
if (cards[1] != 20) { pts = pts + cards[1] }
if (cards[2] != 20) { pts = pts + cards[2] }
if (cards[3] != 20) { pts = pts + cards[3] }
if (cards[4] != 20) { pts = pts + cards[4] }
if (inter != 20) { pts = pts + inter }
var word = "- Ваш текущий счёт: " + pts
score = pts
updatelog(word)
}

function updatelog(sting) {
var logo = document.getElementById("log").value
logo = logo + "\n" + sting
document.getElementById("log").value = logo
}

function clearlog() {
if (game == 0) {
document.getElementById("log").value = name + ", добро пожаловать на турнир по сабакку!"
game = game + 2
}
else { document.getElementById("log").value = "Идёт " + game + "-й круг игры"; game = game + 1;
updatelog("*********************Общий счёт*********************\n" + race1 + " - " + points1 + "\n" + name + " - " + points3 + "\n" + race2 + " - " + points2 + "\n************************************************************")
}
opps()
updatescr()
document.getElementById("gen1").value = ""
document.getElementById("gen2").value = ""
}

function nullifier() {
bomb = 0;
inter = 20; inter1 = 20; inter2 = 20
score = 0; score1 = 0; score2 = 0

cards = new Array(20, 20, 20, 20, 20)
cards1 = new Array(20, 20, 20, 20, 20)
cards2 = new Array(20, 20, 20, 20, 20)
clocs = new Array("jpg", "jpg", "jpg", "jpg", "jpg")
clocs1 = new Array("jpg", "jpg", "jpg", "jpg", "jpg")
clocs2 = new Array("jpg", "jpg", "jpg", "jpg", "jpg")
favcart1 = new Array("jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg")
favcart2 = new Array("jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg")

ac = new Array("1c.jpg", "1f.jpg", "1p.jpg", "1s.jpg", "2c.jpg", "2f.jpg", "2p.jpg", "2s.jpg", "3c.jpg", "3f.jpg", "3p.jpg", "3s.jpg", "4c.jpg", "4f.jpg", "4p.jpg", "4s.jpg", "5c.jpg", "5f.jpg", "5p.jpg", "5s.jpg", "6c.jpg", "6f.jpg", "6p.jpg", "6s.jpg", "7c.jpg", "7f.jpg", "7p.jpg", "7s.jpg", "8c.jpg", "8f.jpg", "8p.jpg", "8s.jpg", "9c.jpg", "9f.jpg", "9p.jpg", "9s.jpg", "10c.jpg", "10f.jpg", "10p.jpg", "10s.jpg", "11c.jpg", "11f.jpg", "11p.jpg", "11s.jpg", "12c.jpg", "12f.jpg", "12p.jpg", "12s.jpg", "13c.jpg", "13f.jpg", "13p.jpg", "13s.jpg", "14c.jpg", "14f.jpg", "14p.jpg", "14s.jpg", "15c.jpg", "15f.jpg", "15p.jpg", "15s.jpg", "i1.jpg", "i2.jpg", "q1.jpg", "q2.jpg", "e1.jpg", "e1.jpg", "b1.jpg", "b2.jpg", "d1.jpg", "d2.jpg", "c1.jpg", "c2.jpg", "a1.jpg", "a2.jpg", "s1.jpg", "s2.jpg")
favc = new Array("1c.jpg", "1f.jpg", "1p.jpg", "1s.jpg", "2c.jpg", "2f.jpg", "2p.jpg", "2s.jpg", "3c.jpg", "3f.jpg", "3p.jpg", "3s.jpg", "4c.jpg", "4f.jpg", "4p.jpg", "4s.jpg", "5c.jpg", "5f.jpg", "5p.jpg", "5s.jpg", "6c.jpg", "6f.jpg", "6p.jpg", "6s.jpg", "7c.jpg", "7f.jpg", "7p.jpg", "7s.jpg", "8c.jpg", "8f.jpg", "8p.jpg", "8s.jpg", "9c.jpg", "9f.jpg", "9p.jpg", "9s.jpg", "10c.jpg", "10f.jpg", "10p.jpg", "10s.jpg", "11c.jpg", "11f.jpg", "11p.jpg", "11s.jpg", "12c.jpg", "12f.jpg", "12p.jpg", "12s.jpg", "13c.jpg", "13f.jpg", "13p.jpg", "13s.jpg", "14c.jpg", "14f.jpg", "14p.jpg", "14s.jpg", "15c.jpg", "15f.jpg", "15p.jpg", "15s.jpg", "i1.jpg", "i2.jpg", "q1.jpg", "q2.jpg", "e1.jpg", "e1.jpg", "b1.jpg", "b2.jpg", "d1.jpg", "d2.jpg", "c1.jpg", "c2.jpg", "a1.jpg", "a2.jpg", "s1.jpg", "s2.jpg")

document.getElementById("inter").src = field
document.getElementById("inter1").src = field
document.getElementById("inter2").src = field
document.getElementById("inter").alt = "Ваше интерферирующее поле"
document.getElementById("inter1").alt = "Интерферирующее поле соперника"
document.getElementById("inter2").alt = "Интерферирующее поле соперника"
document.getElementById("cart0").src = blank
document.getElementById("cart1").src = blank
document.getElementById("cart2").src = blank
document.getElementById("cart3").src = blank
document.getElementById("cart4").src = blank
document.getElementById("cpuc0").src = wallp
document.getElementById("cpuc1").src = wallp
document.getElementById("cpuc2").src = blank
document.getElementById("cpuc3").src = blank
document.getElementById("cpuc4").src = blank
document.getElementById("kpuc0").src = wallp
document.getElementById("kpuc1").src = wallp
document.getElementById("kpuc2").src = blank
document.getElementById("kpuc3").src = blank
document.getElementById("kpuc4").src = blank	
document.getElementById("cart0").alt = ""
document.getElementById("cart1").alt = ""
document.getElementById("cart2").alt = ""
document.getElementById("cart3").alt = ""
document.getElementById("cart4").alt = ""
document.getElementById("cpuc0").alt = ""
document.getElementById("cpuc1").alt = ""
document.getElementById("cpuc2").alt = ""
document.getElementById("cpuc3").alt = ""
document.getElementById("cpuc4").alt = ""
document.getElementById("kpuc0").alt = ""
document.getElementById("kpuc1").alt = ""
document.getElementById("kpuc2").alt = ""
document.getElementById("kpuc3").alt = ""
document.getElementById("kpuc4").alt = ""
}

function popUp(link) { var newWindow = open(link, "secondWindow", "width=205 height=175") }

function muschan() {
if (muzon == 0)
{
if (document.getElementById("m1").checked == true) { document.getElementById("sound1").src = "files/cantina.mp3" }
muzon = 1
} //big if end
else { void(0) }
}

function convert(v) {
if (v == "1c.jpg" || v == "1f.jpg" || v == "1p.jpg" || v == "1s.jpg") { v = 1 }
else 
if (v == "2c.jpg" || v == "2f.jpg" || v == "2p.jpg" || v == "2s.jpg") { v = 2 }
else 
if (v == "3c.jpg" || v == "3f.jpg" || v == "3p.jpg" || v == "3s.jpg") { v = 3 }
else 
if (v == "4c.jpg" || v == "4f.jpg" || v == "4p.jpg" || v == "4s.jpg") { v = 4 }
else 
if (v == "5c.jpg" || v == "5f.jpg" || v == "5p.jpg" || v == "5s.jpg") { v = 5 }
else 
if (v == "6c.jpg" || v == "6f.jpg" || v == "6p.jpg" || v == "6s.jpg") { v = 6 }
else 
if (v == "7c.jpg" || v == "7f.jpg" || v == "7p.jpg" || v == "7s.jpg") { v = 7 }
else 
if (v == "8c.jpg" || v == "8f.jpg" || v == "8p.jpg" || v == "8s.jpg") { v = 8 }
else 
if (v == "9c.jpg" || v == "9f.jpg" || v == "9p.jpg" || v == "9s.jpg") { v = 9 }
else 
if (v == "10c.jpg" || v == "10f.jpg" || v == "10p.jpg" || v == "10s.jpg") { v = 10 }
else 
if (v == "11c.jpg" || v == "11f.jpg" || v == "11p.jpg" || v == "11s.jpg") { v = 11 }
else 
if (v == "12c.jpg" || v == "12f.jpg" || v == "12p.jpg" || v == "12s.jpg") { v = 12 }
else 
if (v == "13c.jpg" || v == "13f.jpg" || v == "13p.jpg" || v == "13s.jpg") { v = 13 }
else 
if (v == "14c.jpg" || v == "14f.jpg" || v == "14p.jpg" || v == "14s.jpg") { v = 14 }
else 
if (v == "15c.jpg" || v == "15f.jpg" || v == "15p.jpg" || v == "15s.jpg") { v = 15 }
else 
if (v == "i1.jpg" || v == "i2.jpg") { v = 0 }
else
if (v == "q1.jpg") { v = 2 }
else
if (v == "q2.jpg") { v = -2 }
else
if (v == "e1.jpg") { v = 6 }
else
if (v == "e2.jpg") { v = -6 }
else
if (v == "b1.jpg") { v = 8 }
else
if (v == "b2.jpg") { v = -8 }
else
if (v == "d1.jpg") { v = 11 }
else
if (v == "d2.jpg") { v = -11 }
else
if (v == "c1.jpg") { v = 13 }
else
if (v == "c2.jpg") { v = -13 }
else
if (v == "a1.jpg") { v = 15 }
else
if (v == "a2.jpg") { v = -15 }
else
if (v == "s1.jpg") { v = 17 }
else
if (v == "s2.jpg") { v = -17 }
return v;
}

function compile(h) {
if (h == "1c.jpg") { h = "Единица монет" }
else
if (h == "1f.jpg") { h = "Единица фляг" }
else
if (h == "1p.jpg") { h = "Единица шестов" }
else
if (h == "1s.jpg") { h = "Единица мечей" }
else
if (h == "2c.jpg") { h = "Двойка монет" }
else
if (h == "2f.jpg") { h = "Двойка фляг" }
else
if (h == "2p.jpg") { h = "Двойка шестов" }
else
if (h == "2s.jpg") { h = "Двойка мечей" }
else
if (h == "3c.jpg") { h = "Тройка монет" }
else
if (h == "3f.jpg") { h = "Тройка фляг" }
else
if (h == "3p.jpg") { h = "Тройка шестов" }
else
if (h == "3s.jpg") { h = "Тройка мечей" }
else
if (h == "4c.jpg") { h = "Четвёрка монет" }
else
if (h == "4f.jpg") { h = "Четвёрка фляг" }
else
if (h == "4p.jpg") { h = "Четвёрка шестов" }
else
if (h == "4s.jpg") { h = "Четвёрка мечей" }
else
if (h == "5c.jpg") { h = "Пятёрка монет" }
else
if (h == "5f.jpg") { h = "Пятёрка фляг" }
else
if (h == "5p.jpg") { h = "Пятёрка шестов" }
else
if (h == "5s.jpg") { h = "Пятёрка мечей" }
else
if (h == "6c.jpg") { h = "Шестёрка монет" }
else
if (h == "6f.jpg") { h = "Шестёрка фляг" }
else
if (h == "6p.jpg") { h = "Шестёрка шестов" }
else
if (h == "6s.jpg") { h = "Шестёрка мечей" }
else
if (h == "7c.jpg") { h = "Семёрка монет" }
else
if (h == "7f.jpg") { h = "Семёрка фляг" }
else
if (h == "7p.jpg") { h = "Семёрка шестов" }
else
if (h == "7s.jpg") { h = "Семёрка мечей" }
else
if (h == "8c.jpg") { h = "Восьмёрка монет" }
else
if (h == "8f.jpg") { h = "Восьмёрка фляг" }
else
if (h == "8p.jpg") { h = "Восьмёрка шестов" }
else
if (h == "8s.jpg") { h = "Восьмёрка мечей" }
else
if (h == "9c.jpg") { h = "Девятка монет" }
else
if (h == "9f.jpg") { h = "Девятка фляг" }
else
if (h == "9p.jpg") { h = "Девятка шестов" }
else
if (h == "9s.jpg") { h = "Девятка мечей" }
else
if (h == "10c.jpg") { h = "Десятка монет" }
else
if (h == "10f.jpg") { h = "Десятка фляг" }
else
if (h == "10p.jpg") { h = "Десятка шестов" }
else
if (h == "10s.jpg") { h = "Десятка мечей" }
else
if (h == "11c.jpg") { h = "Одиннадцать монет" }
else
if (h == "11f.jpg") { h = "Одиннадцать фляг" }
else
if (h == "11p.jpg") { h = "Одиннадцать шестов" }
else
if (h == "11s.jpg") { h = "Одиннадцать мечей" }
else
if (h == "12c.jpg") { h = "Командующий монет" }
else
if (h == "12f.jpg") { h = "Командующий фляг" }
else
if (h == "12p.jpg") { h = "Командующий шестов" }
else
if (h == "12s.jpg") { h = "Командующий мечей" }
else
if (h == "13c.jpg") { h = "Госпожа монет" }
else
if (h == "13f.jpg") { h = "Госпожа фляг" }
else
if (h == "13p.jpg") { h = "Госпожа шестов" }
else
if (h == "13s.jpg") { h = "Госпожа мечей" }
else
if (h == "14c.jpg") { h = "Повелитель монет" }
else
if (h == "14f.jpg") { h = "Повелитель фляг" }
else
if (h == "14p.jpg") { h = "Повелитель шестов" }
else
if (h == "14s.jpg") { h = "Повелитель мечей" }
else
if (h == "15c.jpg") { h = "Туз монет" }
else
if (h == "15f.jpg") { h = "Туз фляг" }
else
if (h == "15p.jpg") { h = "Туз шестов" }
else
if (h == "15s.jpg") { h = "Туз мечей" }
else
if (h == "i1.jpg") { h = "Идиот" }
else
if (h == "i2.jpg") { h = "Идиот" }
else
if (h == "q1.jpg") { h = "Королева Воздуха и Тьмы (+)" }
else
if (h == "q2.jpg") { h = "Королева Воздуха и Тьмы (-)" }
else
if (h == "e1.jpg") { h = "Выносливость (+)" }
else
if (h == "e2.jpg") { h = "Выносливость (-)" }
else
if (h == "b1.jpg") { h = "Равновесие (+)" }
else
if (h == "b2.jpg") { h = "Равновесие (-)" }
else
if (h == "d1.jpg") { h = "Кончина (+)" }
else
if (h == "d2.jpg") { h = "Кончина (-)" }
else
if (h == "c1.jpg") { h = "Сдержанность (+)" }
else
if (h == "c2.jpg") { h = "Сдержанность (-)" }
else
if (h == "a1.jpg") { h = "Злоба (+)" }
else
if (h == "a2.jpg") { h = "Злоба (-)" }
else
if (h == "s1.jpg") { h = "Звезда (+)" }
else
if (h == "s2.jpg") { h = "Звезда (-)" }
else { h = "Ошибка!" }
return h;
}

function generate() {
var g1, g2, f1, f2, q1, q2, genlog;
g1 = generaze(g1)
g2 = randomize(g2)
f1 = convert(g1)
f2 = convert(g2)
q1 = compile(g1)
q2 = compile(g2)
if (g1 == g2) {
genlog = "- Генератор случайных чисел молчит..."
updatelog(genlog)
document.getElementById("gen1").value = "-----------------------------------------"
document.getElementById("gen2").value = "-----------------------------------------"
}
else {
updatelog("- Генератор случайных чисел изменил значение карты \"" + q1 + "\" на значение карты \"" + q2 + "\"")
document.getElementById("gen1").value = q1
document.getElementById("gen2").value = q2
//for human
if (clocs[0] == g1) 
{
	document.getElementById("cart0").src = "cards/" + g2
	document.getElementById("cart0").alt = q2
	cards[0] = f2; clocs[0] = g2
}
else
if (clocs[1] == g1) 
{
	document.getElementById("cart1").src = "cards/" + g2
	document.getElementById("cart1").alt = q2
	cards[1] = f2; clocs[1] = g2
}
else
if (clocs[2] == g1) 
{
	document.getElementById("cart2").src = "cards/" + g2
	document.getElementById("cart2").alt = q2
	cards[2] = f2; clocs[2] = g2
}
else
if (clocs[3] == g1) 
{
	document.getElementById("cart3").src = "cards/" + g2
	document.getElementById("cart3").alt = q2
	cards[3] = f2; clocs[3] = g2
}
else
if (clocs[4] == g1) 
{
	document.getElementById("cart4").src = "cards/" + g2
	document.getElementById("cart4").alt = q2
	cards[4] = f2; clocs[4] = g2
}
//for cpu1
if (clocs1[0] == g1) 
{
	document.getElementById("cpuc0").src = "cards/" + g2
	document.getElementById("cpuc0").alt = q2
	cards1[0] = f2; clocs1[0] = g2
}
else
if (clocs1[1] == g1) 
{
	document.getElementById("cpuc1").src = "cards/" + g2
	document.getElementById("cpuc1").alt = q2
	cards1[1] = f2; clocs1[1] = g2
}
else
if (clocs1[2] == g1) 
{
	document.getElementById("cpuc2").src = "cards/" + g2
	document.getElementById("cpuc2").alt = q2
	cards1[2] = f2; clocs1[2] = g2
}
else
if (clocs1[3] == g1) 
{
	document.getElementById("cpuc3").src = "cards/" + g2
	document.getElementById("cpuc3").alt = q2
	cards1[3] = f2; clocs1[3] = g2
}
else
if (clocs1[4] == g1) 
{
	document.getElementById("cpuc4").src = "cards/" + g2
	document.getElementById("cpuc4").alt = q2
	cards1[4] = f2; clocs1[4] = g2
}
//for cpu2
if (clocs2[0] == g1) 
{
	document.getElementById("kpuc0").src = "cards/" + g2
	document.getElementById("kpuc0").alt = q2
	cards2[0] = f2; clocs2[0] = g2
}
else
if (clocs2[1] == g1) 
{
	document.getElementById("kpuc1").src = "cards/" + g2
	document.getElementById("kpuc1").alt = q2
	cards2[1] = f2; clocs2[1] = g2
}
else
if (clocs2[2] == g1) 
{
	document.getElementById("kpuc2").src = "cards/" + g2
	document.getElementById("kpuc2").alt = q2
	cards2[2] = f2; clocs2[2] = g2
}
else
if (clocs2[3] == g1) 
{
	document.getElementById("kpuc3").src = "cards/" + g2
	document.getElementById("kpuc3").alt = q2
	cards2[3] = f2; clocs2[3] = g2
}
else
if (clocs2[4] == g1) 
{
	document.getElementById("kpuc4").src = "cards/" + g2
	document.getElementById("kpuc4").alt = q2
	cards2[4] = f2; clocs2[4] = g2
}
} // big else end
updatescr()
}

function interac(e, sorc, doom) {
if (doom == "cart2" && cards[2] == 20 || doom == "cart3" && cards[3] == 20 || doom == "cart4" && cards[4] == 20) { void(0); }
else
if (inter == 20) {
inter = cards[e]
if (cards[e] == inter) { cards[e] = 0 }
var zet = compile(clocs[e])
document.getElementById("inter").src = "cards/" + clocs[e]
document.getElementById("inter").alt = zet + " в интерферирующем поле"
document.getElementById("cart" + e).alt = zet + " в интерферирующем поле"
document.getElementById(doom).src = field
barka = clocs[e]
clocs[e] = "jpg"
b = e
burka = doom
}
else { alert("Интерферирующее поле заполнено!") }
return inter;
}

function alterac(surc) {
if (inter != 20) {
if (cards[b] == 0) { cards[b] = inter }
inter = 20;
var fet = compile(barka)
clocs[b] = barka
barka = "jpg" 		
document.getElementById("inter").src = field
document.getElementById("inter").alt = "Ваше интерферирующее поле"
document.getElementById("cart" + b).alt = fet
document.getElementById(burka).src = surc
}
else { alert("Кликните на любой вашей карте,\nчтобы поместить ее в интерферирующее поле") }
return inter;
}


function interai1() {
if (inter1 != 20) { void(0) }
else {
var aj, ij
for (aj = 0; aj <= 9; aj++) {
	for (ij = 0; ij <= 4; ij++) {
		if (clocs1[ij] == favcart1[aj] && lozhka1 != 1) {
			inter1 = cards1[ij]
			if (cards1[ij] == inter1) { cards1[ij] = 0 }
			var zet1 = compile(clocs1[ij])
			document.getElementById("inter1").src = "cards/" + clocs1[ij]
			clocs1[ij] = "field.gif"
			document.getElementById("inter1").alt = zet1 + " в интерферирующем поле соперника"
			document.getElementById("cpuc" + ij).alt = zet1 + " в интерферирующем поле соперника"
			document.getElementById("cpuc" + ij).src = field
			lozhka1 = 1
		}//if endetz
	}//infor end
}//for end
}//else end
}

function interai2() {
if (inter2 != 20) { void(0) }
else {
var aj1, ij1
for (aj1 = 0; aj1 <= 9; aj1++) {
	for (ij1 = 0; ij1 <= 4; ij1++) {
		if (clocs2[ij1] == favcart2[aj1] && lozhka2 != 1) {
			inter2 = cards2[ij1]
			if (cards2[ij1] == inter2) { cards2[ij1] = 0 }
			var zet2 = compile(clocs2[ij1])
			document.getElementById("inter2").src = "cards/" + clocs2[ij1]
			clocs2[ij1] = "field.gif"
			document.getElementById("inter2").alt = zet2 + " в интерферирующем поле соперника"
			document.getElementById("kpuc" + ij1).alt = zet2 + " в интерферирующем поле соперника"
			document.getElementById("kpuc" + ij1).src = field
			lozhka2 = 1
		}//if endetz
	}//infor end
}//for end
}//else end
}