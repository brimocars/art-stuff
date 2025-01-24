// TODO: Figure out importing an external file into a sketch.js. For now, I'm just copying by project.

/**
 * Gets an array of random numbers between min (inclusive) and max (exclusive)
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} howManyInts
 */
export function getRandomInts(min, max, howManyInts) {
    const numbers = [];
    for (let i = 0; i < howManyInts; i++) {
        numbers.push(Math.floor(Math.random() * (max - min) + min));
    }
    return numbers;
}