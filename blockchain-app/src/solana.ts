// src/solana.ts

import { Connection, clusterApiUrl } from '@solana/web3.js';

// RPC_ENDPOINT points at Solana Testnet
export const RPC_ENDPOINT = clusterApiUrl('testnet');

// The shared connection object for all Solana calls
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Debug log to confirm the endpoint (moved here after declaration)
console.log('Solana RPC endpoint →', RPC_ENDPOINT);