Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===
Jordan Stoessel

For this assignment we will focus on client-side development using popular audio technologies; the server requirements are minimal. The goal of this assignment is to refine our JavaScript knowledge while exploring the multimedia capabilities of the browser.

---


## Virtual Piano using Web Audio API

https://a4-jordan-stoessel.glitch.me
https://a4-jordan-stoessel.herokuapp.com/

The Virtual Piano app was made to allow a Piano to be played on a computer's physical keyboard. It makes use of Web Audio API as seen in https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API. Virtual Piano features a Piano interface which was created using Web Dev Simplified's HTML & CSS tutorial. Playing notes can be done by pressing the key on the note that you want to play. There are also user parameters that can be controlled such as a volume bar, filter frequency bar, waveforms, and pass filter types. The volume and frequency bars are synced with the numberal input next to it and vice versa; this was done using a sync function to read changes in input from either inputs. The user can also save their current settings, load their last saved settings, or reset their current settings to default. This was done by creating a simple server that holds the default settings of 0.5 volume, sine waveform, low-pass pass filter type, and a frequency of 1,000. The server utilizes express and the body-parser middleware for ease of use. There is a modal that can be opened and closed at will for those who are confused about using the app. This modal can be found after clicking the "Help!" button at the bottom of the application. The Virtual Piano app can be seen below.
![Virtual Piano](https://github.com/jstoessel/a4-creative-coding/blob/master/virtual_piano.PNG?raw=true)

There were multiple challenges with creating this application. At first, I made use of .mp3 files to create and test the Piano while also trying to generate different amounts of octaves. This proved to be difficult as the Piano became unresponsive when generated with javascript into HTML. As such, I had to redo the project and salvage code while implementing the Web Audio API for the next attempt. Key presses and sound are disconnected, but synced to the same key presses. As such, pressing Z will both play the "C1" note while also making the lower C key highlighted. Adding and removing key presses proved to be difficult since it required a separate function to not give an error. Clicking was working for the broken code, but a click function would prove to be unecessary and also inefficient to add. The application makes use of Adobe's color palette which then led me to changing the sliders to stand out on the blue background. The color palette can be seen below.
![Color Palette](https://github.com/jstoessel/a4-creative-coding/blob/master/color_palette.png?raw=true)


### Credits to:

Web Dev Simplified for Piano visual tutorial and modal tutorial
css-tricks.com for slider customization options
https://pages.mtu.edu/~suits/notefreqs.html for note frequencies
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API for Web Audio API tutorial
