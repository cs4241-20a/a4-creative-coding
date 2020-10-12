
## Application Name: Paddle Ball

Hosting Link: https://a4-haley-hauptfeld.glitch.me

Include a very brief summary of your project here. Images are encouraged when needed, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- the instructions you present in the website should be clear enough to use the application, but if you feel any need to provide additional instructions please do so here.

Application Goal
---

My application is a game called Paddle Ball. Once, users hit 'Start Game', the ball on the screen constantly moves and users have to destroy the blocks on the screen by making the ball collide with the blocks at the top of the game. The user controls the paddle at the bottom of the screen which is used as a surface for the ball to bounce off of. The game ends when the ball hits the bottom of the screen or the user destroys all of the blocks. I used the web technology framework, Canvas, to build out the game, including the blocks, the ball, and the paddle. I used this tutorial to begin creating the game (https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript), and made my own modifications to that tutorial to meet the requirements of the project. The tutorial covered the basics of the game and designed it in a way where the <canvas> element was the center of the design. The game controls that I added to the web application (that are listed in the web app at the bottom of the screen) are personal adjustments that I have made to the game. I made 6 game controls to fulfill the requirement of having six parameters for user control. I have a simple express server that doesn't necessarily process any information, but meets the requirement of having an Express server for this project. The server file is 'server.js'. The requirement of having documentation available to the user is found in the instructions ections of the web app. Users can toggle between opening and closing the instructions to fulfill the requirement of making the documentation clearly available but also dismissable. I know that my HTML and CSS are validated because I check for validation using https://validator.w3.org/. I've included a screenshot of that validation in 'assets' folders of my glitch project.

Challenges
---

A challenge that I faced was getting the ball to change color. I definitely had to make some tricky modificaiton regarding how I implemented my draw() function in my 'script.js' file, but I was eventually able to implement that. Another challange I faced was changed the background theme of the game. I used a linear gradient to change the colors of what the background looks like, but the tricky part of doing that includes implementing the <canvas> element properly.

Instructions
---
All of the instructions are clearly stated in the web application. There are no additional instructions needed.
