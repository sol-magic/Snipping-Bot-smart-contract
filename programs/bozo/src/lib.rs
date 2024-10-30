use anchor_lang::prelude::*;

/// instructions
pub mod instructions;
pub mod constants;
pub mod errors;
pub mod states;
use crate::instructions::*;
declare_id!("AuoTwD72g2GcSQAhu1UeUnqn9CkwRmL8bK69XdWZETSh");

#[program]
pub mod bozo {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>,collection:Pubkey) -> Result<()>{
        Initialize::validate(ctx,collection)?;
        Ok(())
    }
    pub fn refferal(ctx: Context<CreateAutoAccount>) -> Result<()> {
        ctx.accounts.auto_account.owner = ctx.accounts.signer.key();
        Ok(())
    }
    pub fn change_admin(ctx: Context<TreasureSettings>,new_admin:Pubkey) -> Result<()>{
        TreasureSettings::change_admin(ctx,new_admin)?;
        Ok(())
    }

    pub fn change_collection(
        ctx: Context<TreasureSettings>,
        new_collection:Pubkey
    ) -> Result<()>{
        TreasureSettings::change_collection(ctx,new_collection)?;
        Ok(())
    }
    pub fn add_bot(ctx: Context<BotSettings>,bot:Pubkey) -> Result<()>{
        BotSettings::add_bot(ctx,bot)?;
        Ok(())
    }
    pub fn rmv_bot(ctx: Context<BotSettings>,bot:Pubkey) -> Result<()>{
        BotSettings::rmv_bot(ctx,bot)?;
        Ok(())
    }
    pub fn create_order(
        ctx: Context<CreateOrder>,
        id:u64,
        types:u8,
        amount: u64,
        min_amount_expected:u64,
        rpc:String,
        side:bool,
        interval:u64,
        orders:u64,
        slippage_bips:u64,
        nft_metadata:Option<Pubkey>,
        limit:u64
    ) -> Result<()> {
        order_single::create_order(
            ctx, 
            id,
            types,
            amount,
            min_amount_expected,
            rpc,
            side,
            interval,
            orders,
            slippage_bips,
            nft_metadata,
            limit
        )
    }    
    pub fn close_order(
        ctx: Context<CloseOrder>,
        id:u64
    ) -> Result<()> {
        order_single::close_order(
            ctx, 
            id
        )
    }    
    pub fn deposit(
        ctx: Context<Deposit>,
        amount:u64,
        bump:u8
    ) -> Result<()> {
        order_single::deposit(
            ctx, 
            amount,
            bump
        )
    }   
    pub fn deposit_sol(
        ctx: Context<DepositSol>,
        amount:u64,
        bump:u8
    ) -> Result<()> {
        order_single::sol_deposit(
            ctx, 
            amount,
            bump
        )
    }   
    pub fn create_order_and_deposit(
        ctx: Context<OrderTokenFromUser>,
        id:u64,
        types:u8,
        amount: u64,
        min_amount_expected:u64,
        rpc:String,
        side:bool,
        interval:u64,
        orders:u64,
        slippage_bips:u64,
        nft_metadata:Option<Pubkey>,
        limit:u64,
        _bump:u8
    ) -> Result<()> {
        order_mult::create_order_deposit(
            ctx, 
            id,
            types,
            amount,
            min_amount_expected,
            rpc,
            side,
            interval,
            orders,
            slippage_bips,
            nft_metadata,
            limit,
            _bump
        )
    }    
    pub fn create_order_and_sol_deposit(
        ctx: Context<OrderSolFromUser>,
        id:u64,
        types:u8,
        amount: u64,
        min_amount_expected:u64,
        rpc:String,
        side:bool,
        interval:u64,
        orders:u64,
        slippage_bips:u64,
        nft_metadata:Option<Pubkey>,
        limit:u64,
        _bump:u8
    ) -> Result<()> {
        order_mult::create_order_sol_deposit(
            ctx, 
            id,
            types,
            amount,
            min_amount_expected,
            rpc,
            side,
            interval,
            orders,
            slippage_bips,
            nft_metadata,
            limit,
            _bump
        )
    }    
    pub fn withdraw(
        ctx: Context<OrderTokenToUser>,
        amount: u64,
        _bump: u8,
    ) -> Result<()> {
        order_mult::withdraw(ctx, amount, _bump)
    }
    pub fn order_swap(
        ctx: Context<OrderSwapToken>,
        tokenamount_per_swap_amount: u64,
        platform_fee_bips: u64,
        _bump: u8,
    ) -> Result<()> {
        order_execute::swap(ctx, tokenamount_per_swap_amount, platform_fee_bips, _bump)
    }
}
