# Giphy App (GIFSuki!)

### This project was created by using Angular CLI 16.0.2

## Author
[Bryan Antones Fernandez](https://github.com/yanxel18)
![alt text](src/assets/maindisplay.gif)
<img src="src/assets/searchandshowmore.gif" width="600" height="400">
<img src="src/assets/sortnewandold.gif" width="600" height="400">
<img src="src/assets/dragandsort.gif" width="600" height="400">
<img src="src/assets/addgifandremovefromsearch.gif" width="600" height="500">
<img src="src/assets/removegiffromdialogandsearch.gif" width="600" height="500">
<img src="src/assets/downloadgif.gif" width="600" height="600">
## Description
This web app created using Giphy API that pulls trending GIFS, and trending
words and query on search API. The user can search for GIFS, store GIFs and manage GIFs collection.
## Giphy App Features
* Search for GIFs by keywords and displays the GIF images by grid.
* Storing the selected GIFs to users collections and display dynamically without page refresh or reload.
* GIF data are stored in local storage using JSON String.
* Search from users collections by keywords based on the GIF name and searched keyword.
* Store or remove GIFs from search or in users collection or vice versa.
* The GIFs that has been stored to collections are removed from the next search result. 
* The removed GIFS from the collections will return to the search results.
* View GIFs in dialog box has button to store or remove GIF from collections.
* Download selected GIFs from users collection by opening the dialog box.
* Drag and Drop sorting or sort by newest to oldest by stored date or vice versa.
* The apps last state will be automatically restored after browser refreshes including the typed text in the textbox, displays the last search GIFs results on both collections and search area , scroll to the last scrollbar position , and maintain GIFs arrangement.
## Requirements
* Download the latest version of [NodeJS](https://nodejs.org/en/download/)
* Install the latest [Angular CLI](https://angular.io/cli) 
## Installation and Set-up
* Step 1: Clone the repository https://github.com/yanxel18/giphy-app.git or download by zip
* Step 2: If downloaded by zip, extract the zip file to the preferred location.
* Step 3: Open the terminal and locate the cloned repository or extracted folder location.
* Step 4: Download the project dependencies by using **`npm install`**
* Step 5: Run **`npm start`** on the terminal and browse the the url **http://localhost:4200/**

## Technologies Used
* Angular CLI Version 16.0.2
* Material UI
* SASS
* Typescript/Rxjs

## License
#### [*MIT License*](LICENSE)
