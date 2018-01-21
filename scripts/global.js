///////////////////////////////////////////
// 
//             Tool Function
// 
///////////////////////////////////////////
function addLoadEvent(new_fun){
	console.log("addLoadEvent");
	var oldload = window.onload;
	if(typeof window.onload != 'function')
		window.onload = new_fun;
	else{
		window.onload = function(){
			oldload();
			new_fun();
		}
	}
}

function insertAfter(new_node, target_node) {
	var parent = target_node.parentNode;
	if(parent.lastChild == target_node)
		target_node.appendChild(new_node);
	else {
		parent.insertBefore(new_node,target_node.nextSibling);
	}
}


///////////////////////////////////////////
// 
//      high light current page's link
// 
///////////////////////////////////////////
function highlightPage(href) {
// make true exist
	if(!document.getElementsByTagName)	return false;
	if(!document.getElementById)	return false;
// get header <a>
	var headers = document.getElementsByTagName('header');
	if(headers.length == 0) return false;

	var navs = headers[0].getElementsByTagName('nav');
	if(navs.length == 0)	return false;

	var links = navs[0].getElementsByTagName('a');
	var linkurl;
	for(var i = 0; i < links.length; i++) {
		linkurl = links[i].getAttribute('href');
		if(window.location.href.indexOf(linkurl) != -1)
		{
			links[i].className = "here";
			var linktext = links[i].lastChild.nodeValue.toLowerCase();
			document.body.setAttribute("id",linktext);
		}
	}
}


///////////////////////////////////////////
// 
//    Prepare <nav> and <section> connect
// 
///////////////////////////////////////////
function showSection (id) {
	var sections = document.getElementsByTagName('section');
	for(var i = 0; i < sections.length; i++) {
		if(sections[i].getAttribute('id') != id) {
			sections[i].style.display = "none";
		}
		else {
			sections[i].style.display = "block";
		}
	}
}
function prepareInternalnav() {
// make sure
	if(!document.getElementById) return false;
	if(!document.getElementsByTagName) return false;

// get <article>
	var articles = document.getElementsByTagName('article');
	if(articles.length == 0)	return false;
// get <article> <nav>
	var navs = articles[0].getElementsByTagName('nav');
	if(navs.length == 0)	return false;
// get <article> <nav> <a>
	var nav = navs[0];
	var links = nav.getElementsByTagName('a');
// add event
	for(var i = 0; i < links.length; i++) {
	// get section id
		var sectionId = links[i].getAttribute("href").split("#")[1];
		if(!document.getElementById(sectionId))	continue;
		else {
			if(i != 0) {
				document.getElementById(sectionId).style.display = "none";
			}
			links[i].destination = sectionId;
			links[i].onclick = function() {
				showSection(this.destination);
				return false;
			}
		}
	}
}

///////////////////////////////////////////
// 
//          Prepare Photos show 
// 
///////////////////////////////////////////

function preparePhotosNeed() {
// make sure
	if(!document.getElementById) return false;
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById('imagegallery')) return false;
// Create img
	var view = document.createElement("img");
	view.style.width = "90%";
	view.style.height = "30%";
	view.setAttribute("src","images/1.jpg");
	view.setAttribute("title","Show Photo");
	view.setAttribute("id","view");
// create Description
	var txt_node = document.createElement("p");
	txt_node.setAttribute("id","description");
	var txt = document.createTextNode("Description");
	txt_node.appendChild(txt);
// find id hook
	var imagegallery = document.getElementById('imagegallery');
	insertAfter(view,imagegallery);
	insertAfter(txt_node,imagegallery);

	var links = imagegallery.getElementsByTagName('a');

	for(var i = 0; i < links.length; i++) {
		links[i].onclick = function(){
			txt_node.firstChild.nodeValue = this.getAttribute("title") ? this.getAttribute("title") : "nothing";
			view.setAttribute("src", this.getAttribute('href'));
			return false;
		}
 	}
}


function focusLabels() {
	if(!document.getElementById)	return false;

	var labels = document.getElementsByTagName('label');
	for(var i = 0; i < labels.length; i++) {
		if(!labels[i].getAttribute('for'))	continue;
		labels[i].onmouseover = function() {
			id = this.getAttribute('for');
			var elem = document.getElementById(id);
			elem.focus();
		}
		labels[i].onclick = labels[i].onmouseover;
	}
}

///////////////////////////////////////////
// 
//          Verify Form
// 
///////////////////////////////////////////
function isFilled(field) {
	if(field.value.replace(' ','').length == 0)	return false;
	var placeholder = field.placeholder || field.getAttribute('placeholder');
	return (field.value != placeholder);
}
function isEmail(field) {
	return (field.value.indexOf('@')!=-1 && field.value.indexOf('.')!=-1);
}
function validateForm(whichform) {
	for(var i = 1; i < whichform.elements.length-1; i++) {
		var element = whichform.elements[i];
		//console.log("Verify: "+element.type+" test = "+element.value.indexOf('@'));
		if(element.required == 'required') { 
			if(!isFilled(element)) {
				alert("Please fill in the "+element.name+" field.");
				return false;
			}
		}
		if(element.type == 'email') {

			if(!isEmail(element)) {
				alert("The "+element.name+" field must be a vaild email address.");
				return false;
			}
		}
	}
	return true;
}


///////////////////////////////////////////
// 
//          Ajax Submi Form
// 
///////////////////////////////////////////
function getHTTPObject(){
	if(typeof XMLHttpRequest == "undefined")
		XMLHttpRequest = function(){
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
				catch(e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
				catch(e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP"); }
				catch(e) {}
			return false;
		}
	return new XMLHttpRequest();
}
function displayAjaxLoading(element) {
	while(element.hasChildNodes()) {
		element.removeChild(element.lastChild);
	}
	var content = document.createElement("p");
	var txt = document.createTextNode("Waiting");
	content.appendChild(txt);
	element.appendChild(content);
}
function submitFormWithAjax(whichform, totarget) {
	var request = getHTTPObject();
	if(!request)	return false;
	displayAjaxLoading(totarget);

	var dataParts = [];
	var element;
	for(var i = 1; i < whichform.elements.length-1; i++) {
		element = whichform.elements[i];
		dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
		console.log(dataParts[i]);
	}
	var data = dataParts.join('&');
	request.open('POST', whichform.getAttribute('action'), true);
	//request.setRequestHeader("Content-type", "application/s-ww-form-urlencoded");
	request.onreadystatechange = function() {
		if(request.readyState == 4) {
			if(request.status==200 || request.status==0) {
				var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/)
				if (matches.length > 0) {
					totarget.innerHTML = matches[1];
				}
				else {
					totarget.innerHTML = '<p>Oops, there was an error. Sorry</p>';
				} 
			}
			else {
				totarget.innerHTML = '<p>' + request.statusText + '</p>'
			}
		}
	};
	request.send(data);
	return true;
}
function prepareForms() {
	for(var i = 0; i < document.forms.length; i++) {
		var thisform = document.forms[i];
		thisform.onsubmit = function() {
			if(!validateForm(this)) return false;
			var article = document.getElementsByTagName('article')[0];
			if(submitFormWithAjax(this, article)) return false;
			return true;
		}
	}
}

addLoadEvent(prepareForms);
addLoadEvent(highlightPage);
addLoadEvent(prepareInternalnav);
addLoadEvent(preparePhotosNeed);
addLoadEvent(focusLabels);