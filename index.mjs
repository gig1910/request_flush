import fetch from 'node-fetch';
import * as logger from './common/logger.mjs'
import {obj2json} from "./common/logger.mjs";

import {URL, CNT, USER, PASS} from './common/const.mjs';

const names = [
	'Audition',
	'Role',
	'Team',
	'AdvisoryBoard',
	'CarbonCreditContract',
	'CarbonFootprintFactory',
	'CarbonOffsetContract',
	'FCEBridge',
	'RegisterWalletFactory',
	'EthereumBridge',
	'RegisterWallet',
	'SimplePaymentFactory',
	'CentralBank',
	'RewardValidator',
	'Claim',
	'RolesFactory',
	'System',
	'CarbonOffsetFactory',
	'HashStorage',
	'TeamRewards',
	'CarbonFootprint',
	'EcosystemDevelopment',
	'WrappedFCEM',
	'SocialProjects',
	'Founder',
	'STUB'
];
const pool = {};

let reqID = 0;

const addReq = () => {
	if(Object.keys(pool).length < CNT){
		const id = ++reqID;

		logger.log(`${id}: send request...`);

		const cName = names[Math.floor(Math.random() * names.length)];
		const withBytecode = Math.random() > 0.9;
		const data = {"id": id, "method": "getContractDetail", "name": cName, "bytecode": withBytecode};
		const headers = {
			'Content-Type': 'application/json'
		};
		if(USER){
			headers.Authorization = `Basic ${btoa(`${USER}:${PASS}`)}`;
		}

		pool[id] = fetch(URL, {
			method: 'POST',                 // *GET, POST, PUT, DELETE, etc.
			mode: 'cors',                   // no-cors, *cors, same-origin
			cache: 'no-cache',              // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin',     // include, *same-origin, omit
			headers: headers,
			redirect: 'follow',             // manual, *follow, error
			referrerPolicy: 'no-referrer',  // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: obj2json(data)            // body data type must match "Content-Type" header
		})
			.then(async req => {
				if(req){
					if(req.ok){
						const answer = await req.text();
						try{
							const data = JSON.parse(answer);

							if(parseInt(data?.id, 10) === id){
								if(data?.name === name){
									if(!withBytecode || withBytecode && !!data?.bytecode){
										logger.log(`${id}: Success answer`);

									}else{
										logger.warn(`${id}: WRONG REQUEST ANSWER. bytecode not equals...`);
									}

								}else{
									logger.warn(`${id}: WRONG REQUEST ANSWER. name not equals...`);
								}

							}else{
								logger.warn(`${id}: WRONG REQUEST ANSWER. ID not equals...`);
							}

						}catch(err){
							logger.warn(`${id}: WRONG REQUEST ANSWER. ANSWER IS NOT JSON.`);
							logger.warn(err.message || err);
							logger.warn(answer);
						}

					}else{
						logger.warn(`${id}: ERROR RESPONSE FROM REQUEST ${req.status}: ${req.statusText}`);
					}

				}else{
					logger.warn(`${id}: NOT RESPONSE FROM REQUEST`);
				}

				delete pool[id];
				addReq();
			})
			.catch(err => {
				logger.warn(`${id}: REQUEST ERROR`);
				logger.warn(err.message || err);

				delete pool[id];
				addReq();
			});

		return true;
	}

	return false;
}

async function main(){
	if(!URL){
		logger.error(`URL is not defined in ENV or not set from arguments`);
		process.exit(-100);
	}

	if(!(CNT > 0)){
		logger.error(`Request count is not defined in ENV or not set from arguments`);
		process.exit(-100);
	}

	while(addReq()){}
}

(async() => await main())();
