import { getFullnodeUrl } from '@mysten/sui/client';

const networks = {
	testnet: { 
		url: getFullnodeUrl('testnet'),
		variables: {
			packageId: '0x20ea52980aa8f2d53ade0cf1461e7d9b6fc030137e541cfed1bd203ecbaf3484',
			contractObjectId: '0x4f34bf51146c28a8cfce3376dd255a637df43d3380fd58803668517ee410f659'
		}
	},
};

export default networks