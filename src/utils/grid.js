class Grid {
    constructor() {
        this.roadSize = 1;
        this.buildingsNumber = 8;
        this.buildingMultiplier = 4;
        this.buildingSize = this.roadSize * this.buildingMultiplier;
        this.width = this.buildingsNumber * this.buildingSize + (this.buildingsNumber - 1) * this.roadSize;
        this.height = this.buildingsNumber * this.buildingSize + (this.buildingsNumber - 1) * this.roadSize;
        this.xIndexNumber = this.width / this.roadSize;
        this.yIndexNumber = this.height / this.roadSize;

        this.buildings = this.createBuildings();
        this.graph = this.creteObstaclesGraph(this.buildings);
        this.cells = this.createCells();
    }

    createCells() {
        const cells = [];
        for (let xIndex = 0; xIndex < this.width; xIndex++) {
            for (let yIndex = 0; yIndex < this.height; yIndex++) {
                cells.push({
                    x: xIndex * this.roadSize,
                    y: yIndex * this.roadSize
                })
            }
        }
        return cells
    }

    findClosestRoad(target) {

        for (let i = 1; i <= this.buildingSize; i++) {
            if (!this.isObstacle(target.x, target.y + i)) {
                return ({x: target.x, y: target.y + i});
            }
            if (!this.isObstacle(target.x + i, target.y)) {
                return ({x: target.x + i, y: target.y});
            }
            if (!this.isObstacle(target.x, target.y - i)) {
                return ({x: target.x, y: target.y - i});
            }
            if (!this.isObstacle(target.x - i, target.y)) {
                return ({x: target.x - i, y: target.y});
            }
        }
        return target

    }

    mapTarget(target) {
        if (this.isObstacle(target.x, target.y)) {
            return this.findClosestRoad(target);
        } else {
            return target;
        }
    }


    findPath(start, stop) {
        let current = start;
        const target = this.mapTarget(stop);
        let isNextStepPossible = true;

        const path = [];
        const visited = [current];
        let lastMinDistance = 100000;
        const guard = 100;
        let it = 0;

        while (current !== target && isNextStepPossible && it < guard) {

            const neighbours = this.findNeighbours(current.x, current.y, visited);

            for (const n of neighbours) {
                visited.push(n)
            }

            if (neighbours.length === 0) {
                isNextStepPossible = false
            } else {

                let minDistance = 100000;

                for (const neighbour of neighbours) {
                    const distanceToGoal = this.estimatedDistanceToGoal(neighbour, target);

                    if (distanceToGoal === 0) {
                        isNextStepPossible = false
                    }
                    if (distanceToGoal < minDistance) {
                        current = neighbour;
                        minDistance = distanceToGoal
                    }
                }

                lastMinDistance = minDistance;
                path.push(current);

                it++;
            }
        }
        return path;
    }

    findNeighbours(x, y, visited) {
        const n1 = this.nonObstacleNeighbours(x, y);
        const n2 = n1.filter(n => {
            for (const v of visited) {
                if (v.x === n.x && v.y === n.y) {
                    return false
                }
            }
            return true
        });
        return n2;
    }

    estimatedDistanceToGoal(current, stop) {
        return Math.sqrt(Math.pow(current.x - stop.x, 2) + Math.pow(current.y - stop.y, 2));
    }

    indexesToPixels(xIndex, yIndex) {
        const x = xIndex * this.roadSize;
        const y = yIndex * this.roadSize;

        return {x, y}
    }

    pixelsToIndexes(xPixel, yPixel) {
        const x = xPixel * this.roadSize;
        const y = yPixel * this.roadSize;

        return {x, y}
    }

    nonObstacleNeighbours(xIndex, yIndex) {
        const neighbours = [];

        if (this.isInRange(xIndex - 1, yIndex) && !this.isObstacle(xIndex - 1, yIndex)) {
            neighbours.push({x: xIndex - 1, y: yIndex})
        }

        if (this.isInRange(xIndex, yIndex + 1) && !this.isObstacle(xIndex, yIndex + 1)) {
            neighbours.push({x: xIndex, y: yIndex + 1})
        }

        if (this.isInRange(xIndex + 1, yIndex) && !this.isObstacle(xIndex + 1, yIndex)) {
            neighbours.push({x: xIndex + 1, y: yIndex})
        }

        if (this.isInRange(xIndex, yIndex - 1) && !this.isObstacle(xIndex, yIndex - 1)) {
            neighbours.push({x: xIndex, y: yIndex - 1})
        }

        return neighbours;
    }

    isObstacle(xIndex, yIndex) {
        const obj = '{"x":' + xIndex + ',"y":' + yIndex + '}';
        return this.graph.get(obj);
    }

    isInRange(xIndex, yIndex) {
        return xIndex >= 0 && xIndex < this.xIndexNumber && yIndex >= 0 && yIndex < this.yIndexNumber;
    }

    createBuildings() {
        const buildings = [];
        for (let xIndex = 0; xIndex < this.buildingsNumber; xIndex++) {
            for (let yIndex = 0; yIndex < this.buildingsNumber; yIndex++) {
                buildings.push({
                    x: xIndex * this.buildingSize + xIndex * this.roadSize,
                    y: yIndex * this.buildingSize + yIndex * this.roadSize
                })
            }
        }
        return buildings
    }

    creteObstaclesGraph(buildings) {
        const graph = new Map();

        for (const building of buildings) {
            for (let xIndex = 0; xIndex < this.buildingMultiplier; xIndex++) {
                for (let yIndex = 0; yIndex < this.buildingMultiplier; yIndex++) {
                    graph.set(JSON.stringify({
                        x: building.x / this.roadSize + xIndex,
                        y: building.y / this.roadSize + yIndex
                    }), true)
                }
            }

            for (let index = 0; index < this.buildingMultiplier; index++) {

                const x = building.x / this.roadSize + this.buildingMultiplier;
                const y = building.y / this.roadSize + index;

                if (x < this.width && y < this.height) {
                    graph.set(JSON.stringify({x, y}), false)
                }
            }

            for (let index = 0; index < this.buildingMultiplier; index++) {

                const x = building.x / this.roadSize + index;
                const y = building.y / this.roadSize + this.buildingMultiplier;

                if (x < this.width && y < this.height) {
                    graph.set(JSON.stringify({x, y}), false)
                }
            }

            const x = building.x / this.roadSize + this.buildingMultiplier;
            const y = building.y / this.roadSize + this.buildingMultiplier;

            if (x < this.width && y < this.height) {
                graph.set(JSON.stringify({x, y}), false)
            }
        }

        return graph;
    }

}

const grid = new Grid();
export default grid;