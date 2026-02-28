/**
 * useWallet Hook
 * Manages Seeker wallet connection via Mobile Wallet Adapter
 */

import { useState, useCallback, useEffect } from 'react';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

interface WalletState {
  address: string | null;
  publicKey: PublicKey | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

const APP_IDENTITY = {
  name: 'SolPulse',
  uri: 'https://solpulse.app',
  icon: 'favicon.png',
};

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    publicKey: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  /**
   * Connect to the Seeker wallet
   */
  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      await transact(async (wallet: Web3MobileWallet) => {
        // Authorize with the wallet
        const authResult = await wallet.authorize({
          identity: APP_IDENTITY,
          cluster: 'mainnet-beta',
        });

        const publicKey = new PublicKey(authResult.accounts[0].address);

        setState({
          address: publicKey.toBase58(),
          publicKey,
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, []);

  /**
   * Disconnect the wallet
   */
  const disconnect = useCallback(() => {
    setState({
      address: null,
      publicKey: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  /**
   * Sign and send a transaction through the wallet
   */
  const signAndSendTransaction = useCallback(
    async (transaction: Transaction | VersionedTransaction): Promise<string> => {
      if (!state.isConnected) {
        throw new Error('Wallet not connected');
      }

      let signature = '';

      await transact(async (wallet: Web3MobileWallet) => {
        // Re-authorize for transaction signing
        await wallet.authorize({
          identity: APP_IDENTITY,
          cluster: 'mainnet-beta',
        });

        // Sign and send
        const result = await wallet.signAndSendTransactions({
          transactions: [
            transaction instanceof Transaction
              ? transaction.serialize()
              : transaction.serialize(),
          ],
        });

        signature = result[0] ? Buffer.from(result[0]).toString('base64') : '';
      });

      return signature;
    },
    [state.isConnected]
  );

  /**
   * Sign a message (for verification)
   */
  const signMessage = useCallback(
    async (message: Uint8Array): Promise<Uint8Array> => {
      if (!state.isConnected) {
        throw new Error('Wallet not connected');
      }

      let signedMessage = new Uint8Array();

      await transact(async (wallet: Web3MobileWallet) => {
        await wallet.authorize({
          identity: APP_IDENTITY,
          cluster: 'mainnet-beta',
        });

        const result = await wallet.signMessages({
          addresses: [state.address!],
          payloads: [message],
        });

        signedMessage = result[0];
      });

      return signedMessage;
    },
    [state.isConnected, state.address]
  );

  return {
    ...state,
    connect,
    disconnect,
    signAndSendTransaction,
    signMessage,
  };
}

export default useWallet;
