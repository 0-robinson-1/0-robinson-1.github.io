// src/solana.ts

import { Connection, clusterApiUrl } from '@solana/web3.js';

// RPC_ENDPOINT points at Solana Devnet (more reliable for airdrops)
export const RPC_ENDPOINT = clusterApiUrl('devnet');

// The shared connection object for all Solana calls
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');