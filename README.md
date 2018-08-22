### Volvo Trucks France React Application

:warning: This application is currently in development :warning:

This app is designed to be used in Volvo environnements.

#Requirements :
* NodeJS
* Git 
* Set up an environnement variable called ```VOLVO_HTTP_PROXY``` with the volvo proxy.

In order to use npm and git in Volvo, you need to setup a global proxy for both.

For example: ```git config set --global http.proxy http://mon.proxy.volvo:port```


To install and use this application : 
* Clone the repository 
* Open a terminal in the selected folder 
* Run ```npm install``` to install all dependencies (also work with yarn)
* Run ```npm start``` to start the react application (front-end) 
* Go to the ```/server``` and run ```node server.js``` to start the express server (back-end). 






