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
const boundaries = [];
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
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-']
]

let lastKey = '';

/*----- cached elements  -----*/

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

    pacmanMovement() {
        this.render();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
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

/*----- event listeners -----*/
window.addEventListener('keydown', ({key}) => {
    switch(key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
});

window.addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});

/*----- functions -----*/
function init() {
    pacman.render();
    renderBoard();
}

function checkCollisions({circle, rectangle}) {
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width)
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkCollisions({circle: {...pacman, velocity: {x: 0, y: -5}}, rectangle: boundary})) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = -5;
            }
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkCollisions({circle: {...pacman, velocity: {x: -5, y: 0}}, rectangle: boundary})) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = -5;
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkCollisions({circle: {...pacman, velocity: {x: 0, y: 5}}, rectangle: boundary})) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = 5;
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkCollisions({circle: {...pacman, velocity: {x: 5, y: 0}}, rectangle: boundary})) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = 5;
            }
        }
    }

    boundaries.forEach((boundary) => {
        boundary.render();

        if (checkCollisions({circle: pacman, rectangle: boundary})) {
            // console.log('Colliding');
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        }
    });
    pacman.pacmanMovement();
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
            }
        });
    });
}

/*----- test area -----*/
init();
animate();