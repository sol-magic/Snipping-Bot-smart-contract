import { Router, Request, Response } from 'express';
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counterapp } from "../../../target/types/counterapp";


/**For contract start */
import { Program, web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
const idl = require('../target/idl/nft_staking.json');
const EDITION_SEED = "edition";
const METADATA_SEED = "metadata";
const PLAYER_POOL_SEED = "player-pool";
const STAKE_POOL_SEED = "stake-pool";

anchor.setProvider(anchor.AnchorProvider.local(web3.clusterApiUrl('devnet')));
const solConnection = anchor.getProvider().connection;
const wallet = anchor.AnchorProvider.local().wallet as anchor.Wallet;
const payer = wallet.payer;
const authority = payer.publicKey;
const provider = anchor.getProvider();
const program = new anchor.Program(idl, new anchor.web3.PublicKey(PROGRAM_ID));

/**For contract end */

dotenv.config();
const router=express.Router();

const AUTO = process.env.AUTO;
const DCA = process.env.DCA;
const SPAM = process.env.SPAM;

const collectionAddress = new web3.PublicKey(`${AUTO}`);
const nftAddress = new web3.PublicKey(`${DCA}`);
const nftAddress2 = new web3.PublicKey(`${SPAM}`);
const router = Router();

// Initialize Anchor program
const program = anchor.workspace.Counterapp as Program<Counterapp>;

// Endpoint to create a new counter
router.post('/api/swap', async (req: Request, res: Response) => {
    const counterAccount = anchor.web3.Keypair.generate();
    await program.rpc.swap_sol_to_token({
        accounts: {
            counterAccount: counterAccount.publicKey,
            user: req.user.publicKey, // Assuming you have user authentication
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [counterAccount]
    } as any);
    return res.status(200).json({ message: 'Swap business successfully' });
});

export { router as swapRouter }