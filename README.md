# Epiconsole

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

then visit http://your_ip:3000

## Technologie used

- React with Vite bundler
- tailwind + shadcn/originUI
- Node + Express for the server

### Contributor

Etienne KRETZ: etienne.kretz@epitech.eu

