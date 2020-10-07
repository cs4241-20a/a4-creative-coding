Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

Author: Jialin Song
Glitch: https://a4-jialin-song.glitch.me/

Description
---
- This is a music visualizer project developed based in Three.js with Web Audio API, using a free-resource song ["Golden"](https://soundcloud.com/freemusicforvlogs/mona-wonderlick-golden-free-music-for-vlogs?in=freemusicforvlogs/sets/casey-neistat-style).
- The shape of the cloud in the visualizer was adopted from an example on Three.js website called ["Volume Cloud"](https://threejs.org/examples/?q=clou#webgl2_volume_cloud), but the functionalities (except for size and transparency) in interaction user interface were all developed by myself. There are 8 parameters for user to control:
 - size: a slide bar to control the size of the cloud
 - transparency: a slide bar to control the visibility of the cloud
 - canvas rgb: three slide bars to control the background color behind the cloud
 - volume: a slide bar to change the volume of the song track
 - pause: a checkbox to pause/resume the song
 - play_again: a button to play the song again after the previous one finished playing
 - reset: a button to reset all slide bar values to default
 - help: a button for user to get instructions about the parameters he/she could change
- A basuc documentation will be displayed when you first enter the web page, then direct to the music visualizer by clicking the 'play' button.
- The website is validated using [W3C Validator](https://validator.w3.org/)
- Challenge of doing this project is to understand how "vertexShader" and "fragmentShader" are implemented to get this relatively complex cloud model, and which parameters inside of it could be changed for music visualization. Another challenge would be the difference of music playing with Apple products and others, so multiple conditions need to be considered when writing functionality such as pause or play_again.
