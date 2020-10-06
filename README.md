# Assignment 4 - Creative Coding: Interactive Multimedia Experiences

## Serpent Strategy
by Nicole Conill

https://a4-nconill13.glitch.me/

Serpent Strategy is a recreation of the classic grid snake game, in which a user must direct a snake in order to consume fruit and thus grow in length. The game ends when the serpent hits any of the four walls, or collides
  with itself. In this version, the user may control the serpent with the four arrow keys. For each fruit consumed, the user's score will go up by one. There are also three versions of difficulty in this game, as found
  through buttons underneath the score. Easy provides a slower serpent speed compared to normal, while hard provides a faster serpent speed.
  
For this project's requirements:
- I created a server using Express JS (in order to implement game levels).
- For the client-side interactive experience, I utilized Canvas, and more specifically, the p5.js library.
- The six parameters for user control include the four directional keys to control the serpent, as well as the three buttons to control the game's difficulty.
- Basic documentation is always shown. Based on the manner of the ps.j5 script, I cannot have an additional script that always allows the user to press a help button.
- The link provided validates.

Challenges faced included learning the way in which the p5.js library automatically calls to draw a Canvas, and therefore having to recreate new scripts per difficulty, rather than just resetting the original script.js.