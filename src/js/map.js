import {Vector} from "./vector";
import {__} from "./shortHands";

export class Map {
    constructor(environment, snake) {
        this.environment = environment;
        this.snake = snake;
        this.level = null;
        this.levelConfig = null;
        this.levelMap = null;
        this.isSnakeHittedOnWall = false;
        this.safePlaceForFood = null;
    }

    resetLevel(level) {
        this.level = level;
        this.levelConfig = eval(`this.__level${level}Config()`);
        this.levelMap = eval(`this.__level${this.level}Map`);
        this.snake.position[0].copy(this.levelConfig.snakeInitPosition);
        this.environment.resetTimer("__timer", this.levelConfig.time);
        __("__level").innerText = this.level;
        __("__scoreNeed").innerText = this.levelConfig.maxScore;
    }

    setLevel(level) {
        try {
            this.resetLevel(level);
            this.snake.addLife(this.levelConfig.extraLife);

            return true;
        } catch (e) {
            return false;
        }
    }

    __level1Config() {
        return {
            snakeInitPosition: new Vector(0, 0),
            maxScore: 20,
            time: 20,
            extraLife: 2
        };
    }

    __level1Map(i, j, maxi, maxj, step) {
        return false;
    }

    __level2Config() {
        return {
            snakeInitPosition: new Vector(Math.round(this.environment.size.x / 2), Math.round(this.environment.size.y / 2)),
            maxScore: 50,
            time: 60,
            extraLife: 2
        };
    }

    __level2Map(i, j, maxi, maxj, step) {
        return (i === 0 || j === 0 || (j + step + step) >= maxj || (i + step + step) >= maxi
            || (j >= Math.round(maxj / 3) && j <= Math.round(maxj / 2.5) && i >= Math.round(maxi / 3) && i <= Math.round(maxi / 2.3))
            || (j >= Math.round(maxj / 0.36) && j <= Math.round(maxj / 0.3) && i >= Math.round(maxi / 3) && i <= Math.round(maxi / 0.3)));
    }

    __level3Config() {
        return {
            snakeInitPosition: new Vector(Math.round(this.environment.size.x / 2), Math.round(this.environment.size.y / 2)),
            maxScore: 150,
            time: 80,
            extraLife: 2
        };
    }

    __level3Map(i, j, maxi, maxj, step) {
        return (i === 0 || j === 0 || (j + step + step) >= maxj || (i + step + step) >= maxi
            || (j >= Math.round(maxj / 4) && j <= Math.round(maxj / 3.5) && i >= Math.round(maxi / 4) && i <= Math.round(maxi / 1.3))
            || (j >= Math.round(maxj / 1.36) && j <= Math.round(maxj / 1.3) && i >= Math.round(maxi / 4) && i <= Math.round(maxi / 1.3)));
    }

    __level4Config() {
        return {
            snakeInitPosition: new Vector(Math.round(this.environment.size.x / 2), Math.round(this.environment.size.y / 2)),
            maxScore: 250,
            time: 120,
            extraLife: 2
        };
    }

    __level4Map(i, j, maxi, maxj, step) {
        return (i === 0 || j === 0 || (j + step + step) >= maxj || (i + step + step) >= maxi
            || (j >= Math.round(maxj / 6) && j <= Math.round(maxj / 3) && i >= Math.round(maxi / 6) && i <= Math.round(maxi / 3))
            || (j >= Math.round(maxj / 3) && j <= Math.round(maxj / 2.5) && i >= Math.round(maxi / 2))
            || (j >= Math.round(maxj / 5.36) && j <= Math.round(maxj / 4.3) && i >= Math.round(maxi / 1.3))
            || (j >= Math.round(maxj / 2) && j <= Math.round(maxj / 1.5) && i >= Math.round(maxi / 15) && i <= Math.round(maxi / 5.3))
            || (j >= Math.round(maxj / 1.36) && j <= Math.round(maxj / 1.3) && i >= Math.round(maxi / 4) && i <= Math.round(maxi / 1.3)));
    }


    show(sketch) {
        let vectorList = [];
        this.isSnakeHittedOnWall = false;
        let maxi = this.environment.size.x;
        let maxj = this.environment.size.y;
        let step = this.environment.foodScale;

        for (let i = 0; i < maxi; i += step)
            for (let j = 0; j < maxj; j += step)
                if (this.levelMap(i, j, maxi, maxj, step)) {
                    sketch.rect(i, j, step, step);
                    if (this.environment.isCollide(new Vector(i, j), step, this.snake.position[0], this.snake.scale))
                        this.isSnakeHittedOnWall = true;
                } else {
                    vectorList.push(new Vector(i, j));
                }
        let index = Math.round(sketch.random(vectorList.length - 1));
        this.safePlaceForFood = vectorList[index];
    }
}