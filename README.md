# CGI Future Talent 2020 Ex.4 - BirdScout app

## Excercise created using React-Native and Expo CLI

# Pre-requisities (Skip to installation if Node.js, Git, Expo CLI, Expo-app are already installed!)

## Step 1 installing node.js
Go to https://nodejs.org/en/download/ and download the installer. Follow the installer insturctions to the end

## Step 2 installing Git for Windows
Go to https://gitforwindows.org/ and download the installer
Follow the installer instructions to the end

## Step 3 installing Expo CLI
Open PowerShell-terminal as administator and run following command:
<br/>` npm install -g expo-cli ` 

## Step 4 installing Expo-app for Android/Apple
Enter Google Play Store/AppStore on your mobile device and search for Expo (Publisher Expo Project). Download the app and your ready to go!

# Installation (requires Node.js, Git, Expo CLI, Expo CLI-app for Android and Apple)

## Step 1.
Clone the project to an empty folder through Git-Terminal ex. GitBash. Command for cloning `$ git clone https://github.com/MiikaB/cgi_bird_scout.git`

## Step 2.
Enter into the cloned folder and shift + rightclick => Open PowerShell-terminal

## Step 3.
Write the following command in to the terminal and wait for it to finish. ` npm install `

## Step 4.
Write command `$ expo start` It will start up the project and open browser with QR-code in the bottom left corner. Wait untill the terminal window in the browser says 'Tunnel Ready/Running'

## Step 5.
Open Expo-app on your mobile device and navigate to 'Projects View (Icon on the bottom left corner)' and press 'Scan QR Code'

Depening how you want to connect the running project with your phone app you can change the connection type above the QR Code in the browser. Easiest of them is to click option 'Tunnel' and scan the code with the Expo-App.

LAN is by default option as the browser opens, and it requires the mobile device and the computer to be in the same network!

## Step 6.
Scan the QR Code with your mobile device and it should start building the project on the mobile device. Once complete the app is up and running and ready to be tested!

## Final notes of installation
If the project somehow doesn't build up, or when 100% completion it shows a page with a lot of red errors please give me feed back asap via e-mail ` miika.mikael@hotmail.com `

The project has been tested only with several computers including a clean install (Pre-requisites installed first) and using only android mobile device.

# Project features
- Display for bird name, rarity, notes, timestamp, latitude, longitude and altitude
- Button for adding new observations
- Local database for saving data entry
- Long press deletion with alert

# Experience with the excercise
Project was fun to make as it gave you pretty much open hands to fulfill the requirements. The logic of the app was the most fun to work with as of getting coordinates and sending data to the local SQLite database.

Solution was created using modules and react hooks (no more states)
As the project wasn't multipage wise to create, the whole project is created in app.js
Some functions could have been moved to different file and to be imported into project but my thought is that it's better for you to review the code as it's only in once file

I am pleased with the result even though it might not be the pretties UI, but as you were only given a week to work on the project i would say i did very well.

My thougths on the project are, it works like a charm. The UI can be customized later as the logic of the project is my priority. What good is a good looking app that has broken functions and doesn't serve it's purpose?!

Hope you are as pleased with the result as i am!
