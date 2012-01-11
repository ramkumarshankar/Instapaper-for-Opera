/***************************************************************************
   Copyright 2011 Ramkumar Shankar
   
   This file is part of Instapaper for Opera.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
***************************************************************************/

window.addEventListener("load", function() {
	// button properties
	var UIItemProperties = {
		disabled: false, // The button is disabled until tab is focused.
		title: "Read later with Instapaper",
		icon: "icons/instapaper-icon-18.png",
		popup: {
            	href: "about:blank",
			width: 1,
			height: 1
         }
	};

	// Create and add button
	var button = opera.contexts.toolbar.createItem(UIItemProperties);
	opera.contexts.toolbar.addItem(button);
	
	// Event listener for action on button click
	button.addEventListener("click", postToInstapaper, false);
	
	//Keep the description ready if some text is selected
	var selection;
	opera.extension.onmessage = function(event) {
  		selection = encodeURIComponent(event.data);
	}
	if (!selection) {
		selection = '';
	}
	
	// Post to Instapaper upon click
	
	function postToInstapaper() {
     	// show saving message in popup
     	button.popup.width = 70;
     	button.popup.height = 50;
     	button.popup.href = "saving.html";
     	     	
     	// Check whether extension has been configured
     	var username = encodeURIComponent(widget.preferences.username);
         	var password = encodeURIComponent(widget.preferences.password);
         	var check = configCheck(username);
         	if (!check) {
           	return;
          }
          
     	// Get page url
     	var targetUrl = encodeURIComponent(opera.extension.tabs.getFocused().url);
     	
     	// Add page title to the request to cater to other languages (thanks to luke)
     	var title = encodeURIComponent(opera.extension.tabs.getFocused().title);
     	
     	// Define request URL
		var addUrl = 'https://www.instapaper.com/api/add?';
		
		// Form request URL
         if (password) {
            var request = 'username=' + username + '&password=' + password + '&url=' + targetUrl + '&title=' + title + '&selection=' + selection;
         }
         else {
            var request = 'username=' + username + '&url=' + targetUrl + '&title=' + title + '&selection=' + selection;
         }
         
         var httpRequest = new XMLHttpRequest();
         httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState == 4) {
				if (httpRequest.status == 201) {
          			userFeedback(0);
                	}
				else if (httpRequest.status == 400) {
					userFeedback(1);
                   }
               	else if (httpRequest.status == 403) {
                   	userFeedback(2);
                   }
				else if (httpRequest.status = 500) {
					userFeedback(3);
				}
                	else {
                   	//userFeedback(-1);
                   }
			}
		}
		httpRequest.open("POST", addUrl + request, true);
		httpRequest.send();
	}
	
	// at least the username is required
	function configCheck(username) {
         	if (!username) {
           	button.popup.width = 300;
           	button.popup.height = 50;
      		button.popup.href = "config.html";
      		return false;
      	}
      	return true;
	}
    
	function enableButton() {
		var tab = opera.extension.tabs.getFocused();
		if (tab) {
			button.disabled = false;
		}
		else {
			button.disabled = true;
		}
	}

     // feedback depending on reply from Instapaper
	function userFeedback(code) {
		switch(code) {
			case 0:
				//success
				button.popup.width = 70;
     			button.popup.height = 50;
				button.popup.href = "success.html";
				break;
			case 1:
				//missing parameter
				button.popup.width = 300;
     			button.popup.height = 50;
      			button.popup.href = "missing.html";
      			break;
      		case 2:
				//invalid username or password
				button.popup.width = 300;
     			button.popup.height = 50;
				button.popup.href = "config.html";
				break;
			case 3:
				//service error, try later
				button.popup.width = 300;
     			button.popup.height = 50;
      			button.popup.href = "tryagain.html";
      			break;
			default:
				//nothing for now
		}
	}
	
	//Enable the button when a tab is ready.
	opera.extension.onconnect = enableButton;
	opera.extension.tabs.onfocus = enableButton;
	opera.extension.tabs.onblur = enableButton;

}, false);