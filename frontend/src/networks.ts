import { getFullnodeUrl } from '@mysten/sui/client';

const networks = {
	testnet: { 
		url: getFullnodeUrl('testnet'),
		variables: {
			packageId: '0x8ccbef13ae88374373da7e43d4e3695511cce0ae5a290e1c43be7855e1bcd8c0',
			contractObjectId: '0x1b836773f29de582762a3f101c3ce27583be9dd7cb9ede3aefba2caa080d38cd',
			sponsorAddress: '0x4c62d8d6b58e2df954b94ba14de5450434e33e8d11cf7b3fb0e7464547661aa4'
		}
	},
};

export default networks