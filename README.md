# Assignment 4 - Creative Coding: Interactive Multimedia Experiences

## Resplendent Audio Visualizer Experience (R.A.V.E.)

Edward Philippo -- http://a4-ephilippo.glitch.me

## Overview

For this project, I set out to make an two-dimensional audio visualizer.
It sounded like a neat way to learn about the Canvas and Web Audio APIs while still making an attractive end product.

My finished visualizer allows you to customize various visual elements:

1. Music volume multiplier: range from 0 (muted) to 2 (doubled).
2. Number of volume-sensitive spokes, which are distributed across the audio frequencies
3. Visualizer shape: circle or triangle
4. Background style: solid color, vertical gradient, horizontal gradient
5. Color of the visualizer object in the foreground
6. First background color
7. Second background color (if using gradient)

## Challenges

I ran into two main challenges.  Originally, I wanted to have several different shapes to choose from.
The circle was easy enough, since you just need to draw outwards from a center point.
I found the triangle to be much more difficult, between calculating where on each side a spoke needs to doing the trig to calculate a spoke's length.
After that I decided two shapes was enough.  I mean, a square wouldn't even be very interesting, right?

The other challenge was the animation.
I could have simply ran queued up new animation frames in a never-ending loop, but that would continuously redraw everything even when the music was paused.
Instead, I wanted to continuously animate while playing and stop while paused--
except doing that would freeze the spokes in place, and I liked how they slid inwards if they continued to animate after the music stopped.
I ended up running 60 frames after the music is paused, but then I also had to include a check so I wouldn't accidentally start double-queuing animations.
It was a mess.

## Achievements

There are no achievements listed on the assignment description, so here's a few that I've come up with.
I've suggested point values, but I'm also slightly biased so grade them how you will.

### Technical Achievements
- **Included multiple visualizer shapes** (5 points): wrote code to draw multiple visualizer shapes
that is responsive to size and number of spokes, and can be swapped while running.
- **Implemented smart animation** (10 points): programmed the animation to update only while music is playing, so as to save system resources.

### Design Achievements
- **Shaded text backdrop** (5 points): applied shading behind text with CSS to make it readable against any background color.
- **Used gradient for background** (5 points): drew a customizable gradient on the canvas to serve as a background.

## References and Credit

Credit where credit is due:

- Music is from http://www.nihilore.com, a site hosting music for free-use.

- I referenced this tutorial to figure out the basics of the visualizer: https://www.kkhaydarov.com/audio-visualizer/