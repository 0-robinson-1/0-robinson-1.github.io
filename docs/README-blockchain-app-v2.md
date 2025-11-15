# RobinSon Blockchain-app V2

**Work in Progress**
Blockchain-app V1 that gets rewritten to incorporate RobinSon coins in the wallet. Also completely rewrite the innerworkings of the current app so that RobinSon coin can be transferred through wallets and set up a system so that users get test net Sol auto airdropped, this they need to pay the fees to send RobinSon Coins on Solana test net, but more on that later... 

Author:
RobinSon

## Table of Contents
- [Abstract](#abstract)
- [1. Introduction](#1-introduction)
- [2. RobinSon Coins](#2-robinson-coins)
- [3. App Architecture](#3-app-architecture)

## Abstract

The website 0-robinson-1.github.io is my coding portfolio, in it I created a blockchain-app where I build a wallet that runs on Solana test net. At the moment the users of my blockchain-app V1 can create their own wallet, request an airdrop for test net Sol, and send and receive test net Solana to other users of my blockchain-app (and all other wallets on Solana test net).

## 1. Introduction

Blockchain-app V1 works but I am running into some issues...  
Before I had the app running on Solana Dev net but one day I woke up and all the balances of my test wallets got wiped and all the balances were 0 because of a reset/ restart of Dev net.  
I then switched to test net and now things are stabler because test net itself is much more stable. The wallet in my blockchain-app V1 is fully functional and users can send and receive test net Sol...

The issue that I am having is that when a user of my wallet requests an airdrop, half of the times it goes through and the user receives airdropped test net Sol. But the other times, the airdop fails because the public Solana faucet runs dry. It runs dry because a certain amount of test net Sol have allready been requested within a certain time frame, this is a mechanism to prevent abuse of the faucet. A couple of hours later the faucet gets reset and users can airdrop themselve test net Sol again, this in itself is good but during this down time users of my wallet can not request anymore Sol to send or pay the fees of their transactions with. This is a major flaw and needs to be addressed...

Another issue I am having is that when a wallet has a balance of 0 Sol, that wallet will end up being deleted by the chain. So if a user of my blockchain-app sends out all their test net Sol, their wallet will be deleted and it can not be used anymore. This to needs fixing...

## 2. RobinSon Coins

I recently created a couple of RobinSon coins on Solana test net.

|Token|Ticker|address|Supply|Tokenprogram|
|:---:|:---:|:---:|:---:|:---:|
|robinson|0R1|6LQoeQhiN4jKELv2vWoZMY4tRbDpFCMz2YKBhEVYXp7h|888888|Token2022|
|RobinSon Coin|RS|6hZvLyLLS3JgjxoPfEfrSJv5q1MPxQE5RExzMoLhURYX|888888|SPL|

I will use one of these coins to power my blockchain-app and have it be the coin that can get transferred in the wallets of my blockchain-app!

## 3. App Architecture

New wallets come with 10 robinson coins and 1 testnet Sol. Robinson coins are the currency in the blockchain-app and testnet Sol is there to pay for the transaction fees for sending 0R1 (robinson).  
These 2 coins each have their own way of getting to the user and they determine the Apps Architecture.

## 3.1 Test net Sol

Each new wallet receives 1 Sol.  
This Sol comes from a pool of test net Sol that gets topped up by a script that triggers Solana faucet. 

## 3.2 0R1

0R1 (robinson token) gets send out with every new wallet or when a user requests a new 0R1 air drop.


## Braindump
-Can I use Solana Mobile Expo to create a Solana mobile app with Expo and **React Native**?
-Work on branch "blockchain-app-v2"
