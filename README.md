
# Commands runner User interface
This project is a user interface for the [commands-runner](https://github.com/IBM/commands-runner) project.

# Build

`make npm-build`

## Launch with server.js (not development mode)

`npm run server`
you can add 2 parameters key and cert to run https
`npm run server <your_key> <your_cert>`

## Access


1. Open your browser on `http://localhost:30100` or ``https://localhost:30102`
2.  Press on the `settings` menu located on top right screen and enter:
3.  as `Commands runner API end-point` `http://<IP>:<port>` where the IP is the IP address and port on which the commands-runner run. If you use `https` as by default the certificate is self-signed you have to open another tab in your browser and browse to `https://<IP>:<ssl_port>` and accept the certificate. By default the http port is 3101 and https 30103.
4.  as `Token` the token used when launching the commands-runner server.
5.  Click `Submit` and you will be redirected to the `Extensions` page.
6.  On the left upper corner, you have a menu, open it and select `Extensions`. From there you can add and remove extensions to/from the environment.
7.  Then navigate to the `states` menu item. From there you can insert/remove extensions, edit a state, reset statuses.
8.  Then go on `Upload CF configuration file`, this will allow you to push and view a new configuration for the main process and extensions and also launch the deployment.
9.  Once the configurationm is uploaded, the user interface will validate it then if no error are found, you can launch the deployment by pressing the `Start deployment` button and the `States` page will open showing the deployment progress.
10. From the `States` table and for each `RUNNING/SUCCEEDED/FAILED` state, you can check the deployment log file by pressing the document icon. 

11. Ask 


# Custom

1) Add your github.com/IBM/commands-runner-ui/src/graphics/MyCompany_Logo.svg