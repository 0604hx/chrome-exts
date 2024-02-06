import dayjs from 'dayjs'

const COLORS = {"INFO":"#2080f0", "DEBUG":"#8c0776", "ERROR":"#d03050"}

/**
 *
 * @param {String} level
 * @param  {...any} ps
 * @returns
 */
const log = (level, ...ps)=> console.debug(`%c${dayjs(new Date).format("HH:mm:ss")} ${level}`, `color:${COLORS[level]};font-weight:500;`, ...ps)

export default {
    info    : (...ps)=> log("INFO", ...ps),
    debug   : (...ps)=> log("DEBUG", ...ps),
    error   : (...ps)=> log("ERROR", ...ps)
}
