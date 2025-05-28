document.addEventListener("DOMContentLoaded", () => {
    let GAME_SPEED = 250
    const CANVAS_BORDER_COLOUR = 'black'
    const CANVAS_BACKGROUND_COLOUR = "grey"
    const SNAKE_COLOUR = 'darkgreen'
    const SNAKE_BORDER_COLOUR = 'black'
    const FOOD_COLOUR = 'red'
    const FOOD_BORDER_COLOUR = 'darkred'

    // Schrittweite und Feldgröße
    const FIELD_SIZE = 25

    let snake = [
        { x: 6 * FIELD_SIZE, y: 6 * FIELD_SIZE },
        { x: 5 * FIELD_SIZE, y: 6 * FIELD_SIZE },
        { x: 4 * FIELD_SIZE, y: 6 * FIELD_SIZE },
        { x: 3 * FIELD_SIZE, y: 6 * FIELD_SIZE },
        { x: 2 * FIELD_SIZE, y: 6 * FIELD_SIZE }
    ]

    // The user's score
    let score = 0
    // When set to true the snake is changing direction
    let changingDirection = false
    // Food coordinates
    let foodX: number
    let foodY: number
    // Velocitys
    let dx = FIELD_SIZE
    let dy = 0

    const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement
    // Return a two dimensional drawing context
    const ctx = gameCanvas?.getContext("2d")

    // Start game
    main()
    // Create the first food location
    createFood()
    // Call changeDirection whenever a key is pressed
    document.addEventListener("keydown", changeDirection)

    // Swipe-Steuerung für den gesamten Bildschirm
    let touchStartX = 0
    let touchStartY = 0

    document.addEventListener("touchstart", function (e) {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX
            touchStartY = e.touches[0].clientY
        }
    })

    document.addEventListener("touchend", function (e) {
        if (e.changedTouches.length === 1) {
            const dxTouch = e.changedTouches[0].clientX - touchStartX
            const dyTouch = e.changedTouches[0].clientY - touchStartY

            // Nur werten, wenn Swipe lang genug
            if (Math.abs(dxTouch) > 30 || Math.abs(dyTouch) > 30) {
                if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
                    // Horizontaler Swipe
                    if (dxTouch > 0) {
                        changeDirection({ keyCode: 39 } as KeyboardEvent) // rechts
                    } else {
                        changeDirection({ keyCode: 37 } as KeyboardEvent) // links
                    }
                } else {
                    // Vertikaler Swipe
                    if (dyTouch > 0) {
                        changeDirection({ keyCode: 40 } as KeyboardEvent) // runter
                    } else {
                        changeDirection({ keyCode: 38 } as KeyboardEvent) // hoch
                    }
                }
            }
        }
    })

    //Main function of the game called repeatedly to advance the game
    function main() {
        // If the game ended return early to stop game
        if (didGameEnd()) return

        setTimeout(function onTick() {
            changingDirection = false
            clearCanvas()
            drawFood()
            advanceSnake()
            drawSnake()

            // Call game again
            main()
        }, GAME_SPEED)
    }

    //Change the background colour of the canvas to CANVAS_BACKGROUND_COLOUR and draw a border around it
    function clearCanvas() {
        if(!ctx) return
        //  Select the colour to fill the drawing
        ctx.fillStyle = CANVAS_BACKGROUND_COLOUR
        //  Select the colour for the border of the canvas
        ctx.strokeStyle = CANVAS_BORDER_COLOUR

        // Draw a "filled" rectangle to cover the entire canvas
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)
        // Draw a "border" around the entire canvas
        ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)
    }

    //Draw the food on the canvas
    function drawFood() {
        if (!ctx) return
        ctx.fillStyle = FOOD_COLOUR
        ctx.strokeStyle = FOOD_BORDER_COLOUR
        ctx.fillRect(foodX, foodY, FIELD_SIZE, FIELD_SIZE)
        ctx.strokeRect(foodX, foodY, FIELD_SIZE, FIELD_SIZE)
    }

    //Advances the snake by changing the x-coordinates of its parts according to the horizontal velocity and the y-coordinates of its parts according to the vertical veolocity
    function advanceSnake() {
        // Create the new Snake's head
        const head = { x: snake[0].x + dx, y: snake[0].y + dy }
        // Add the new head to the beginning of snake body
        snake.unshift(head)

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY
        if (didEatFood) {
            score += 1
            // Increase speed every 5 points
            if(score <= 10){
                GAME_SPEED = GAME_SPEED - 5
            } else if (score <= 25) {
                GAME_SPEED = GAME_SPEED - 3
            } else if (score <= 40) {
                GAME_SPEED = GAME_SPEED - 1
            }

            // Display score on screen
            const scoreElement = document.getElementById('score')
            if (scoreElement) scoreElement.innerHTML = score.toString()

            // Generate new food location
            createFood()
        } else {
            // Remove the last part of snake body
            snake.pop()
        }
    }

    // Returns true if the head of the snake touched another part of the game or any of the walls
    function didGameEnd() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
        }

        const hitLeftWall = snake[0].x < 0
        const hitRightWall = snake[0].x > gameCanvas.width - FIELD_SIZE
        const hitToptWall = snake[0].y < 0
        const hitBottomWall = snake[0].y > gameCanvas.height - FIELD_SIZE

        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }

    /*
     * Generates a random number that is a multiple of 10 given a minumum
     * and a maximum number
     * @param { number } min - The minimum number the random number can be
     * @param { number } max - The maximum number the random number can be
     */
    function randomField(min: number, max: number) {
        return Math.round((Math.random() * (max - min) + min) / FIELD_SIZE) * FIELD_SIZE
    }

    //Creates random set of coordinates for the snake food.
    function createFood() {
        // Generate a random number the food x-coordinate
        foodX = randomField(0, gameCanvas.width - FIELD_SIZE)
        // Generate a random number for the food y-coordinate
        foodY = randomField(0, gameCanvas.height - FIELD_SIZE)

        // if the new food location is where the snake currently is, generate a new food location
        snake.forEach(function isFoodOnSnake(part) {
            const foodIsoNsnake = part.x == foodX && part.y == foodY
            if (foodIsoNsnake) createFood()
        })
    }

    //Draws the snake on the canvas
    function drawSnake() {
        // loop through the snake parts drawing each part on the canvas
        snake.forEach(drawSnakePart)
    }

    /*
     * Draws a part of the snake on the canvas
     * @param { object } snakePart - The coordinates where the part should be drawn
     */
    function drawSnakePart(snakePart: { x: number, y: number }) {
        if (!ctx) return
        // Set the colour of the snake part
        ctx.fillStyle = SNAKE_COLOUR

        // Set the border colour of the snake part
        ctx.strokeStyle = SNAKE_BORDER_COLOUR

        // Draw a "filled" rectangle to represent the snake part at the coordinates
        // the part is located
        ctx.fillRect(snakePart.x, snakePart.y, FIELD_SIZE, FIELD_SIZE)

        // Draw a border around the snake part
        ctx.strokeRect(snakePart.x, snakePart.y, FIELD_SIZE, FIELD_SIZE)
    }

    /*
     * Changes the vertical and horizontal velocity of the snake according to the key that was pressed.
     * The direction cannot be switched to the opposite direction, to prevent the snake from reversing
     * For example if the the direction is 'right' it cannot become 'left'
     * @param { object } event - The keydown event
     */
    function changeDirection(event: KeyboardEvent) {
        const LEFT_KEY = 37
        const RIGHT_KEY = 39
        const UP_KEY = 38
        const DOWN_KEY = 40
        /**
         * Prevent the snake from reversing
         * Example scenario:
         * Snake is moving to the right. User presses down and immediately left
         * and the snake immediately changes direction without taking a step down first
         */
        if (changingDirection) return
        changingDirection = true

        const keyPressed = event.keyCode

        const goingUp = dy === -FIELD_SIZE
        const goingDown = dy === FIELD_SIZE
        const goingRight = dx === FIELD_SIZE
        const goingLeft = dx === -FIELD_SIZE

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -FIELD_SIZE
            dy = 0
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0
            dy = -FIELD_SIZE
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = FIELD_SIZE
            dy = 0
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0
            dy = FIELD_SIZE
        }
    }
})