Assignment 4 - Creative Coding
===

Author: Mingxi Liu

Heroku Link: https://a4-liumxiris.herokuapp.com/

How to serve on local device:
---

```
$npm install
$npm start
```
and go to <http://localhost:3000/>

## 3D Audio Visualizer

- The goal of the application:
  - The project is a 3D audio Visualizer that can visualize a default chosen song.
- Challenges you faced in realizing the application:
  - When I was trying to get the data frequency, it seemed my data frequency was always 0. Then I realized it will return the correct data frequency only when the song was playing.
  - The first time I ran my visualizer, I found my memories were occupied quickly. Then it turned out I initalized my cubes inside of the anime() function and it would create cubes every time my screen updated so my memories got filled up quickly.

