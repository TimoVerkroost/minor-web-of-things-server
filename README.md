# Minor Web of Things

<!-- ## Live version
- https://rtw-myapp.herokuapp.com -->

### Concept
Serving drinks can be a pain. By using this web application, this no longer has to be the case. You simply have to connect to the app and when you want to drink something, you press a button.

If there are more people, that want to drink the same thing, they also press a button and they will be added to a list. After that, you will have a list with howmany people want to drink the same thing as you. Now you can see how many drinks it takes to serve everyone.

## I'm thirsty
![Header Roulette](repo-images/header-coffee.jpg)

## How it works
When a user wants to drink something, he or she presses a button, that sends a signal to a php server, that talks to a Express server. The Express server talks to a Weather API and it gets the current Geo, Location, Temperature and Time.

The Expres server looks at the Time and Temperature and choices, the best fitting drink for the current time and temperature. Then the server sends the drink type to a website, that keeps track of the drink type and the amount of people, that want that drink.

The Express server sends a message to the php server and the php server changes the color of all the connected buttons, to a color that represends the selected drink type. If a different user also wants that drink she presses her button and she gets added to the list and her button changes to green.

When you are finished with preparing the drinks, you can see who also wants that drink and serving the drinks will be easier.

## Flow
![Flow](repo-images/wot-flow2.png)

<!-- ## Features -->

### Necessary
- [ ] Node app Express server. (backend)
- [ ] Webpage, to join the roulette  (frontend)
- [ ] Boxes, that light up to show who is going to set the coffee (hardware)

## Wishlist
<!-- - [ ]
- [ ]
- [x]  -->
## Sources
<!-- -
-  -->
