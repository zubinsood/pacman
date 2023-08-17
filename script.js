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
let freezeGame = false;
let lastTime = 0;
const FRAME_RATE = 60; // Desired frame rate (frames per second)
// const ANIMATION_SPEED = 0.1; // Adjust animation speed as needed

const spriteSheet = createImage('./img/spriteSheet.png');
spriteSheet.onload = init; // Call init when the spriteSheet is loaded

const spriteFrames = {
    red: {
        right: { x: 0, y: 0, width: 180, height: 180 },
        up: { x: 180, y: 0, width: 180, height: 180 },
        down: { x: 0, y: 180, width: 180, height: 180 },
        left: { x: 180, y: 180, width: 180, height: 180 }
    },
    pink: {
        right: { x: 0, y: 360, width: 180, height: 180 },
        up: { x: 180, y: 360, width: 180, height: 180 },
        down: { x: 0, y: 540, width: 180, height: 180 },
        left: { x: 180, y: 540, width: 180, height: 180 }
    },
    gold: {
        right: { x: 390, y: 360, width: 180, height: 180 },
        up: { x: 570, y: 360, width: 180, height: 180 },
        down: { x: 390, y: 540, width: 180, height: 180 },
        left: { x: 570, y: 540, width: 180, height: 180 }
    },
    aqua: {
        right: { x: 390, y: 0, width: 180, height: 180 },
        up: { x: 570, y: 0, width: 180, height: 180 },
        down: { x: 390, y: 180, width: 180, height: 180 },
        left: { x: 570, y: 180, width: 180, height: 180 }
    },
};

const ghostColor = 'red';
const ghostDirection = 'up';

const frame = spriteFrames[ghostColor][ghostDirection];
console.log('TESTING:', frame); // Outputs: { x: 0, y: 0, width: 64, height: 64 }

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
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
  ]

let lastKey = '';

/*----- classes -----*/
class Boundary {
    static width = 40;
    static height = 40;

    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }

    render() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

class PacMan {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.chompSpeed = 0.45;
        this.rotation = 0;
    }

    render() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
        ctx.lineTo(this.position.x - 5, this.position.y);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    movement() {
        this.render();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.radians < 0 || this.radians > 0.75) {
            this.chompSpeed = -this.chompSpeed;
        }

        this.radians += this.chompSpeed;
    }
}

class Ghost {
    static speed = 2;
    constructor({ position, velocity, color = 'red' }) {
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.prevCollisions = [];
        this.speed = 2;
        this.vulnerable = false;
        this.visible = true;
        this.currentFrame = 0;
    }

