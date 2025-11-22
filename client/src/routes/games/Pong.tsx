import { Application, extend, useTick } from '@pixi/react';
import { useState, useRef, useCallback } from 'react';
import { useGameNetwork } from '../../utils/network';
import {QRCodeSVG} from 'qrcode.react';
import UI from '../../components/GameUI';
import { MyChat } from '../../components/MyChat';
import {
    Container,
    Graphics,
    Sprite
} from 'pixi.js';

extend({
    Container,
    Graphics,
    Sprite
});

interface Player {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    score: number;
}

interface GameState {
    players: { [socketID: string]: Player };
    balls: Array<{ x: number, y: number, width: number, height: number, resetting?: boolean, dx: number, dy: number }>;
    gameOver: boolean;
    gameStarted: boolean;
}

const PLAYER_COLORS = ['blue', 'green', 'orange', 'purple', 'yellow', 'cyan'];
const HEIGHT = 700, WIDTH = 1000;

export default function GameTest() {
    const ballSpeed = 4;
    
    const [gameState, setGameState] = useState<GameState>({
        players: {},
        balls: [{ x: WIDTH / 2, y: HEIGHT / 2, width: 10, height: 10, resetting: false, dx: ballSpeed, dy: -ballSpeed }],
        gameOver: false,
        gameStarted: false
    });

    const { commands, clearCommands } = useGameNetwork(localStorage.getItem('gameID') || '');
    const gameStateRef = useRef(gameState);
    const commandQueueRef = useRef<Array<{ socketID: string, command: string }>>([]);
    
    gameStateRef.current = gameState;

    function GameLoop() {
        useTick(() => {
            // if (gameStateRef.current.gameOver || !gameStateRef.current.gameStarted) return;

            handleEvents();
            updateGame();
        });

        return null;
    }

    // 1. EVENT HANDLING
    const handleEvents = useCallback(() => {
        for (const [socketID, commandList] of Object.entries(commands)) {
            commandList.forEach(command => {
                console.log("cmd :" , command, socketID);
                commandQueueRef.current.push({ socketID, command });
            });
        }
        
        while (commandQueueRef.current.length > 0) {
            const { socketID, command } = commandQueueRef.current.shift()!;
            processCommand(socketID, command);
        }
        
        if (Object.keys(commands).length > 0) {
            clearCommands();
        }
    }, [commands, clearCommands]);

    const processCommand = (socketID: string, command: string) => {
        setGameState(prev => {
            const newState = { ...prev };
            
            if (!newState.players[socketID]) {
                const playerCount = Object.keys(newState.players).length;
                const color = PLAYER_COLORS[playerCount % PLAYER_COLORS.length];
                const PlayersPosition = [
                    // left (centered)
                    { x: 10, y: HEIGHT / 2 - 40, width: 20, height: 80 },
                    // right (centered)
                    { x: WIDTH - 30, y: HEIGHT / 2 - 40, width: 20, height: 80 },
                    // top (centered)
                    { x: WIDTH / 2 - 40, y: 10, width: 80, height: 20 },
                    // bottom (centered)
                    { x: WIDTH / 2 - 40, y: HEIGHT - 30, width: 80, height: 20 },
                ];
                
                const pos = PlayersPosition[playerCount % PlayersPosition.length];
                
                newState.players[socketID] = {
                    id: socketID,
                    x: pos.x,
                    y: pos.y,
                    width: pos.width,
                    height: pos.height,
                    color: color,
                    score: 0
                };
                
                if (!newState.gameStarted) {
                    newState.gameStarted = true;
                }
                return newState;
            }
            
            if (newState.players[socketID]) {
                const player = { ...newState.players[socketID] };
                const moveSpeed = 3;
                
                switch (command) {
                    case 'Top':
                        player.y = Math.max(0, player.y - moveSpeed);
                        break;
                    case 'Bottom':
                        player.y = Math.min(560, player.y + moveSpeed);
                        break;
                }
                
                newState.players[socketID] = player;
            }
            
            return newState;
        });
    };

    const updateGame = useCallback(() => {
        setGameState(prev => {
            if (prev.gameOver || !prev.gameStarted) return prev;
            
            const newState = { ...prev };

            // move balls
            const newBalls = prev.balls.map(ball => {
                const newBall = { ...ball };
                newBall.x = newBall.x + newBall.dx;
                newBall.y = newBall.y + newBall.dy;

                // prevent ball from going through top/bottom walls by changing its velocity
                if (newBall.y < 0) {
                    newBall.y = 0;
                    newBall.dy *= -1;
                } else if (newBall.y + newBall.height > HEIGHT) {
                    newBall.y = HEIGHT - newBall.height;
                    newBall.dy *= -1;
                }

                // prevent ball from going through left/right walls
                if (newBall.x < 0) {
                    newBall.x = 0;
                    newBall.dx *= -1;
                } else if (newBall.x + newBall.width > WIDTH) {
                    newBall.x = WIDTH - newBall.width;
                    newBall.dx *= -1;
                }

                return newBall;
            });

            // check collisions between players and balls
            Object.keys(newState.players).forEach(socketID => {
                const player = newState.players[socketID];
                newBalls.forEach((ball, index) => {
                    if (checkCollision(player, ball)) {
                        // bounce ball horizontally
                        const bounced = { ...ball };
                        bounced.dx *= -1;

                        // nudge ball outside player to avoid repeated collisions
                        if (bounced.dx > 0) {
                            bounced.x = player.x + player.width;
                        } else {
                            bounced.x = player.x - bounced.width;
                        }

                        // optionally increase speed slightly (cap it)
                        const speedIncrease = 0.5;
                        const maxSpeed = 12;
                        const newSpeed = Math.min(Math.abs(bounced.dx) + speedIncrease, maxSpeed);
                        bounced.dx = Math.sign(bounced.dx) * newSpeed;

                        newBalls[index] = bounced;

                        // award a point to the player that hit the ball
                        newState.players[socketID] = { ...player, score: (player.score || 0) + 1 };
                    }
                });
            });

            newState.balls = newBalls;
            
            return newState;
        });
    }, []);

    const checkCollision = (rect1: any, rect2: any) => {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    };

    const PlayersGraphics = useCallback(() => {
        return (
            <>
                {Object.values(gameState.players).map((player) => {
                    const draw = useCallback((g: any) => {
                        g.clear();
                        g.rect(0, 0, player.width, player.height);
                        g.fill(player.color);
                        
                        // Add a border to distinguish players
                        g.rect(0, 0, player.width, player.height);
                        g.stroke({ width: 2, color: 'white' });
                    }, [player]);

                    return (
                        <pixiGraphics 
                            key={player.id}
                            draw={draw} 
                            x={player.x} 
                            y={player.y} 
                        />
                    );
                })}
            </>
        );
    }, [gameState.players]);

    const BallsGraphics = useCallback(() => {
        return (
            <>
                {gameState.balls.map((ball, index) => {
                    const draw = useCallback((g: any) => {
                        g.clear();
                        g.rect(0, 0, ball.width, ball.height);
                        g.fill('red');
                    }, [ball]);

                    return (
                        <pixiGraphics 
                            key={index}
                            draw={draw} 
                            x={ball.x} 
                            y={ball.y} 
                        />
                    );
                })}
            </>
        );
    }, [gameState.balls]);

    const UIOverlay = () => (
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'white',
            fontSize: '16px',
            fontFamily: 'Arial',
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px',
            borderRadius: '5px'
        }}>
            <div style={{marginBottom: '10px', fontSize: '18px', fontWeight: 'bold'}}>
                Multiplayer Game
            </div>
            <div>Players: {Object.keys(gameState.players).length}</div>
            {/* <div>balls: {gameState.balls.length}</div> */}
            <div style={{marginTop: '10px'}}>
                <strong>Scoreboard:</strong>
                {Object.values(gameState.players)
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                        <div key={player.id} style={{
                            color: player.color,
                            marginLeft: '10px'
                        }}>
                            {index + 1}. Player {player.id.slice(-4)}: {player.score}
                        </div>
                    ))}
            </div>
            {!gameState.gameStarted && (
                <div style={{color: 'yellow', marginTop: '10px'}}>
                    Waiting for players to join...
                </div>
            )}
            {gameState.gameOver && (
                <div style={{color: 'red', fontSize: '20px', marginTop: '10px'}}>
                    GAME OVER!
                </div>
            )}
        </div>
    );

    return (
      <div className='w-full h-full flex flex-row'>
        <div style={{ position: 'relative' }}>
            <UIOverlay />
            <Application width={WIDTH} height={HEIGHT} background={0x1e1e1e}>
                <GameLoop />
                <PlayersGraphics />
                <BallsGraphics />
                <UI width={WIDTH} height={HEIGHT} showUI={!gameState.gameStarted} onStartClick={() => {
                    setGameState(prev => ({ ...prev, gameStarted: true }));
                }} />
            </Application>
        </div>
        <div className="flex flex-col justify-center mt-20 ml-32">
          <MyChat gameID={localStorage.getItem('gameID') || ''}/>
          <h3>Scan the QR code below to start playing</h3>
          <QRCodeSVG
            value={`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/controller?gameID=${localStorage.getItem('gameID')}`}
            className="m-5 w-60 h-60"
            bgColor={'transparent'}
            fgColor={'#000000'}
          />
          <p className="text-sm">Or go to http://{import.meta.env.VITE_IP}:{import.meta.env.VITE_PORT}/controller</p>
          <p className="text-sm">And enter the game ID: <span className="font-bold text-lg">{localStorage.getItem('gameID')}</span></p>
        </div>
      </div>
    );
}
