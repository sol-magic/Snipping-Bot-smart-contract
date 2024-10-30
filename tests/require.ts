import { PublicKey } from "@solana/web3.js";

export interface Treasure {
    admin: PublicKey;
    collection: PublicKey;
  }
  
  export interface User {
    owner: PublicKey;
    refferal?: PublicKey | null;
    refferalNumbers: number;
  }
  
  export interface BotRole {
    addresses: PublicKey[];
  }
  
  export interface Order {
    open: boolean;
    orderType: number;
    owner: PublicKey;
    holder: boolean;
    rpc: string;
    side:boolean;
    fromToken: PublicKey;
    fromTokenAta: PublicKey;
    toToken: PublicKey;
    toTokenAta: PublicKey;
    amount: number;
    amountExpected: number;
    interval: number;
    slippageBips: number;
    limit: number;
    timestamp: number;
    orders: number;
    fill: number;
  }