# DUNGEON OF LORZ - LOWREZJAM 2021 Submission
Dungeon of Lorz is a 64x64 hack-n-slash game for [LOWREZJAM 2021](https://itch.io/jam/lowrezjam-2021). Collect coins in the dungeon, upgrade, and delve into the dungeon again!

\* Lorz = low rez :) 

![Screenshot 2](./screenshots/2.png) 
![Screenshot 0](./screenshots/0.png) 
![Screenshot 1](./screenshots/1.png) 
![Screenshot 3](./screenshots/3.png) 

Powered by:
- [mugl](https://github.com/andykswong/mugl): Micro WebGL library.
- [munum](https://github.com/andykswong/munum): Micro Numerical library.

Features:
- Fight against 16 enemy types and 4 miniboss encounters.
- Spend coins to unlock additional characters and upgrades.
  - **Knight:** You start with the good old knight. ​Can wield shield. Can upgrade to better weapon and armor.
  - **Rogue:** Move and hit fast, but weaker. Can wield a bow.
  - **Mage:** Low HP but high damage. Starts with a fire staff. Unlock the ice staff to freeze enemies. The priest mode gives you a short-ranged, high damage holy spell attack, with faster HP recovery.
- Upgrades requires the character to be unlocked. The knight's steel shield also requires wooden shield to be unlocked first.
- Game is playable in with keyboard, gamepad, or touchscreen!

Keyboard Control:
- WASD or arrow keys to move / select upgrades
- E or Enter to attack / start / restart game
- Q to block / buy / equip upgrades

Click/Touch Controls:
- Touch the arrows / text to navigate the shop menu / start
- Touch and drag on the left half of screen to move
- Touch and hold on the right half of screen to block / attack. This touch area is further split into 2 regions - touch the left side to block and right side to attack
- Touch to go back to menu after dead

Gamepad Support (only Xbox controller is tested):
- Left stick to move / select upgrades
- A to attack / start / restart game
- B to block / buy / equip upgrades

LOWREZJAM Authenticity:
- To meet the 64x64 resolution requirement of LOWREZJAM 2021, the game is rendered using WebGL with a 64x64 drawing buffer and antialias set to false. The canvas is then upscaled to 320x320 using CSS, with style:  ```image-rendering: crisp-edges; image-rendering: pixelated```;

Credits:
- All game arts are created by my own
- Sound effects generated by jsfxr
- Music:
  - Background music by nene: https://opengameart.org/content/boss-battle-3-8-bit-re-upload
  - Game over music by Cleyton Kauffman - https://opengameart.org/content/game-over-theme

\* Asset are not included in this repo
