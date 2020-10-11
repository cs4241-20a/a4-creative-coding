## Simple 3D Snake Game

[Assignment 4](https://a4-yongchengliu.glitch.me/)

### The goal of the application
I was very intrested in three.js so I created this snake game (which is kinda the practice game I used for every interactive related dev tools haha)  
Originally I wanted to achieve following goals:  
1. snake functionalities (cherry, body grow, game start, game over)
2. random colors
3. 3D
4. The snake need to pick cherry in accordance with head color    

But due to the limit of time, I am not able to finish stuff like 4.

### Challenges I faced during the implementation
There were lots of challenges, mainly from my lack of experience with three.js  
However, since three.js incorporated many features of GL language, and I had some graphics experience before, I used my previous expereinces to conqured them.  
Also, I met many issues with dat.gui, so I had to give up some of my original ideas. (for example, I wanted to update direction by the list of dat.gui, but somehow its not working)  

Ohhh.. actually. There is one thing thats really worthy to mention. I used syntax like [let previousPos = thisCube.position], and this caused lots of bugs, because essentially this expression is casting the reference over but not a new copy in the memory, so the value will be updated while I didnt mean to (I wanted to have some temp values).  

### How to play the game  
I have included an intro at the beginning of the game, and the game is pretty straightforward.