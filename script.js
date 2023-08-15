/*
1. Project Setup
2. Generate Map Boundaries
3. Generate Pac Man with Movement
4. Collision Detection
5. Generate Pellets
6. Remove Pellets on Collision
7. Possibly add a score
8. Create ghosts
9. Create power-up(s)
10. Win Conditions
11. Layout a bigger map
12. Chomp animation

Initialize board with a layout representing the boundaries

Create Pac-Man object with positions, direction, and possibly score

Create ghost objects with positions

Create pellets and MVP 1 power - up on the board

While the game is running (Game Loop maybe):
    Event Listeners for player input (W A S D)

    Update Pac-Man's position based on the input

    Move each ghost towards Pac-Man's current position (MVP is have ghosts move in general)

    Check if Pac-Man collides with pellet/powerup:
        - Remove the pellet, update the score, and render the board

    Check if Pac-Man collides with ghost
        - Lose a life (MVP Game Over)

    renderBoard:
        - Render the layout (Walls, Pac-Man, Pellets, Powerup, Ghosts)
        - Display Pac-Man score

End the game loop when win or the player chooses to exit

Final score + Game Over Screen

/*

/*----- constants -----*/
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let animationId;
let gameOver = false;
let lastTime = 0;
const FRAME_RATE = 60; // Desired frame rate (frames per second)

const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

const KEYBOARD = {
    W: 'w',
    S: 's',
    A: 'a',
    D: 'd',
    KEYUP: 'arrowup',
    KEYDOWN: 'arrowdown',
    KEYRIGHT: 'arrowright',
    KEYLEFT: 'arrowleft'
}

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const boundaries = [];
const pellets = [];
const powerpellets = [];

/*----- state variables -----*/
// const board = [
//     ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '-'],
//     ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
// ];

const board = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '.', '.', '.', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '.', '.', '.', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
    ['-', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
]

let lastKey = '';

/*----- classes -----*/
class Boundary {
    static width = 40;
    static height = 40;

