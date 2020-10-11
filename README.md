## Cellular Automata

https://a4-patrick-houlihan.glitch.me/

Welcome to John Conway's Game of Life! AND MORE

The goal of this application is to allow users to view John Conway's famous game of life in a browser.
The benefits of this version include a stepper, which will allow a user to play only one step of the automation, 
a slider to control speed of animation, drawing functionality to make generating states easy, and most importantly, the ability to make arbitrary rules based on the generic game of life cell criteria. 

Using a form, users may add rules they would like to apply to the gameboard on the fly, even during animation. Users may also draw on the board during animation, creating a dazzling display of random rgb colors.

Challenges I faced during implementation of this project was mainly in ensuring the program would be optimized. With any sort of animation or visual display, attention must be paid to trimming bloat where necessary to ensure high frame rates. To fix this, I chose to tradeoff a slow initialization for quick animation frame generation later down the line by having every Cell object include its own neighbors. Another challenge I faced was my attempts to make my project stand out. To fix this, I added the ability to generate custom rules on the fly that the program will apply to the grid.