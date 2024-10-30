import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey,sendAndConfirmTransaction ,Connection} from "@solana/web3.js";
import { Treasure,BotRole,User } from "./require"
import { readContracts,readPrivateKeys } from "./start"
import { BN } from "bn.js";

const marketInfo = {
  programId: new PublicKey("11111111111111111111111111111111"),
  serumDexProgram: new PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj"),
  ammProgram: new PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8"),
  serumMarket: new PublicKey("J1oKpxWJFHwSEHyfVfQ5eGKz2RnUUpZjYAbGBVhU8xgM"),
}

describe("bozo", () => {
  const con = new Connection("https://api.devnet.solana.com");
  const provider = anchor.AnchorProvider.env();
  const wallet = 
  readPrivateKeys("private_keys.txt")[0];
  //anchor.Wallet.local().payer;
  marketInfo.programId = new PublicKey(readContracts("contract.txt")[0]);
  anchor.setProvider(provider);
  const program = new Program(require("../target/idl/bozo.json"), marketInfo.programId,provider);
  const exe_sys_prog = anchor.web3.SystemProgram;
  //const con = new Connection("http://127.0.0.1:8899");
  const NFT_COLLECTION = new anchor.web3.PublicKey(
    "ExFWcTTrFMkWc6XCyfPvSpdw8yVLb385ep8ctRvfVt62"
  );
  it("Is initialized!", async () => {
    let transaction = new anchor.web3.Transaction();
    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    program.programId
    const [BotKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("BOTROLE_SEED")],
      program.programId
    );
    if(await con.getAccountInfo(TreasuryKey)==null){
      const tx = await program.methods.initialize(NFT_COLLECTION).accounts({
        admin:wallet.publicKey,
        treasure:TreasuryKey,
        botrole:BotKey,
        systemProgram:exe_sys_prog.programId
      }).instruction();
      transaction.add(tx);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
      const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;
      console.log("treasury data:", treasury_data);
    }
  });

  

  it("should change admin successfully", async () => {
    let transaction = new anchor.web3.Transaction();
    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;
    if(await con.getAccountInfo(TreasuryKey)!=null 
    && treasury_data.admin.toString() == wallet.publicKey.toString()){
      const tx = await program.methods.changeAdmin(wallet.publicKey).accounts({
        admin:wallet.publicKey,
        treasure:TreasuryKey,
        systemProgram:exe_sys_prog.programId
      }).instruction();
      transaction.add(tx);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
      console.log("treasury data:", treasury_data);
    }
  });

  

  it("should change collection and metadata successfully", async () => {
    let transaction = new anchor.web3.Transaction();
    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;
    if(await con.getAccountInfo(TreasuryKey)!=null 
    && treasury_data.admin.toString() == wallet.publicKey.toString()){
      const newCollection = NFT_COLLECTION;
      const tx = await program.methods.changeCollection(newCollection).accounts({
        admin:wallet.publicKey,
        treasure:TreasuryKey,
        systemProgram:exe_sys_prog.programId
      }).instruction();
      transaction.add(tx);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
      console.log("treasury data:", treasury_data);
    }
  });

  

  it("should add botrole", async () => {
    let transaction = new anchor.web3.Transaction();
    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const [BotKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("BOTROLE_SEED")],
      program.programId
    );
    const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;
    if(await con.getAccountInfo(TreasuryKey)!=null 
    && treasury_data.admin.toString() == wallet.publicKey.toString()){
      const tx = await program.methods.addBot(wallet.publicKey).accounts({
        admin:wallet.publicKey,
        treasure:TreasuryKey,
        botrole:BotKey,
        systemProgram:exe_sys_prog.programId
      }).instruction();
      transaction.add(tx);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
      const Bot_data = await program.account.botRole.fetch(BotKey) as BotRole;
      console.log("Bot Role data:", Bot_data);
    }
  });

  /*it("should remove botrole", async () => {
    let transaction = new anchor.web3.Transaction();
    const [TreasuryKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("TRESURE_SEED")],
      program.programId
    );
    const [BotKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("BOTROLE_SEED")],
      program.programId
    );
    const treasury_data = await program.account.treasure.fetch(TreasuryKey) as Treasure;
    if(await con.getAccountInfo(TreasuryKey)!=null 
    && treasury_data.admin.toString() == wallet.publicKey.toString()){
      const tx = await program.methods.rmvBot(wallet.publicKey).accounts({
        admin:wallet.publicKey,
        treasure:TreasuryKey,
        botrole:BotKey,
        systemProgram:exe_sys_prog.programId
      }).instruction();
      transaction.add(tx);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
      const Bot_data = await program.account.botRole.fetch(BotKey) as BotRole;
      console.log("Bot Role data:", Bot_data);
    }
  });*/

  it("should create AutoAccount", async () => {
    let transaction = new anchor.web3.Transaction();
    const [USERKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("USER_SEED"),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );
    if(await con.getAccountInfo(USERKey)==null){
      const tx = await program.methods.refferal().accounts({
        autoAccount:USERKey,
        signer:wallet.publicKey,
        systemProgram:exe_sys_prog.programId
      }).instruction();
      transaction.add(tx);
      const txSignature = await sendAndConfirmTransaction(con,transaction,[wallet], { skipPreflight: true });
      
      console.log("Your transaction signature: ", txSignature);
    }
    const user_data = await program.account.user.fetch(USERKey) as User;
    console.log(
        "user:", USERKey.toString(),
        "user owner:", user_data.owner.toString(),
        "refferal: ",user_data.refferal,
        "refferal Numbers: ",new BN(user_data.refferalNumbers).toNumber().toString(),
      );
  });
});