    constructor({position}) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }

    render() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class PacMan {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }

    render() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }

    movement() {
        this.render();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Ghost {
    static speed = 2;
    constructor({position, velocity, color = 'red'}) {
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.prevCollisions = [];
        this.speed = 2;
        this.vulnerable = false;
    }

    render() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.vulnerable ? 'blue' : this.color;
        ctx.fill();
        ctx.closePath();
    }

    movement() {
        this.render();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Pellet {
    constructor({position}) {
        this.position = position;
        this.radius = 3;
    }

    render() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

class PowerPellet {
    constructor({position}) {
        this.position = position;
        this.radius = 8;
    }

    render() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

const pacman = new PacMan ({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const ghosts = [
    new Ghost ({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost ({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 7 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    }),
    new Ghost ({
        position: {
            x: Boundary.width * 4 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2
        },
        velocity: {
            x: -Ghost.speed,
            y: 0
        },
        color: 'gold'
    }),
    new Ghost ({
        position: {
            x: Boundary.width * 4 + Boundary.width / 2,
            y: Boundary.height * 7 + Boundary.height / 2
        },
        velocity: {
            x: -Ghost.speed,
            y: 0
        },
        color: 'aqua'
    })
]

/*----- event listeners -----*/
window.addEventListener('keydown', ({key}) => {
    switch(key.toLowerCase()) {
        case KEYBOARD.W:
            keys.w.pressed = true;
            lastKey = KEYBOARD.W;
            break;
        case KEYBOARD.A:
            keys.a.pressed = true;
            lastKey = KEYBOARD.A;
            break;
        case KEYBOARD.S:
            keys.s.pressed = true;
            lastKey = KEYBOARD.S;
            break;
        case KEYBOARD.D:
            keys.d.pressed = true;
            lastKey = KEYBOARD.D;
            break;
    }
});

window.addEventListener('keyup', ({key}) => {
    switch(key.toLowerCase()) {
        case KEYBOARD.W:
            keys.w.pressed = false;
            break;
        case KEYBOARD.A:
            keys.a.pressed = false;
            break;
        case KEYBOARD.S:
            keys.s.pressed = false;
            break;
        case KEYBOARD.D:
            keys.d.pressed = false;
            break;
    }
});

/*----- functions -----*/
function init() {
    renderBoard();
}

function checkBoundaryCollisions({circle, rectangle}) {
    const spacing = Boundary.width / 2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + spacing && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - spacing && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - spacing && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + spacing)
}

function checkCircleCollisions({circle1, circle2}) {
    const dx = circle2.position.x - circle1.position.x;
    const dy = circle2.position.y - circle1.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance <= circle1.radius + circle2.radius;
}

function gameLoop(timestamp) {
    if (gameOver) {
        return;
    }
    const deltaTime = timestamp - lastTime;
    if (!gameOver && deltaTime >= 1000 / FRAME_RATE) {
        lastTime = timestamp;
        animate();
    }
    animationId = requestAnimationFrame(gameLoop);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.w.pressed && lastKey === KEYBOARD.W) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkBoundaryCollisions({circle: {...pacman, velocity: {x: 0, y: -5}}, rectangle: boundary})) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = -5;
            }
        }
    } else if (keys.a.pressed && lastKey === KEYBOARD.A) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkBoundaryCollisions({circle: {...pacman, velocity: {x: -5, y: 0}}, rectangle: boundary})) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = -5;
            }
        }
    } else if (keys.s.pressed && lastKey === KEYBOARD.S) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkBoundaryCollisions({circle: {...pacman, velocity: {x: 0, y: 5}}, rectangle: boundary})) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = 5;
            }
        }
    } else if (keys.d.pressed && lastKey === KEYBOARD.D) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkBoundaryCollisions({circle: {...pacman, velocity: {x: 5, y: 0}}, rectangle: boundary})) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = 5;
            }
        }
    }

    for (let i = pellets.length - 1; 0 < i; i--) {
        const pellet = pellets[i];
        pellet.render();

        if (checkCircleCollisions({circle1: pacman, circle2: pellet})) {
            // console.log('Touching');
            pellets.splice(i, 1);
        }
    }

    for (let i = ghosts.length - 1; 0 <= i; i--) {
        let ghost = ghosts[i];
        if (checkCircleCollisions({circle1: pacman, circle2: ghost})) {
            if (ghost.vulnerable) {
                ghosts.splice(i, 1);
            } else {
                gameOver = true;
                cancelAnimationFrame(animationId);
                console.log('Game Over');
            }
        }
    }

    for (let i = powerpellets.length - 1; 0 <= i; i--) {
        const powerpellet = powerpellets[i];
        powerpellet.render();

        if (checkCircleCollisions({circle1: pacman, circle2: powerpellet})) {
            powerpellets.splice(i, 1);
            ghosts.forEach((ghost) => {
                ghost.vulnerable = true;

                setTimeout(() => {
                    ghost.vulnerable = false;
                }, 5000);
            });
        }
    }

    boundaries.forEach((boundary) => {
        boundary.render();

        if (checkBoundaryCollisions({circle: pacman, rectangle: boundary})) {
            // console.log('Colliding');
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        }
    });

    pacman.movement();

    ghosts.forEach((ghost) => {
        ghost.movement();

        const collisions = [];
        const directions = [
            { direction: DIRECTION.RIGHT, velocity: { x: ghost.speed, y: 0 } },
            { direction: DIRECTION.LEFT, velocity: { x: -ghost.speed, y: 0 } },
            { direction: DIRECTION.UP, velocity: { x: 0, y: -ghost.speed } },
            { direction: DIRECTION.DOWN, velocity: { x: 0, y: ghost.speed } }
        ];
        
        directions.forEach(({ direction, velocity }) => {
            if (!collisions.includes(direction)) {
                const collision = boundaries.some(boundary =>
                    checkBoundaryCollisions({ circle: { ...ghost, velocity }, rectangle: boundary })
                );
                if (collision) {
                    collisions.push(direction);
                }
            }
        });

        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions;

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            let direction = '';
        
            if (ghost.velocity.x > 0) {
                direction = DIRECTION.RIGHT;
            } else if (ghost.velocity.x < 0) {
                direction = DIRECTION.LEFT;
            } else if (ghost.velocity.y < 0) {
                direction = DIRECTION.UP;
            } else if (ghost.velocity.y > 0) {
                direction = DIRECTION.DOWN;
            }
        
            if (direction) {
                ghost.prevCollisions.push(direction);
            }

            // console.log(collisions);
            // console.log(ghost.prevCollisions);

            const pathways = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision); 
            });
            // console.log({pathways});

            const ghostDirection = pathways[Math.floor(Math.random() * pathways.length)]

            // console.log({ghostDirection});

            switch (ghostDirection) {
                case DIRECTION.DOWN:
                    ghost.velocity.y = ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case DIRECTION.UP:
                    ghost.velocity.y = -ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case DIRECTION.RIGHT:
                    ghost.velocity.y = 0;
                    ghost.velocity.x = ghost.speed;
                    break;
                case DIRECTION.LEFT:
                    ghost.velocity.y = 0;
                    ghost.velocity.x = -ghost.speed;
                    break;
            }
            ghost.prevCollisions = [];    
        }
        // console.log(collisions);
    });
}

function renderBoard() {
    boundaries.length = 0;
    board.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case '-':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            }
                        })
                    );
                    break;
                case '.':
                    pellets.push(
                        new Pellet({
                            position: {
                                x: j * Boundary.width + Boundary.width / 2,
                                y: i * Boundary.height + Boundary.height / 2
                            }
                        })
                    )
                    break;
                case 'p':
                    powerpellets.push(
                        new PowerPellet({
                            position: {
                                x: j * Boundary.width + Boundary.width / 2,
                                y: i * Boundary.height + Boundary.height / 2
                            }
                        })
                    )
                    break;
            }
        });
    });
}

/*----- test area -----*/
init();
requestAnimationFrame(gameLoop);