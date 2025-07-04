import { listWallets, getWallet } from './storage';

async function testStorage() {
  console.log('Testing storage API...');
  try {
    const wallets = await listWallets();
    console.log('Available wallets:', wallets);

    for (const id of wallets) {
      const walletData = await getWallet(id);
      console.log(`Data for wallet ${id}:`, walletData);
    }
  } catch (error) {
    console.error('Storage test error:', error);
  }
}

testStorage().catch(console.error);