# Readme

## Project Title: Firework Simulator

The project is hosted at https://a4-lfleming-314.glitch.me/.

## Goal

This application is a visual experience which allows users to launch and customize virtual fireworks. Users can control the shape, size, and colors of the fireworks. The virtual environment simulates the effects of wind and gravity on these particles.

The project uses the Canvas API to draw the fireworks.

## Challenges

Some of the biggest challenges on making this application were drawing teardrop shapes and making the different explosions.

The teardrop shapes were tricky partly because I did not have much experience with raster drawing, and so it took some work to figure out what kind of arcs and lines were needed to draw that shape, and how to adjust it for different sizes and lengths. The other part was that I needed the orientation of the teardrops to match the current direction of the particle, so I had to make trigonometric functions that worked properly for all the possible angles of velocity and translate that into the raster drawings.

For the explosions, I looked into various types of firework shapes that are used in the real world and tried to break them down into their base components. I built each firework shape as an object class, with its own draw() and explode() method. More complicated fireworks launch simpler fireworks as part of their explosions. It took a lot of experimenting with timing and angles to make the different explosion shapes look right.

## Instructions

Fireworks are created by clicking within the black canvas on the webpage. Parameters for the fireworks and the environment can be adjusted via the form underneath the canvas. Instructions, with more detailed descriptions of the parameters, are displayed when the page first loads or by clicking the "Help" button in the top right corner of the page.