export const contractAbi = [
  {
    type: 'function',
    name: 'mintNFT',
    stateMutability: 'payable',
    inputs: [{ internalType: 'address', name: 'recipient', type: 'address'}, { internalType: 'string', name: 'tokenURI', type: 'string'}],
    outputs: [],
  },
] as const