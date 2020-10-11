## Drawing App

Sam 

Glitch Link: https://a4-sam-moran.glitch.me/
  
My project is based on the same idea as Skribbl.io. It is a multiplayer game where one player is given a word to draw, and the other players have to guess the word based on the drawing.
I used WebSockets to communicate between clients and the server and synchronize state in near-realtime. This was a difficult task because I had to synchronize both the internal state of
the server and all clients, as well as the UI state of the clients, with very low latency so that the game plays smoothly. I mostly accomplished this; the one major feature I didn't have
time to figure out is changing the player who is in control of starting the game when the current player in control disconnects. Aside from that, the game works as expected and intended!

You will need at least 2 players connected in order to start the game. Only 1 player can draw at a time. If the leader (player in control of starting the game) disconnects before the game
starts, the server must be restarted, else the game will be unable to be started.