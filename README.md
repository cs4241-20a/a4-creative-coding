Trevor Paley
http://a4-trevor-paley.glitch.me

This is yet another implementation of Conway's Game of Life with a few configurable options.

The tricky part of this project was getting accurate an accurate frequency for generations per second (gps). The render code is tied to the screen's refresh rate via `requestAnimationFrame`, but the generations were just being performed in a `getTimeout` cycle, which is substantially less accurate. Getting 120 gps to make the period-2 constructs look like they were standing still on my 60 Hz monitor required precise timing measurements of both the time it takes to compute a generation and the overhead between timeouts, and math to factor that into the time to wait for the next generation. Overall it was a pretty tricky task. The other features, including implementing conway's game of life, were not very difficult.
