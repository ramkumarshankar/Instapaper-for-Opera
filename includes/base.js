/*

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

*/

// function to capture selected text
function mouseUpHandler(event) {
    var selection = window.getSelection();
    var selectedText = selection.toString();
 
    if (selectedText !== '') {
		opera.extension.postMessage(selectedText);
    }
}

document.onmouseup = mouseUpHandler;
