## Creative Project

Link: https://a4-ninataurich.glitch.me/

### Goal:
The goal of this project was to create an interactive 3d experience. I wanted to experiment is three.js and understand what it was capable of. In this project the user can create cubes and move around the space. When the user clicks on a cube it will expand/explode and then contract/reassemble. I used the server to make the cubes persistent when the page reloads

### Challenges:
I challenged myself to use the ShaderMaterial and create a vertex and fragment shader. The vertex shader is responsible for changing the distance each side is from the center of the cube.

The second challenge I faced was getting the cubes to only expand once every mouse click instead of repeating forever once clicked. I solved this by only animating the cubes in an array and deleting them from the array once one round was completed. 

### Notes:
Clicking on the cube can be unpredictable. Sometimes you have to click several times for it to react

