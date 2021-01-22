
const MNEMONIC = 'type attend loan kite debate liar board actual symbol speak year tourist';

module.exports = {
  networks: {
    development: {
	    host: "127.0.0.1",     // LOCALHOST (DEFAULT: NONE)
	    port: 7546,            // STANDARD ETHEREUM PORT (DEFAULT: NONE)
	    network_id: 5778       // ANY NETWORK (DEFAULT: NONE)
    }
  },
  ///contracts_directory: '.front/src/contracts/',
  contracts_build_directory: './front/src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
};