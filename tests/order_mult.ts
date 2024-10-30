import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Bozo } from "../target/types/bozo";
import { TOKEN_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createInitializeMintInstruction, MINT_SIZE } from '@solana/spl-token';
import { PublicKey,sendAndConfirmTransaction,SystemProgram ,Connection,ComputeBudgetProgram} from "@solana/web3.js";
import { BN } from "bn.js";
import {
  getAssociatedPoolKeys,
  getMarket,
  getVaultOwnerAndNonce,
  sleep
} from "./util";
import { Order,Treasure } from "./require"
import { readContracts } from "./start"
const marketInfo = {
  programId: new PublicKey("11111111111111111111111111111111"),
  serumDexProgram: new PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj"),
  ammProgram: new PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8"),
  serumMarket: new PublicKey("J1oKpxWJFHwSEHyfVfQ5eGKz2RnUUpZjYAbGBVhU8xgM"),
}

describe("bozo", () => {
  const con = new Connection("https://api.devnet.solana.com");
  const provider = anchor.AnchorProvider.env();
  const wallet = anchor.Wallet.local().payer;
  marketInfo.programId = new PublicKey(readContracts("contract.txt")[0]);
  anchor.setProvider(provider);
  const is_sol = false;
  const is_withdraw = false;
  const Order_id = new BN(9);
  const program = new Program(require("../target/idl/bozo.json"), marketInfo.programId,provider);
  //const program = anchor.workspace.Bozo as Program<Bozo>
  const exe_sys_prog = anchor.web3.SystemProgram;
  //const con = new Connection("http://127.0.0.1:8899");

  /*const [address] = await PublicKey.findProgramAddress(
    [USERKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), TOKEN.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );*/
  const TOKEN_IN = new anchor.web3.PublicKey(
    "So11111111111111111111111111111111111111112"
  );
  const TOKEN_OUT = new anchor.web3.PublicKey(
    "BakLYNXdUFiSKKm14HESawEpiMe8z9Tr3ynKKV1CFXZ6"
  );
  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const MY_MINT = new anchor.web3.PublicKey(
    "BPKnbNdHoE39vDHtNSLYtLgWHerd8sCXaqLEHFkc7tpJ"
  );
  const USER_REFFERAL = new anchor.web3.PublicKey(
    "65ZmLNGUuGw9BMNeXvNZUS6mtDMgfbW1gX2RigobVqJw"
  );
  const type = 4 as number;
  var side = false;
  var interval_nun = 999999999999;
  var orders_nun = 1;
  var amount_expected = new BN(1);
  if (type == 1 as number){
    side = true;
  }else if (type == 2 as number){
    if (!side){
      amount_expected = new BN(999999999999);
    }
  }else if (type == 3 as number){
    side = true;
    interval_nun = 60;
    orders_nun = 3;
  }else if (type == 4 as number){
    side = true;
    orders_nun = 20;
  }
  it("should create Order", async () => {
    
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 800_000 });

    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const [USERKey,bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );
    const [REFFERAL] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        USER_REFFERAL.toBuffer()
      ],
      program.programId
    );
    const [OrderKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("ORDER_SEED"),
        wallet.publicKey.toBuffer(),
        Buffer.from(Order_id.toArray("le", 8))
      ],
      program.programId
    );
    const [MetadataKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        MY_MINT.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    if(await con.getAccountInfo(OrderKey)==null && !is_sol){
      const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;

      const FromAutoTokenAccount = await getAssociatedTokenAddress(
        TOKEN_OUT,
        USERKey,
        true
      );
      const ToAutoTokenAccount = await getAssociatedTokenAddress(
        TOKEN_IN,
        USERKey,
        true
      );
      const FromUSERTokenAccount = await getAssociatedTokenAddress(
        TOKEN_OUT,
        wallet.publicKey
      );
      const MyMintTokenAccount = await getAssociatedTokenAddress(
        MY_MINT,
        wallet.publicKey
      );
      const RefferalTokenAccount = await getAssociatedTokenAddress(
        TOKEN_OUT,
        REFFERAL,
        true
      );
      const AdminTokenAccount = await getAssociatedTokenAddress(
        TOKEN_OUT,
        treasury_data.admin
      );
      if(await con.getAccountInfo(RefferalTokenAccount)==null){
        const RefferalAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          RefferalTokenAccount,
          REFFERAL,
          TOKEN_OUT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(RefferalAssociatedToken)
      }
      if(await con.getAccountInfo(FromUSERTokenAccount)==null){
        const UserAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          FromUSERTokenAccount,
          wallet.publicKey,
          TOKEN_OUT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(UserAssociatedToken)
      }
      if(await con.getAccountInfo(AdminTokenAccount)==null){
        const AdminAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          AdminTokenAccount,
          treasury_data.admin,
          TOKEN_OUT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(AdminAssociatedToken)
      }
      if(await con.getAccountInfo(ToAutoTokenAccount)==null){
        const ToAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          ToAutoTokenAccount,
          USERKey,
          TOKEN_IN,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(ToAssociatedToken)
      }
      if(await con.getAccountInfo(FromAutoTokenAccount)==null){
          const FromAssociatedToken = createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            FromAutoTokenAccount,
            USERKey,
            TOKEN_OUT,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          transaction = transaction.add(FromAssociatedToken)
        }
        const orders = new BN(orders_nun);
        const interval = new BN(interval_nun);
        const amount = new BN(500000000);
        const slippageBips = new BN(50);
        const limit = new BN(Date.now()+(interval_nun*orders_nun));
        const tx = await program.methods.createOrderAndDeposit(
          Order_id,
          type,
          amount,
          amount_expected,
          "https://api.devnet.solana.com",
          side,
          interval,
          orders,
          slippageBips,
          MetadataKey,
          limit,
          bump
        ).accounts({
          signer:wallet.publicKey,
          autoAccount:USERKey,
          order:OrderKey,
          treasure:TreasuryKey,
          tokenFromMint:TOKEN_OUT,
          tokenToMint:TOKEN_IN,
          fromAutoAta:FromAutoTokenAccount,
          fromSignerAta:FromUSERTokenAccount,
          toAutoAta:ToAutoTokenAccount,
          refferal:REFFERAL,
          nftMetadata:null/*MetadataKey*/,
          nftAta:null/*MyMintTokenAccount*/,
          metadataProgram:TOKEN_METADATA_PROGRAM_ID,
          tokenProgram:TOKEN_PROGRAM_ID,
          associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram:exe_sys_prog.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        }).instruction();
        transaction.add(tx).add(cump_limit);
        const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
        const Order_data = await program.account.order.fetch(OrderKey) as Order;
        
        console.log("Your transaction signature: ", txSignature);
        console.log("Order data amount: ", new BN(Order_data.amount).toNumber().toString(),
          " Order data limit: ",new BN(Order_data.limit).toNumber().toString(),
          " Order data holder: ",Order_data.holder as boolean
        );
    }else{
      console.log("Order data active");
    }
  });

  it("should create Order with SOL", async () => {
    
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 800000 });

    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const [USERKey,bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );
    const [REFFERAL] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        USER_REFFERAL.toBuffer()
      ],
      program.programId
    );
    const [OrderKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("ORDER_SEED"),
        wallet.publicKey.toBuffer(),
        Buffer.from(Order_id.toArray("le", 8))
      ],
      program.programId
    );
    const [MetadataKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        MY_MINT.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    if(await con.getAccountInfo(OrderKey)==null && is_sol){
      const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;
      
      const TOKEN = new anchor.web3.PublicKey(TOKEN_IN);

      const FromAutoTokenAccount = await getAssociatedTokenAddress(
        TOKEN_IN,
        USERKey,
        true
      );
      const ToAutoTokenAccount = await getAssociatedTokenAddress(
        TOKEN_OUT,
        USERKey,
        true
      );
      const MyMintTokenAccount = await getAssociatedTokenAddress(
        MY_MINT,
        wallet.publicKey
      );
      const RefferalTokenAccount = await getAssociatedTokenAddress(
        TOKEN,
        REFFERAL,
        true
      );
      const AdminTokenAccount = await getAssociatedTokenAddress(
        TOKEN_OUT,
        treasury_data.admin
      );
      if(await con.getAccountInfo(AdminTokenAccount)==null){
        const AdminAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          AdminTokenAccount,
          treasury_data.admin,
          TOKEN_OUT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(AdminAssociatedToken)
      }
      if(await con.getAccountInfo(RefferalTokenAccount)==null){
        const RefferalAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          RefferalTokenAccount,
          REFFERAL,
          TOKEN,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(RefferalAssociatedToken)
      }
      if(await con.getAccountInfo(ToAutoTokenAccount)==null){
        const ToAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          ToAutoTokenAccount,
          USERKey,
          TOKEN_OUT,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(ToAssociatedToken)
      }
      if(await con.getAccountInfo(FromAutoTokenAccount)==null){
          const FromAssociatedToken = createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            FromAutoTokenAccount,
            USERKey,
            TOKEN_IN,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          transaction = transaction.add(FromAssociatedToken)
        }
        const orders = new BN(orders_nun);
        const interval = new BN(interval_nun);
        const amount = new BN(500000000);
        const slippageBips = new BN(50);
        const limit = new BN(Date.now()+(interval_nun*orders_nun));
        const tx = await program.methods.createOrderAndSolDeposit(
          Order_id,
          type,
          amount,
          amount_expected,
          "https://api.devnet.solana.com",
          side,
          interval,
          orders,
          slippageBips,
          MetadataKey,
          limit,
          bump
        ).accounts({
          signer:wallet.publicKey,
          autoAccount:USERKey,
          order:OrderKey,
          treasure:TreasuryKey,
          wsolMint:TOKEN_IN,
          tokenToMint:TOKEN_OUT,
          fromAutoAta:FromAutoTokenAccount,
          toAutoAta:ToAutoTokenAccount,
          refferal:REFFERAL,
          nftMetadata:null/*MetadataKey*/,
          nftAta:null/*MyMintTokenAccount*/,
          metadataProgram:TOKEN_METADATA_PROGRAM_ID,
          tokenProgram:TOKEN_PROGRAM_ID,
          associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram:exe_sys_prog.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        }).instruction();
        transaction.add(tx).add(cump_limit);
        const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
        
        const Order_data = await program.account.order.fetch(OrderKey) as Order;
        
        console.log("Your transaction signature: ", txSignature);
        
        console.log("Order data amount: ", new BN(Order_data.amount).toNumber().toString(),
          " Order data limit: ",new BN(Order_data.limit).toNumber().toString(),
          " Order data holder: ",Order_data.holder as boolean,
        );
        sleep(3000);
    }else{
      console.log("Order data active");
    }
  });

  it("should execute Order", async () => {
    
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 800_000 });

    const serumMarketId = marketInfo.serumMarket;
    const [OrderKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("ORDER_SEED"),
        wallet.publicKey.toBuffer(),
        Buffer.from(Order_id.toArray("le", 8))
      ],
      program.programId
    );
    const [USERKey,bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );
    const [REFFERAL] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        USER_REFFERAL.toBuffer()
      ],
      program.programId
    );
    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const [BotKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("BOTROLE_SEED")],
      program.programId
    );
    if(await con.getAccountInfo(OrderKey)!=null && !is_withdraw){

      const Order_data = await program.account.order.fetch(OrderKey) as Order;
      const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;
      const market = await getMarket(con, serumMarketId.toString(), marketInfo.serumDexProgram.toString())
      const poolKeys = await getAssociatedPoolKeys({
          programId: marketInfo.ammProgram,
          serumProgramId: marketInfo.serumDexProgram,
          marketId: market.address,
          baseMint: market.baseMint,
          quoteMint: market.quoteMint
      });
      const {
          vaultOwner,
          vaultNonce
      } = await getVaultOwnerAndNonce(new PublicKey(serumMarketId), marketInfo.serumDexProgram)
      if (vaultNonce.toNumber() != market.vaultSignerNonce) {
          console.log("withdraw vaultOwner:", vaultOwner.toString(), "vaultNonce: ", vaultNonce.toNumber(), "market.vaultSignerNonce:", market.vaultSignerNonce.toString())
          throw ("vaultSignerNonce incorrect!")
      }
      const AdminTokenAccount = await getAssociatedTokenAddress(
        Order_data.fromToken,
        treasury_data.admin
      );
      const RefferalTokenAccount = await getAssociatedTokenAddress(
        Order_data.fromToken,
        REFFERAL,
        true
      );
      const amount_out = new BN(1);
      const platform_fee_bips = new BN(100);
      const tx = await program.methods.orderSwap(
        amount_out,
        platform_fee_bips,
        bump
      ).accounts({
        authority:wallet.publicKey,
        signer:Order_data.owner,
        order:OrderKey,
        autoAccount: USERKey,
        treasure:TreasuryKey,
        botrole:BotKey,
        admin:treasury_data.admin,
        adminAtaDestination:AdminTokenAccount,
        refferal:REFFERAL,
        refferalAtaDestination:RefferalTokenAccount,
        fromAutoAta:Order_data.fromTokenAta,
        toAutoAta:Order_data.toTokenAta,
        tokenMint:Order_data.fromToken,
        outMint:Order_data.toToken,

        ammId: poolKeys.id,
        ammAuthority: poolKeys.authority,
        ammOpenOrders: poolKeys.openOrders,
        ammTargetOrders:poolKeys.targetOrders,
        poolCoinTokenAccount: poolKeys.baseVault,
        poolPcTokenAccount: poolKeys.quoteVault,
        serumProgram: marketInfo.serumDexProgram,
        serumMarket: serumMarketId,
        serumBids: market.bids,
        serumAsks: market.asks,
        serumEventQueue: market.eventQueue,
        serumCoinVault: market.baseVault,
        serumPcVault: market.quoteVault,
        serumVaultSigner: vaultOwner,
        raydiumAmmProgram:marketInfo.ammProgram,

        tokenProgram:TOKEN_PROGRAM_ID,
        associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram:SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      }).instruction();
      if (Order_data.orderType == 4){
        for (let i = 1+Order_data.fill; i <= Order_data.orders; i++) {
          let single_transaction = new anchor.web3.Transaction();
          single_transaction.add(tx).add(cump_limit);
          const rpc = new Connection(Order_data.rpc);
          const txSignature = await sendAndConfirmTransaction(rpc,single_transaction,[wallet], { skipPreflight: true });
          console.log("Your transaction signature: ", txSignature);
        }
      }

      if (Order_data.open == true){
        transaction.add(tx).add(cump_limit);
        const rpc = new Connection(Order_data.rpc);
        let simulation = await rpc.simulateTransaction(transaction,[wallet]);
        if (simulation.value.err) {
            console.log("Transaction Failed: ", simulation.value.err.valueOf());
            return null;
        } 
        const txSignature = await sendAndConfirmTransaction(rpc,transaction,[wallet], { skipPreflight: true });
        console.log("Your transaction signature: ", txSignature);
        const U_Order_data = await program.account.order.fetch(OrderKey) as Order;
  
        console.log("Order data fill: ", new BN(U_Order_data.fill).toNumber().toString(),
          " Order data orders: ",new BN(U_Order_data.orders).toNumber().toString(),
          " Order data open: ",U_Order_data.open as boolean,
        );
        sleep(3000);
      }
    }else{
      console.log("Order data close");
    }
  });

  it("should withdraw", async () => {
    
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 });

    const [USERKey,bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );
    const base = true;
    var TOKEN = new anchor.web3.PublicKey(
      "11111111111111111111111111111111"
    );
    if (base){
      TOKEN = TOKEN_IN
    }else{
      TOKEN = TOKEN_OUT
    }
    if(await con.getAccountInfo(USERKey)!=null && is_withdraw){
      const FromAutoTokenAccount = await getAssociatedTokenAddress(
        TOKEN,
        USERKey,
        true
      );
      const USERTokenAccount = await getAssociatedTokenAddress(
        TOKEN,
        wallet.publicKey
      );
      if(await con.getAccountInfo(USERTokenAccount)==null){
        const UserAssociatedToken = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          USERTokenAccount,
          wallet.publicKey,
          TOKEN,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction = transaction.add(UserAssociatedToken)
      }
      const info = await con.getTokenAccountBalance(FromAutoTokenAccount);
      if (!info.value.uiAmount) throw new Error('No balance found');
      const amount_out = new BN(info.value.amount)/*.div(new BN(2))*/;

      const tx = await program.methods.withdraw(
        amount_out,
        bump
      ).accounts({
        signer:wallet.publicKey,
        tokenMint:TOKEN,
        autoAccount:USERKey,
        autoAta:FromAutoTokenAccount,
        signerAta:USERTokenAccount,
        tokenProgram:TOKEN_PROGRAM_ID,
        associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram:exe_sys_prog.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      }).instruction();
      transaction.add(tx).add(cump_limit);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
    }else{
      console.log("Order data close");
    }
  });
});