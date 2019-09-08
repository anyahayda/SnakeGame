import {Environment} from "./Environment";
import * as P5 from 'p5/lib/p5';
import * as Hammer from 'hammerjs';
import {SnakeDNA} from "./snakeDNA";
import {Map} from "./map";
import {__} from "./shortHands";

function init() {

    let game = (sketch) => {
        let SNAKE = null;
        let ENVIRONMENT = null;
        let MAP = null;

        let canvas = null;

        let screenHeight = window.innerHeight * 0.8;
        let screenWidth = window.innerWidth * 0.95;

        function restart() {
            SNAKE.reset();
            SNAKE.addTail(10);
            ENVIRONMENT.reset();
            MAP.setLevel(1);
            sketch.loop();
        }

        window.restart = restart;

        function keyPressed(event) {
            switch (event.keyCode) {
                case sketch.UP_ARROW:
                    SNAKE.switchDirection(0, -1);
                    break;
                case sketch.DOWN_ARROW:
                    SNAKE.switchDirection(0, 1);
                    break;
                case sketch.LEFT_ARROW:
                    SNAKE.switchDirection(-1, 0);
                    break;
                case sketch.RIGHT_ARROW:
                    SNAKE.switchDirection(1, 0);
                    break;
            }
        }

        window.keyPressed = keyPressed;

        function swiped(event) {
            switch (event.direction) {
                case 8: //UP
                    SNAKE.switchDirection(0, -1);
                    break;
                case 16: //DOWN
                    SNAKE.switchDirection(0, 1);
                    break;
                case 2: //LEFT
                    SNAKE.switchDirection(-1, 0);
                    break;
                case 4: //RIGHT
                    SNAKE.switchDirection(1, 0);
                    break;
            }
        }


        sketch.setup = () => {
            canvas = sketch.createCanvas(screenWidth, screenHeight);
            canvas.parent("myGameArea");
            ENVIRONMENT = new Environment(screenWidth, screenHeight);
            SNAKE = new SnakeDNA();
            MAP = new Map(ENVIRONMENT, SNAKE);
            SNAKE.setEnvironment(ENVIRONMENT);
            restart();
            sketch.frameRate(30);
            window.location.href = "#";

            //Swipe configuration
            let hammer = new Hammer(__("myGameArea").children[0], {
                preventDefault: true
            });
            hammer.get('swipe').set({
                direction: sketch.DIRECTION_ALL
            });

            hammer.on("swipe", swiped);
        };

        sketch.draw = () => {
            sketch.noStroke();
            sketch.background(51);
            sketch.fill(219, 125, 138);
            MAP.show(sketch);
            sketch.fill(215, 26, 33);
            sketch.stroke(255);
            ENVIRONMENT.showFood(MAP.safePlaceForFood, sketch);
            sketch.noStroke();
            sketch.fill(255);
            SNAKE.gameLoop(sketch);
            if (ENVIRONMENT.isFoodConsumed(SNAKE)) {
                ENVIRONMENT.changeFoodLocation(MAP.safePlaceForFood, sketch);
                SNAKE.addTail();
                SNAKE.addScore(ENVIRONMENT.foodCost);
            }
            if (ENVIRONMENT.isSnakeHitted(SNAKE) || MAP.isSnakeHittedOnWall || ENVIRONMENT.isTimeUp) {
                if (SNAKE.lives > 0)
                    SNAKE.addLife(-1);
                if (SNAKE.lives === 0) {
                    window.location.href = "#gameOver";
                    ENVIRONMENT.stopTimer();
                    sketch.noLoop();
                } else {
                    MAP.resetLevel(MAP.level);
                }
            }

            if (MAP.levelConfig.maxScore <= SNAKE.score) {
                if (!MAP.setLevel(MAP.level + 1) && !SNAKE.isWon) {
                    window.location.href = "#youWon";
                    ENVIRONMENT.stopTimer();
                    SNAKE.isWon = true;
                    sketch.noLoop();
                }
            }
        }

    };
    return new P5(game);
}

export {init}