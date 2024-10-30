import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Bozo } from "../target/types/bozo";
import { TOKEN_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createInitializeMintInstruction, MINT_SIZE } from '@solana/spl-token';
import { PublicKey,sendAndConfirmTransaction ,Connection,ComputeBudgetProgram} from "@solana/web3.js";
import { BN } from "bn.js";
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
  const create_order = true;
  const Order_id = new BN(0);
  const program = new Program(require("../target/idl/bozo.json"), marketInfo.programId,provider);
  //const program = anchor.workspace.Bozo as Program<Bozo>
  const exe_sys_prog = anchor.web3.SystemProgram;
  //const con = new Connection("http://127.0.0.1:8899");
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
  const type = 2 as number;
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
    interval_nun = 4;
    orders_nun = 3;
  }else if (type == 4 as number){
    side = true;
    orders_nun = 20;
  }
  it("should create order", async () => {
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 800_000 });
    

    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const [USERKey] = await anchor.web3.PublicKey.findProgramAddress(
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
    if(await con.getAccountInfo(OrderKey)==null && create_order){
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
        const MyMintTokenAccount = await getAssociatedTokenAddress(
          MY_MINT,
          wallet.publicKey
        );
        const [MetadataKey] = await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            MY_MINT.toBuffer()
          ],
          TOKEN_METADATA_PROGRAM_ID
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
            TOKEN_OUT,
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
            TOKEN_IN,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          transaction = transaction.add(ToAssociatedToken)
        }
        const orders = new BN(orders_nun);
        const interval = new BN(interval_nun);
        const amount = new BN(500000000);
        const slippageBips = new BN(50);
        const limit = new BN(Date.now()+(interval_nun*orders_nun));
        const tx = await program.methods.createOrder(
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
          limit
        ).accounts({
          signer:wallet.publicKey,
          autoAccount:USERKey,
          order:OrderKey,
          treasure:TreasuryKey,
          tokenFromMint:TOKEN_OUT,
          tokenToMint:TOKEN_IN,
          fromAutoAta:FromAutoTokenAccount,
          toAutoAta:ToAutoTokenAccount,
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
    }else{
      console.log("Order data active");
    }
  });


  it("should close Order", async () => {
    
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 });
    
    const [OrderKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("ORDER_SEED"),
        wallet.publicKey.toBuffer(),
        Buffer.from(Order_id.toArray("le", 8))
      ],
      program.programId
    );
    if (await con.getAccountInfo(OrderKey)!=null && !create_order){
      const tx = await program.methods.closeOrder(
        Order_id
      ).accounts({
        signer:wallet.publicKey,
        order:OrderKey,
        systemProgram:exe_sys_prog.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      }).instruction();
      transaction.add(tx).add(cump_limit);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
    }
  });

  it("should deposit", async () => {
    
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 });

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
    const FromAutoTokenAccount = await getAssociatedTokenAddress(
      TOKEN_OUT,
      USERKey,
      true
    );
    const USERTokenAccount = await getAssociatedTokenAddress(
      TOKEN_OUT,
      wallet.publicKey
    );
    if(await con.getAccountInfo(FromAutoTokenAccount)==null){
      const FromAutoAssociatedToken = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        FromAutoTokenAccount,
        USERKey,
        TOKEN_OUT,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      transaction = transaction.add(FromAutoAssociatedToken)
    }
    if (!is_sol && !create_order){
      const amount = new BN(500000000);
      const tx = await program.methods.deposit(
        amount,
        bump
      ).accounts({
        signer:wallet.publicKey,
        autoAccount:USERKey,
        tokenFromMint:TOKEN_OUT,
        fromSignerAta:USERTokenAccount,
        fromAutoAta:FromAutoTokenAccount,
        refferal:REFFERAL,
        tokenProgram:TOKEN_PROGRAM_ID,
        associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram:exe_sys_prog.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      }).instruction();
      transaction.add(tx).add(cump_limit);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
    }
  });


  it("should deposit with sol", async () => {
    
    let transaction = new anchor.web3.Transaction();
    let cump_limit = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 });

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
    const FromAutoTokenAccount = await getAssociatedTokenAddress(
      TOKEN_IN,
      USERKey,
      true
    );
    if(await con.getAccountInfo(FromAutoTokenAccount)==null){
      const FromAutoAssociatedToken = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        FromAutoTokenAccount,
        USERKey,
        TOKEN_IN,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      transaction = transaction.add(FromAutoAssociatedToken)
    }
    if (is_sol && !create_order){
      const amount = new BN(500000000);
      const tx = await program.methods.depositSol(
        amount,
        bump
      ).accounts({
        signer:wallet.publicKey,
        autoAccount:USERKey,
        wsolMint:TOKEN_IN,
        fromAutoAta:FromAutoTokenAccount,
        refferal:REFFERAL,
        tokenProgram:TOKEN_PROGRAM_ID,
        associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram:exe_sys_prog.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      }).instruction();
      transaction.add(tx).add(cump_limit);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
    }
  });
});