    render(ghostFrameDirection) {
        const frame = spriteFrames[this.color][ghostFrameDirection];
        ctx.drawImage(
            spriteSheet,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            this.position.x - this.radius,
            this.position.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
    }

    // animateSprite() {
    //     this.currentFrame += ANIMATION_SPEED;
    //     if (this.currentFrame >= spriteFrames.length) {
    //         this.currentFrame = 0;
    //     }
    // }

    movement(ghostFrameDirection) {
        this.render(ghostFrameDirection);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Pellet {
    constructor({ position }) {
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
    constructor({ position }) {
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

const pacman = new PacMan({
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
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'red',
        currentFrame: 0
    }),
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 7 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink',
        currentFrame: 0
    }),
    new Ghost({
        position: {
            x: Boundary.width * 4 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2
        },
        velocity: {
            x: -Ghost.speed,
            y: 0
        },
        color: 'gold',
        currentFrame: 0
    }),
    new Ghost({
        position: {
            x: Boundary.width * 4 + Boundary.width / 2,
            y: Boundary.height * 7 + Boundary.height / 2
        },
        velocity: {
            x: -Ghost.speed,
            y: 0
        },
        color: 'aqua',
        currentFrame: 0
    })
]

/*----- event listeners -----*/
window.addEventListener('keydown', ({ key }) => {
    switch (key.toLowerCase()) {
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

window.addEventListener('keyup', ({ key }) => {
    switch (key.toLowerCase()) {
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

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
  }

function checkBoundaryCollisions({ circle, rectangle }) {
    const spacing = Boundary.width / 2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + spacing && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - spacing && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - spacing && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + spacing)
}

function checkCircleCollisions({ circle1, circle2 }) {
    const dx = circle2.position.x - circle1.position.x;
    const dy = circle2.position.y - circle1.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= circle1.radius + circle2.radius;
}

function gameLoop(timestamp) {
    if (freezeGame) {
        return;
    }
    const deltaTime = timestamp - lastTime;
    if (!freezeGame && deltaTime >= 1000 / FRAME_RATE) {
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
            if (checkBoundaryCollisions({ circle: { ...pacman, velocity: { x: 0, y: -5 } }, rectangle: boundary })) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = -5;
            }
        }
    } else if (keys.a.pressed && lastKey === KEYBOARD.A) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkBoundaryCollisions({ circle: { ...pacman, velocity: { x: -5, y: 0 } }, rectangle: boundary })) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = -5;
            }
        }
    } else if (keys.s.pressed && lastKey === KEYBOARD.S) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkBoundaryCollisions({ circle: { ...pacman, velocity: { x: 0, y: 5 } }, rectangle: boundary })) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = 5;
            }
        }
    } else if (keys.d.pressed && lastKey === KEYBOARD.D) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkBoundaryCollisions({ circle: { ...pacman, velocity: { x: 5, y: 0 } }, rectangle: boundary })) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = 5;
            }
        }
    }

    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i];
        pellet.render();

        if (checkCircleCollisions({ circle1: pacman, circle2: pellet })) {
            // console.log('Touching');
            pellets.splice(i, 1);
        }
    }

    for (let i = ghosts.length - 1; 0 <= i; i--) {
        let ghost = ghosts[i];
        if (checkCircleCollisions({ circle1: pacman, circle2: ghost })) {
            if (ghost.vulnerable) {
                ghost.visible = false;
                freezeGame = true;
                setTimeout(() => {
                    ghosts.splice(i, 1);
                    freezeGame = false;
                    requestAnimationFrame(gameLoop);
                }, 1000);
            } else {
                freezeGame = true;
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
        
                if (ghost.vulnerabilityTimeout) {
                    clearTimeout(ghost.vulnerabilityTimeout);
                }
        
                ghost.vulnerabilityTimeout = setTimeout(() => {
                    ghost.vulnerable = false;
                    ghost.vulnerabilityTimeout = null;
                    ghost.visible = true; // Ensure visibility is restored after vulnerability
                    console.log('Ghost visibility after 5 seconds:', ghost.visible);
                }, 5000);

            });
        }
    }

    checkWinner();

    boundaries.forEach((boundary) => {
        boundary.render();

        if (checkBoundaryCollisions({ circle: pacman, rectangle: boundary })) {
            // console.log('Colliding');
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        }
    });

    pacman.movement();

    ghosts.forEach((ghost) => {
        if (ghost.visible) {
            // ghost.animateSprite();
            if (ghost.velocity.x > 0) {
                console.log('ghost speed:', ghost.velocity.x)
                ghost.movement(DIRECTION.RIGHT);
            } else if (ghost.velocity.x < 0) {
                console.log('ghost speed:',ghost.velocity.x)
                ghost.movement(DIRECTION.LEFT);
            } else if (ghost.velocity.y < 0) {
                console.log('ghost speed:',ghost.velocity.y)
                ghost.movement(DIRECTION.UP);
            } else if (ghost.velocity.y > 0) {
                console.log('ghost speed:',ghost.velocity.y)
                ghost.movement(DIRECTION.DOWN);
            }
        }

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

    // PacMan Chomp
    if (pacman.velocity.x > 0) {
        pacman.rotation = 0;
    } else if (pacman.velocity.x < 0) {
        pacman.rotation = Math.PI;
    } else if (pacman.velocity.y > 0) {
        pacman.rotation = Math.PI / 2;
    } else if (pacman.velocity.y < 0) {
        pacman.rotation = Math.PI * 1.5;
    }
}

function checkWinner() {
    // console.log(pellets.length)
    if (pellets.length === 0 && powerpellets.length === 0) {
        cancelAnimationFrame(animationId);
        setTimeout(() => {
            freezeGame = true;
        }, 100);
        console.log('You Win!');
    }
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
                            },
                            image: createImage('./img/pipeHorizontal.png'),
                        })
                    )
                    break;
                case '|':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeVertical.png'),
                        })
                    )
                    break;
                case '1':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner1.png'),
                        })
                    )
                    break;
                case '2':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner2.png'),
                        })
                    )
                    break;
                case '3':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner3.png'),
                        })
                    )
                    break;
                case '4':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner4.png'),
                        })
                    )
                    break;
                case 'b':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/block.png'),
                        })
                    )
                    break;
                case '[':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capLeft.png'),
                        })
                    )
                    break;
                case ']':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capRight.png'),
                        })
                    )
                    break;
                case '_':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capBottom.png'),
                        })
                    )
                    break;
                case '^':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capTop.png'),
                        })
                    )
                    break;
                case '+':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/pipeCross.png'),
                        })
                    )
                    break;
                case '5':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            color: 'blue',
                            image: createImage('./img/pipeConnectorTop.png'),
                        })
                    )
                    break;
                case '6':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            color: 'blue',
                            image: createImage('./img/pipeConnectorRight.png'),
                        })
                    )
                    break;
                case '7':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            color: 'blue',
                            image: createImage('./img/pipeConnectorBottom.png'),
                        })
                    )
                    break;
                case '8':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/pipeConnectorLeft.png'),
                        })
                    )
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