import dotenv from 'dotenv';
import * as logger from "./logger.mjs";

dotenv.config();

function printHelp(){
	console.info(`
Help for arguments key:
-u --user           -- set USER name for AUTH
-p --pass           -- set PASSWORD for AUTH
-U --url            -- set REST API URL
-c --count          -- set request count
`);
}

export let URL = process.env.URL;
export let USER = process.env.USR;
export let PASS = process.env.PASS;
export let CNT = process.env.REQUEST_COUNT;

if(process.argv.length > 2){
	let i = 2;
	while(i < process.argv.length){
		let argV = process.argv[i];
		const arr = (/^--(user|pass|url|count)=(.*)$/gm).exec(argV) || [];

		switch(true){
			case argV === '--help' || argV === '/h':       //Вывод справки по ключам
				printHelp();
				process.exit(0);

				break;

			case argV === '-u' || arr[1] === 'user':     //
				USER = arr[2] || process.argv[++i];
				if(!USER){
					console.error(`Error in set User name. User name don't be empty.`);
					process.exit(-100);
				}
				break;

			case argV === '-p' || arr[1] === 'pass': //
				PASS = arr[2] || process.argv[++i];
				if(!PASS){
					console.error(`Error in set password. Password don't be empty.`);
					process.exit(-100);
				}
				break;

			case argV === '-U' || arr[1] === 'url': //
				URL = arr[2] || process.argv[++i];
				if(!URL){
					console.error(`Error in set URL. URL don't be empty.`);
					process.exit(-100);
				}
				break;

			case argV === '-c' || arr[1] === 'count': //
				CNT = parseInt(arr[2] || process.argv[++i], 10);
				if(Number.isNaN(CNT) || CNT <= 0){
					console.error(`Error in setting requests count. Count must be greater 0.`);
					process.exit(-100);
				}
				break;

			default:
				console.error(`Unrecognized argument ${arr[1] || argV}. Ignored it.`);
				break;
		}

		i++;
	}
}

export const LOG_ERR_ROTATE = process.env.LOG_ERR_ROTATE || '30d';
export const LOG_ROTATE = process.env.LOG_ERR_ROTATE || '7d';
export const LOG_FILE_MAX = process.env.LOG_FILE_MAX || '100m';

export const LOG_LEV = process.env.LOG_LEV || 'verbose';
