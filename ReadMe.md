# HTML Helicopter Game
----------------------------------------------------------------
### Description

This is an HTML game using canvas and JavaScript.

When the game starts, it spawns the player as a red helicopter at the middle of the canvas. The player can control the helicopter through wasd keys for movement and can accelerate by pressing shift key and decelerate by pressing alt key. The player can also shoot a missile by pressing space bar, the missile has a 3 second cooldown.

6 enemy helicopters will be spawned on the canvas. 5 of them will slightly change their velocity by a random amount with a certain interval, and the last one will have deterministic motion. The random helicopters will spawn at random positions in the canvas with random velocity, while hte deterministic helicopter will always spawn at the top left corner of the canvas with the same velocity. These helicopters will shoot a missile every 3 seconds.

Both the enemy helicopters and missile will bounce off the edge of the canvas. 

If a missile hits something, both the missile and the object hit will be destroyed, and an explosion animation and sound will be played. If a helicopter (including the player) is hit by a missile, the helicopter will be destroyed, its death count will be increased by 1, and it will respawn at a random location with random velocity after 3 seconds. The helicopter that shot the missile will get a point. 

However, if the helicopter is hit by a missile shot by itself, it loses a point instead of gaining one. 

The score and the death count of a helicopter is displayed at the upper left corner of the helicopter.

The goal of the game is to earn as many points as possible with the least deaths.