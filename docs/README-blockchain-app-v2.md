# RobinSon Blockchain-app V2 - Architecture & Design

**Author:
RobinSon**

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. V1 Shortcomings](#2-v1-shortcomings)
- [3. V2 Architecture](#3-v2-architecture)
        - [3.1 Goals of V2](#31-goals-of-v2)
        - [3.2 RobinSon Coins](#32-robinson-coins)
        - [3.3 Wallet](#33-wallet)
        - [3.4 Solana Mobile Expo](#34-solana-mobile-expo)
        - [3.5 High-Level Architecture Diagram](#35-high-level-architecture-diagram)
        - [3.6 Treasury](#36-treasury)
        - [3.7 Auto-refill](#37-auto-refill)
        - [3.8 0R1 airdrop](#38-0r1-airdrop)

## 1. Introduction

The website 0-robinson-1.github.io is my coding portfolio, in it I created a blockchain-app where I build a wallet that runs on Solana test net. At the moment the users of my blockchain-app V1 can create their own wallet, request an airdrop for test net Sol, and send and receive test net Solana from other users of my blockchain-app (and all other wallets on Solana test net).  

I will rewrite Blockchain-app V1 to incorporate RobinSon coins in the wallet. Also I will completely rewrite the innerworkings of the current app so that RobinSon coin can be transferred through wallets and set up a system so that users get test net Sol auto airdropped, this they need to pay the fees to send RobinSon Coins on Solana test net, but more on that later...

## 2. V1 Shortcomings

Blockchain-app V1 works but I am running into some issues...  
Before I had the app running on Solana Dev net but one day I woke up and all the balances of my test wallets got wiped and the balances were 0 because of a reset/ restart of Dev net.  
I then switched to test net and now things are stabler because test net itself is much more stable. The wallet in my blockchain-app V1 is fully functional and users can send and receive test net Sol...

The issue that I am having is that when a user of my wallet requests an airdrop, half of the times it goes through and the user receives airdropped test net Sol. But the other times, the airdop fails because the public Solana faucet runs dry. It runs dry because a certain amount of test net Sol have allready been requested within a certain time frame, this is a mechanism to prevent abuse of the faucet. A couple of hours later the faucet gets reset and users can airdrop themselve test net Sol again, this in itself is good but during this down time users of my wallet can not request anymore Sol to send or pay the fees of their transactions with. This is a major flaw and needs to be addressed...

Another issue I am having is that when a wallet has a balance of 0 Sol, that wallet will end up being deleted by the chain. So if a user of my blockchain-app sends out all their test net Sol, their wallet will be deleted and it can not be used anymore. This to needs fixing...

## 3. V2 Architecture

New wallets come with 10 robinson coins and 1 testnet Sol. Robinson coins are the currency in the blockchain-app and testnet Sol is there to pay the transaction fees for sending 0R1 (robinson).  
These 2 coins each have their own way of getting to the user and they determine the Apps Architecture.

## 3.1 Goals of V2

1. Users must always be able to send 0R1 tokens (our app coin) even if public faucets are dry.
2. New wallets are instantly usable (have both 0R1 and enough testnet SOL for fees).
3. Wallets never get “rent-deleted” because of 0 SOL balance.
4. Prevent faucet abuse but keep the app feel “free” for real users.
5. Focus only on 0R1 token transfers (no SOL transfers between users any more).

## 3.2 Robinson Coins

I recently created a couple of RobinSon coins on Solana test net.

|Token|Ticker|address|Supply|Tokenprogram|
|:---:|:---:|:---:|:---:|:---:|
|robinson|0R1|6LQoeQhiN4jKELv2vWoZMY4tRbDpFCMz2YKBhEVYXp7h|888888|Token2022|
|RobinSon Coin|RS|6hZvLyLLS3JgjxoPfEfrSJv5q1MPxQE5RExzMoLhURYX|888888|SPL|

I will use 0R1 to power my blockchain-app and have it be the coin that can get transferred in the wallets of my blockchain-app!  

0R1 (robinson token) gets send out with every new wallet or when a user requests a new air drop.  

Each new wallet receives 1 Sol.  
This Sol comes from a pool of test net Sol that gets topped up by a script that triggers Solana faucet. 

## 3.3 Wallet

Wallet Lifecycle:
Create: Generate keypair, store in DB, auto-airdrop 1 SOL + 10 0R1 (create ATAs if needed).
Low Balance: Auto-detect SOL <0.2 → public airdrop attempt → treasury fallback.
Send/Receive: 0R1 tokens; no more SOL transfers possible. (this is a test wallet and I will focus on 0R1 token)

Frontend: React/TS web app as base. Optional: Extend to mobile with React Native/Expo.
Backend: Vercel functions for storage/airdrops. Add rate limiting (e.g., per-user daily caps).
Security/Abuse Prevention: KV-tracked timestamps for airdrops (e.g., 1 SOL/day/user, 10 0R1/week/user). Monitor treasury via Solana explorer.

## 3.4 Solana Mobile Expo

Frameworks: Expo, React Native
Solana SDKs: @solana/web3.js
Wallet Adapters: Mobile Wallet Adapter

-Can I use Solana Mobile Expo to create a Solana mobile app with Expo and **React Native**?  

    PRO's:  -Compatibility with GitHub Pages Portfolio.
            -Cross-Platform Development: Write once, run anywhere...  
            -Built-in Solana Tools + Expo ecosystem benifits + Templates. 
            -Mobile-First Focus.

    CON's:  -Expo web works well for basic dApps, not as polished as native frameworks (Vite/React).
            -Larger overhead: React Native bundles are bigger (~10-20MB vs. v1's <1MB), slower loads.
            -Dependency Management: Getting locked into Expo SDK (v51+ as of 2025).
            -Build and Deployment Friction: Web builds require expo export:web or EAS, which outputs static files but may need tweaks for GitHub Pages (e.g., handling routing).

**-->Created the scaffolding for the Mobile app using Solana Expo's blank-typescript template on 16-11-25, I tested and it worked well.**

### 3.5 High-Level Architecture Diagram

```text
+----------------------------+        HTTPS       +-------------------------+        RPC       +------------------+
|  Mobile Expo React Native  | -----------------> |  Vercel Serverless API  | ---------------> |  Solana Testnet  |
+--------------+-------------+                    +------------+------------+                  +---------v--------+
               ^                                               ^                                         ^
               |                                               |                                         |
               |                                               |                                         |   
        +------v------+                                  +-----v------+                                  |
        | User Wallet |                                  |  Database  |                                  |
        +------v------+                                  +------------+                                  |
               |                                                                                         |
               |                                                                                         |
    +----------v-------------+                                                                           |
    |    Treasury Wallet:    |                                                                           |
    |     • 100 test net SOL |                                                                           |
    |     • 10000 0R1        |                                                                           |
    +----------v-------------+                                                                           |  
               |                                                                                         |
               |                                                                                         |
               +-------------------------------------- Auto-refill Vercel Cron --------------------------+
                                                 Check Treasury Wallet every 5–10 min
                                                   Requests public faucet < 200 SOL
```

## 3.6 Treasury

The Treasury lies at the heart of the blockchain-app, some off the main shortcomings of V1 can be overcome by introducing a Treasury!  
The biggest issue with V1 was the Solana test net faucet running dry and users of my wallet getting an error when requesting a SOL airdrop. When users don't have SOL to send or pay the fees with, the wallet is useless...  
By setting up a Treasury Wallet which holds 10000 0R1 and 100 SOL, a couple of things can be accomplished. On the one hand when users run out of 0R1 or just want some extra, they can request an airdrop and the treasury account can supply these tokens.  
On the other hand a auto-refill system can be set up through Vercel Cron jobs were, if a wallet runs out of test net SOL, 1 SOL will be automatically send from the treasury to this wallet.
Test net SOL is what is required to pay the fees for interacting with the Solana test net chain.  
0R1 (robinson coin) lives on Solana test net so every time 0R1 gets send, a tiny bit of SOL needs to be paid as a transaction fee. The user of my wallet will not see this SOL nor will they know anything about it... For the purpose of this blockchain-app demo for my coding portfolio, the users need to be able to send and receive robinson coins without having to worry about SOL to pay the fees. In the background this will be taken care off by Vercel Cron jobs through an auto-refill which tops up all wallets periodically.

## 3.7 Auto-refill

The SOL test net Auto-refill will be done by Vercel Cron jobs, a event-driven auto-refill using Alchemy's Address Activity webhooks.   
Options for this would be using The Graph Studio, Subsquid Cloud, Covalent API or Alchemy Notify...  
Since I am building on Solana test net for my blockchain-app, the best fit from the stack is Alchemy Notify with Address Activity webhooks. This keeps the event-driven architecture intact (on-chain events → webhook → Vercel function → balance check & auto-refill) while being zero-cost and Solana-native!  

Alchemy Notify supports full DAS APIs for Solana test net. It is Solana-optimised with webhooks that fire on wallet activity (e.g. token transfers or SOL balance drops), this is good for triggering the auto-refill without custom indexing code. Alchemy's Solana Testnet endpoints are battle-tested for dev workflows and get instant notifications on test SOL/token events without rate limits and it is for free unlimited in the free tier.

## 3.8 0R1 airdrop

0R1 (robinson coin) is the means of transacting within the RobinSon blockchain-app.  
Users of the wallet can send robinson coins to each other, when they run out or just like to have some more they can request an airdrop of 10 0R1.  

### How the Airdrop Works

- Each wallet can request **10 0R1** every **8 hours**.  
- Protected by Cloudflare Turnstile (invisible CAPTCHA) – zero friction, blocks bots.  
- All requests are validated on-chain: no double-spending, no abuse.  
- Transactions are submitted via Versioned Transactions and confirmed with Priority Fees for fast inclusion.  
- Full history visible in the app.

### Tech Stack

- Frontend: React + custom hook (`useFaucet`).  
- Backend: Vercel Serverless Function (`/api/faucet`).  
- Rate-limiting: Vercel KV (Redis) + wallet address as key.  
- CAPTCHA: Cloudflare Turnstile (free, privacy-friendly).  
- Transaction building: `@solana/web3.js` + SPL transfer from a dedicated faucet key.  

### Braindump
-Work on branch "blockchain-app-v2"