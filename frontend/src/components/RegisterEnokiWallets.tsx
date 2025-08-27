import {
	useSuiClientContext,
} from '@mysten/dapp-kit';
import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';
import { useEffect } from 'react';

function RegisterEnokiWallets() {
	const { client, network } = useSuiClientContext();
 
	useEffect(() => {
		if (!isEnokiNetwork(network)) return;
 
		const { unregister } = registerEnokiWallets({
			apiKey: 'enoki_public_4cadf20f88ad92b1ee7a644902505517',
			providers: {
				// Provide the client IDs for each of the auth providers you want to use:
				google: {
					clientId: '989645441623-aqepkn65v75rqj01mnie982irt13t3ec.apps.googleusercontent.com',
				},
			},
			client,
			network,
		});
 
		return unregister;
	}, [client, network]);
 
	return null;
}

export default RegisterEnokiWallets