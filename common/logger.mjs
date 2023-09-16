/* jshint -W030 */

import winston from 'winston';
import winston_daily_rotate_file from 'winston-daily-rotate-file';
import {LOG_ERR_ROTATE, LOG_FILE_MAX, LOG_LEV, LOG_ROTATE} from './const.mjs';

const _winston_daily_rotate_file = winston_daily_rotate_file;

const ERR = 0;
const WRN = 1;
const INF = 2;
const LOG = 3;
const VRB = 4;
const DBG = 5;
const TRC = 6;

/**
 * Serilaisation into JSON
 * @param {*} obj
 * @return {string}
 */
export function obj2json(obj){
	return obj ?
		typeof (obj) === 'object' ?
			JSON.stringify(obj, obj instanceof Error ? Object.getOwnPropertyNames(obj) : null, '') :
			`{value: ${typeof (obj) === 'string' ? `"${obj}"` : String(obj)}}` :
		obj;
}

const logLevels = [
	{id: ERR, name: 'error'},
	{id: WRN, name: 'warn'},
	{id: INF, name: 'info'},
	{id: LOG, name: 'http'},
	{id: VRB, name: 'verbose'},
	{id: DBG, name: 'debug'},
	{id: TRC, name: 'silly'}
];

const logLev = logLevels.find(el => el?.name === LOG_LEV)?.id || 4;

const transport_log = new winston.transports.DailyRotateFile({
	level: LOG_LEV, filename: 'logs/log-%DATE%.log', datePattern: 'YYYY-MM-DD-HH', zippedArchive: true, maxSize: LOG_FILE_MAX, maxFiles: LOG_ROTATE
});

const transport_error = new winston.transports.DailyRotateFile({
	level: 'error', filename: 'logs/error-%DATE%.log', datePattern: 'YYYY-MM-DD-HH', zippedArchive: true, maxSize: LOG_FILE_MAX, maxFiles: LOG_ERR_ROTATE
});

const transport_exception = new winston.transports.DailyRotateFile({
	level: 'error', filename: 'logs/exception-%DATE%.log', datePattern: 'YYYY-MM-DD-HH', zippedArchive: true, maxSize: LOG_FILE_MAX, maxFiles: LOG_ERR_ROTATE
});

const logger = winston.createLogger({
	level: LOG_LEV, format: winston.format.simple(),
	transports: [transport_log, transport_error], exceptionHandlers: [transport_exception]
});

if(process.env.NODE_ENV !== 'prod'){
	logger.add(new winston.transports.Console({level: LOG_LEV, format: winston.format.simple()}));
}

/**
 * Error log
 * @param {String|Error} err
 */
export function error(err){
	logger.error(`error:`);
	logger.error(err);
	err?.stack && logger.error(err?.stack);
}

/**
 * Логирование Warning
 * @param {String}   msg
 * @param {?Object} [obj]
 */
export function warn(msg, obj){
	if(logLev >= 1){
		logger.warn(`${msg || obj2json(obj)}`);
		msg && obj && logger.warn(`${obj2json(obj)}`);
	}
}

/**
 * Логирование Info
 * @param {String}   msg
 * @param {?Object} [obj]
 */
export function info(msg, obj){
	if(logLev >= 2){
		logger.info(`${msg || obj2json(obj)}`);
		msg && obj && logger.info(`${obj2json(obj)}`);
	}
}

/**
 * Логирование Log
 * @param {String}   msg
 * @param {?Object} [obj]
 */
export function log(msg, obj){
	if(logLev >= 3){
		logger.log('http', `${msg || obj2json(obj)}`);
		msg && obj && logger.log('http', `${obj2json(obj)}`);
	}
}

/**
 * Логирование Verbose
 * @param {String}   msg
 * @param {?Object} [obj]
 */
async function verbose(msg, obj){
	if(logLev >= 4){
		logger.log('verbose', `${msg || obj2json(obj)}`);
		msg && obj && logger.log('verbose', `${obj2json(obj)}`);
	}
}

/**
 * Логирование Debug
 * @param {String}   msg
 * @param {?Object} [obj]
 */
export function debug(msg, obj){
	if(logLev >= 5){
		logger.log('debug', `${msg || obj2json(obj)}`);
		msg && obj && logger.log('debug', `${obj2json(obj)}`);
	}
}

/**
 * Логирование Trace
 * @param {String}   msg
 * @param {?Object} [obj]
 */
export function trace(msg, obj){
	if(logLev >= 6){
		logger.log('silly', `${msg || obj2json(obj)}`);
		msg && obj && logger.log('silly', `${obj2json(obj)}`);
	}
}

/**
 * Логирование Dir
 * @param {*}   obj
 */
export function dir(obj){
	if(logLev >= 4){
		logger.verbose(`${obj2json(obj)}`);
	}
}

//------------------------------

export default {error, warn, info, log, verbose, debug, trace, dir};
