# Epiconsole
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat&logo=socket.io&badgeColor=010101) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB)

## Presentation


The purpose of this project is to reproduce and AirConsole, a console where the monitor is the laptop and the controllers are the smartphones of the players. The connection is made by QR code or by visiting the website and going on the controller page, then entering the ID of the room.

## Usage

Run the following command to get your ip:

    hostname -I

or

    ip a #next to inet

create a .env with HOST_IP=your_ip and HOST_PORT with the port you want

then run:

    docker compose build && docker compose up

then visit http://{your_ip}:HOST_PORT

## How to add a game

I've used PixiReact, a modified version of Pixi.js to fit in react. You can add a game using the same framework or choose yours.

Create your game into the games folder, add the route into the [main.tsx](/client/src/main.tsx) file, and connect it on the select menu in [Play](/client/src/routes/Play.tsx) file

### Contributor

Etienne KRETZ: etienne.kretz@epitech.eu

### [MIT Licence](/LICENSE)

---
[![](https://visitcount.itsvg.in/api?id=EpiConsole&icon=0&color=0)](https://visitcount.itsvg.in)

<!-- Proudly created with GPRM ( https://gprm.itsvg.in ) -->