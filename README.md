Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

Due: October 11th, by 11:59 PM.

Noah Parker, nparker AT wpi DOT EDU

## Simple Golf Game

your hosting link: http://a4-noah-parker.glitch.me


The goal of the project was to create a very basic game using the Three JS library, with some simple physics.
The game has a simple lighting model as well, which uses the phong lighting built into Three JS.

The game allows the player to hit a ball around a court, aiming to hit a small red circle.   
The biggest challenge of this project was getting collisions to function properly, Three JS does not provide any sort of built-in collision support.   
That being said, the game's collision detection is written almost from scratch, some Three JS primitives are used to detect geometric overlap.    
