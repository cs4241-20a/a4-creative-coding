Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

Due: October 9th, by 11:59 PM.

For this assignment we will focus on client-side development using popular audio/graphics/visualization technologies; the server requirements are minimal. The goal of this assignment is to refine our JavaScript knowledge while exploring the multimedia capabilities of the browser.

Baseline Requirements
---

Your application is required to implement the following functionalities:

- A server created using Express. This server can be as simple as needed.
- A client-side interactive experience using at least one of the following web technologies frameworks.
  - [Three.js](https://threejs.org/): A library for 3D graphics / VR experiences
  - [D3.js](https://d3js.org): A library that is primarily used for interactive data visualizations
  - [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API): A 2D raster drawing API included in all modern browsers
  - [SVG](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API): A 2D vector drawing framework that enables shapes to be defined via XML.
  - [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API): An API for audio synthesis, analysis, processing, and file playback.
- A user interface for interaction with your project, which must expose at least six parameters for user control. [dat.gui](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) is highly recommended for this. You might also explore interaction by tracking mouse movement via the `window.onmousemove` event handler in tandem with the `event.clientX` and `event.clientY` properties. Consider using the [Pointer Events API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) to ensure that that mouse and touch events will both be supported in your app.
- Your application should display basic documentation for the user interface when the application first loads. This documentation should be dismissable, however, users should be able to redisplay it via either a help buton (this could, for example, be inside a dat.gui interface) or via a keyboard shortcut (commonly the question mark).
- Your HTML and CSS should validate. There are options/plugins for most IDEs to check validation.

The interactive experience should possess a reasonable level of complexity. Some examples:
### Three.js
- A generative algorithm creates simple agents that move through a virtual world. Your interface controls the behavior / appearance of these agents.
- A simple 3D game
- An 3D audio visualization of a song of your choosing. User interaction should control aspects of the visualization. 
### Canvas
- Implement a generative algorithm such as [Conway's Game of Life](https://bitstorm.org/gameoflife/) (or 1D cellular automata) and provide interactive controls. Note that the Game of Life has been created by 100s of people using <canvas>; we'll be checking to ensure that your implementation is not a copy of these.
- Design a 2D audio visualizer of a song of your choosing. User interaction should control visual aspects of the experience. 
### Web Audio API
- Create a screen-based musical instrument using the Web Audio API. You can use projects such as [Interface.js](http://charlie-roberts.com/interface/) or [Nexus UI](https://nexus-js.github.io/ui/api/#Piano) to provide common musical interface elements, or use dat.GUI in combination with mouse/touch events (use the Pointer Events API). Your GUI should enable users to control aspects of sound synthesis.
### D3.js
- Create visualizations using the datasets found at [Awesome JSON Datasets](https://github.com/jdorfman/Awesome-JSON-Datasets). Experiment with providing different visualizations of the same data set, and providing users interactive control over visualization parameters and/or data filtering. Alternatively, create a single visualization with using one of the more complicated techniques shown at [d3js.org](d3js.org) and provide meaningful points of interaction for users.

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page on Glitch/Heroku/etc., it displays correctly.
4. Ensure that your project has the proper naming scheme `a4-firstname-lastname` so we can find it.
5. Fork this repository and modify the README to the specifications below. *NOTE: If you don't use Glitch for hosting (where we can see the files) then you must include all project files that you author in your repo for this assignment*.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a4-firstname-lastname`.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Drawing App

https://a4-sam-moran.glitch.me/
  
My project is based on the same idea as Skribbl.io. It is a multiplayer game where one player is given a word to draw, and the other players have to guess the word based on the drawing.
I used WebSockets to communicate between clients and the server and synchronize state in near-realtime. This was a difficult task because I had to synchronize both the internal state of
the server and all clients, as well as the UI state of the clients, with very low latency so that the game plays smoothly. I mostly accomplished this; the one major feature I didn't have
time to figure out is changing the player who is in control of starting the game when the current player in control disconnects. Aside from that, the game works as expected and intended!

You will need at least 2 players connected in order to start the game. Only 1 player can draw at a time.