# Minor Web of Things - I'm Thirsty
## Live version
- http://wot-drinks.herokuapp.com/
<!-- - http://wot-drinks.herokuapp.com/drinks -->
<!-- - http://wot-drinks.herokuapp.com/temp -->

## Concept
Serving drinks can be a pain. By using this web application, this no longer has to be the case. This app, will keep track of who and what everyone wants to drink.

![Header Roulette](repo-images/header-coffee.jpg)

### User description
This app is for everyone, that works in a large groups and has problems with keeping track of drink orders and hates to stay next to a coffee machine, to wait for the coffee to finish brewing.

## Scenarios
#### Scenario 1: I'm thirsty, but don't know what to drink.
If you are thirsty, you simply press the button on the top side your box. The box will send a request to the app and the app will do the rest. The app will get the best possible drink for the current time and temperature. If there are more people, that want to drink the same thing, they also press a button and they will be added to a list.

When everyone, that wants to, has chosen to join the drinking list, the app will randomly select a user, that has to get the drinks. Now you can see how many drinks it takes to serve everyone and can you decide, how much coffee you need to make.

<details>
    <br/><strong>How it works</strong><br/>
    - When a user wants to drink something, he or she presses a button, that sends a signal to a php server, that talks to a Express server. The Express server talks to a Weather API and it gets the current Temperature and Time.
    <br/><br/>

    - The Expres server looks at the Time and Temperature and choices, the best fitting drink for the current time and temperature. Then the server sends the drink type to a website, that keeps track of the drink type. <br/><br/>

    - The Express server sends a message to the php server and the php server changes the color of all the connected buttons, to a color that represends the selected drink type. If a different user also wants that drink she presses her button and she gets added to the list, with people that want to same drink.
    <br/><br/>

    - When you are finished with preparing the drinks, you can see who also wants that drink and serving the drinks will be easier.
</details>

#### Scenario 2: I want to know if the coffee is ready.
If you are thirsty and want to know if the coffee is ready, the user can go to the website and he/she can see the state of the coffee. By doing this, you know exactly when the coffee is ready and you only have to walk to the coffee machine, to get the coffee. This way, needlessly walk to the machine, to check if the coffee is ready, will be a thing of the past.

<details>
    <br/><strong>How it works</strong><br/>
    - Near the coffee machine is a box, with heat-sensor, that tracks if the coffee machine is setting coffee (every 15seconds). The box displays a color, that indicates if the coffee is ready or not (This collor corresponds with the temperature of the machine).
    <br/><br/>

    - When the temperature of the coffee machine is 35 °C or more, the box will send the temperature directly to the Express server. The Express server, will show a message on the website, that the coffee is ready.
</details>

## Flows
#### Data Flow
![Flow](repo-images/wot-flow2.png)

#### Code Flow
![Flow](repo-images/wot-flow4.png)

## Screens
![Flow](repo-images/wot-flow3.png)

## Features
- Make a list with all the people, that are online and want coffee.
- Select a random user, that needs to make coffee.
- Get the Weather of a external API
- Chose a special drink based on the date from the external Weather APi.
- Sensors to detect, when the drinks are ready (heat sensor).
- Box feedback, when receiving a message. (vibration and light signal).
- Turn messages off, when button is on it's side.

### Necessary
- [x] Node app Express server. (backend).
- [x] Webpage, to join the app  (frontend).
- [x] Boxes, that light up to show who is going to set the coffee (hardware).
- [x] Code for the boxes, to communicate with the server/webpage and other boxes.
- [x] Sensors to detect, when the drinks are ready (heat sensor).
- [x] Box feedback, when receiving a message. (vibration and light signal).
- [x] Frendly ui/ ux

## Wishlist
- [ ] Add a estimated time, when the coffee is ready. (Example: 2:31 minutes remaining).
- [ ] Replace the head sensor with a smart socket, to track the electricity usage, to track if the coffee is ready.
- [ ] Make a list with how often someone wanted to drink coffee.
- [ ] Make a ranking, that shows how often someone had to make coffee.
- [ ] Make it, so that the random user selection depends how often someone has already made coffee.

## Sources
- http://www.seeedstudio.com/forum/viewtopic.php?f=17&t=5636
