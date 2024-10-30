use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::{
    associated_token::AssociatedToken, metadata::{Metadata, MetadataAccount}, token::{self, transfer, Mint, Token, TokenAccount, Transfer}
};
use std::mem::size_of;
use crate::{constants::*, states::*,errors::CustomError::*};

pub fn create_order_deposit(
    ctx: Context<OrderTokenFromUser>,
    _id:u64,
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
    let accts: &mut OrderTokenFromUser<'_> = ctx.accounts;
    let signer = &accts.signer;
    let signer_key = &signer.key();
    let program = &accts.token_program;
    let timestamp: u64 = Clock::get()?.unix_timestamp as u64;

    if amount > accts.from_signer_ata.amount{
        return Err(IncorrectAmount.into());
    }
    if accts.from_auto_ata.owner != accts.auto_account.key()
    || accts.from_auto_ata.mint != accts.token_from_mint.key(){
        return Err(IncorrectAssociated.into());
    }
    if accts.to_auto_ata.owner != accts.auto_account.key()
    || accts.to_auto_ata.mint != accts.token_to_mint.key(){
        return Err(IncorrectAssociated.into());
    }
    if accts.from_signer_ata.owner != accts.signer.key()
    || accts.from_signer_ata.mint != accts.token_from_mint.key(){
        return Err(IncorrectAssociated.into());
    }
    if amount == 0
    || types < 1 
    || types > 4
    || min_amount_expected == 0
    || rpc == ""
    || interval == 0
    || orders == 0
    || slippage_bips == 0
    || limit == 0{
        return Err(IncorrectDefinition.into());
    }
    if types < 3 && orders > 1{
        return Err(IncorrectDefinition.into());
    }
    if accts.order.open == true{
        return Err(OrderFinish.into());
    }

    if accts.auto_account.owner == Pubkey::default(){
        accts.auto_account.owner = accts.signer.to_account_info().key()
    }
    if accts.refferal.is_some() && accts.refferal.clone()
    .ok_or(EmptyData)?.key() != *signer_key{
        if accts.auto_account.refferal.is_none(){
            accts.auto_account.refferal = Some(accts.refferal.clone().ok_or(EmptyData)?.key());
            accts.refferal.as_mut().ok_or(EmptyData)?.refferal_numbers += 1;
        }
    }
    accts.order.holder = false;

    if accts.nft_metadata.is_some() && nft_metadata.is_some() && accts.nft_ata.is_some() {
        let nft_data: Account<'_, MetadataAccount> = accts.nft_metadata.clone().ok_or(EmptyData)?;
        let nft_ata: Account<'_, TokenAccount> = accts.nft_ata.clone().ok_or(EmptyData)?;
        if nft_data.mint != nft_ata.mint && nft_ata.amount > 0{
            return Err(IncorrectNFT.into());
        }
        let collection = nft_data.collection.clone().ok_or(EmptyData)?;
        if nft_metadata.ok_or(EmptyData)? == accts.nft_metadata.clone().ok_or(EmptyData)?.key() 
        && accts.treasure.collection == collection.key
        && collection.verified == true
        {
            accts.order.holder = true;
        }else {
            return Err(IncorrectNFT.into());
        }
    }

    let cpi_context  = CpiContext::new(
        program.to_account_info(), 
        Transfer{
            from:accts.from_signer_ata.to_account_info(),
            to:accts.from_auto_ata.to_account_info(),
            authority:accts.signer.to_account_info()
        }
    );
    transfer(cpi_context, amount)?;

    accts.auto_account.refferal = accts.auto_account.refferal;
    accts.order.open = true;
    accts.order.owner = *signer_key;
    accts.order.order_type = types;
    accts.order.rpc = rpc;
    accts.order.side = side;
    accts.order.from_token = accts.token_from_mint.key();
    accts.order.to_token = accts.token_to_mint.key();
    accts.order.from_token_ata = accts.from_auto_ata.key();
    accts.order.to_token_ata = accts.to_auto_ata.key();
    accts.order.amount = amount.checked_div(orders).ok_or(MathOverflow)?;
    accts.order.amount_expected = min_amount_expected;
    accts.order.slippage_bips = slippage_bips;
    accts.order.limit = limit;
    accts.order.orders = orders;
    accts.order.fill = 0;
    accts.order.timestamp = timestamp;
    accts.order.interval = interval;

    Ok(())
}
pub fn create_order_sol_deposit(
    ctx: Context<OrderSolFromUser>,
    _id:u64,
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
    let accts: &mut OrderSolFromUser<'_> = ctx.accounts;
    let binding = _bump.to_le_bytes();
    let signer = &accts.signer;
    let signer_key = &signer.key();
    let program = &accts.token_program;
    let timestamp: u64 = Clock::get()?.unix_timestamp as u64;

    let seeds: &[&[&[u8]]] = &[&[
        USER_SEED.as_ref(),
        signer_key.as_ref(),
        binding.as_ref()
    ]];
    if amount > signer.lamports(){
        return Err(IncorrectAmount.into());
    }
    if accts.from_auto_ata.owner != accts.auto_account.key()
    || accts.from_auto_ata.mint != accts.wsol_mint.key(){
        return Err(IncorrectAssociated.into());
    }
    if accts.to_auto_ata.owner != accts.auto_account.key()
    || accts.to_auto_ata.mint != accts.token_to_mint.key(){
        return Err(IncorrectAssociated.into());
    }
    
    if amount == 0
    || types < 1 
    || types > 4
    || min_amount_expected == 0
    || rpc == ""
    || interval == 0
    || orders == 0
    || slippage_bips == 0
    || limit == 0{
        return Err(IncorrectDefinition.into());
    }
    if accts.order.open == true{
        return Err(OrderFinish.into());
    }
    if types < 3 && orders > 1{
        return Err(IncorrectDefinition.into());
    }
    if accts.auto_account.owner == Pubkey::default(){
        accts.auto_account.owner = accts.signer.to_account_info().key()
    }
    if accts.refferal.is_some() && accts.refferal.clone()
    .ok_or(EmptyData)?.key() != *signer_key{
        if accts.auto_account.refferal.is_none(){
            accts.auto_account.refferal = Some(accts.refferal.clone().ok_or(EmptyData)?.key());
            accts.refferal.as_mut().ok_or(EmptyData)?.refferal_numbers += 1;
        }
    }
    accts.order.holder = false;
    if accts.nft_metadata.is_some() && nft_metadata.is_some() && accts.nft_ata.is_some() {
        let nft_data: Account<'_, MetadataAccount> = accts.nft_metadata.clone().ok_or(EmptyData)?;
        let nft_ata: Account<'_, TokenAccount> = accts.nft_ata.clone().ok_or(EmptyData)?;
        if nft_data.mint != nft_ata.mint && nft_ata.amount > 0{
            return Err(IncorrectNFT.into());
        }
        let collection = nft_data.collection.clone().ok_or(EmptyData)?;

        if nft_metadata.ok_or(EmptyData)? == accts.nft_metadata.clone().ok_or(EmptyData)?.key() 
        && accts.treasure.collection == collection.key
        && collection.verified == true
        {
            accts.order.holder = true;
        }else {
            return Err(IncorrectNFT.into());
        }
    }
    let cpi_context = CpiContext::new(
        accts.system_program.to_account_info(),
        system_program::Transfer {
            from: accts.signer.to_account_info(),
            to: accts.from_auto_ata.to_account_info(),
        },
    );
    let cpi_accounts = token::SyncNative {
        account: accts.from_auto_ata.to_account_info(),
    };

    system_program::transfer(cpi_context, amount)?;

    let cpi_program = program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts,seeds);

    accts.auto_account.refferal = accts.auto_account.refferal;
    accts.order.open = true;
    accts.order.owner = *signer_key;
    accts.order.order_type = types;
    accts.order.rpc = rpc;
    accts.order.side = side;
    accts.order.from_token = accts.wsol_mint.key();
    accts.order.to_token = accts.token_to_mint.key();
    accts.order.from_token_ata = accts.from_auto_ata.key();
    accts.order.to_token_ata = accts.to_auto_ata.key();
    accts.order.amount = amount.checked_div(orders).ok_or(MathOverflow)?;
    accts.order.amount_expected = min_amount_expected;
    accts.order.slippage_bips = slippage_bips;
    accts.order.limit = limit;
    accts.order.orders = orders;
    accts.order.fill = 0;
    accts.order.timestamp = timestamp;
    accts.order.interval = interval;
    
    token::sync_native(cpi_ctx)?;
    if accts.auto_account.owner == Pubkey::default(){
        accts.auto_account.owner = accts.signer.to_account_info().key()
    }

    Ok(())
}
pub fn withdraw(
    ctx: Context<OrderTokenToUser>,
    amount: u64,
    _bump:u8
    ) -> Result<()> {
    let accts = ctx.accounts;
    let binding = _bump.to_le_bytes();
    let signer = &accts.signer.key();
    let program = &accts.token_program;

    let seeds: &[&[&[u8]]] = &[&[
        USER_SEED.as_ref(),
        signer.as_ref(),
        binding.as_ref()
    ]];
    if accts.auto_account.owner != accts.signer.to_account_info().key() {
        return Err(Unauthorized.into());
    }
    if accts.auto_ata.amount >= amount && amount > 0{
        let cpi_context  = CpiContext::new_with_signer(
            program.to_account_info(), 
            Transfer{
                from:accts.auto_ata.to_account_info(),
                to:accts.signer_ata.to_account_info(),
                authority:accts.auto_account.to_account_info()
            },
            seeds
        );
        transfer(cpi_context, amount)?;
    }else {
        return Err(IncorrectAmount.into());
    }
    Ok(())
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct OrderTokenFromUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = signer,
        seeds = [USER_SEED,signer.key().as_ref()],
        bump,
        space = 16 + size_of::<User>()
    )]
    pub auto_account: Box<Account<'info, User>>,

    #[account(
        init_if_needed,
        payer = signer,
        seeds = [ORDER_SEED,signer.key().as_ref(),id.to_le_bytes().as_ref()],
        bump,
        space = 16 + size_of::<Order>()
      )]
    pub order: Box<Account<'info, Order>>,

    #[account(
        seeds = [TRESURE_SEED],
        bump,
      )]
    pub treasure: Box<Account<'info, Treasure>>,

    pub token_from_mint: Account<'info, Mint>,

    pub token_to_mint: Account<'info, Mint>,

    #[account(mut)]
    pub from_signer_ata: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub from_auto_ata: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub to_auto_ata: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub refferal: Option<Account<'info, User>>,

    pub nft_metadata: Option<Account<'info, MetadataAccount>>,
    
    pub nft_ata: Option<Account<'info, TokenAccount>>,

    pub metadata_program: Program<'info, Metadata>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
#[derive(Accounts)]
#[instruction(id: u64)]
pub struct OrderSolFromUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = signer,
        seeds = [USER_SEED,signer.key().as_ref()],
        bump,
        space = 16 + size_of::<User>()
    )]
    pub auto_account: Box<Account<'info, User>>,

    #[account(
        init_if_needed,
        payer = signer,
        seeds = [ORDER_SEED,signer.key().as_ref(),id.to_le_bytes().as_ref()],
        bump,
        space = 16 + size_of::<Order>()
      )]
    pub order: Box<Account<'info, Order>>,

    #[account(
        seeds = [TRESURE_SEED],
        bump,
      )]
    pub treasure: Box<Account<'info, Treasure>>,

    pub wsol_mint: Box<Account<'info, Mint>>,

    pub token_to_mint: Box<Account<'info, Mint>>,
    
    #[account(mut)]
    pub from_auto_ata: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub to_auto_ata: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub refferal: Option<Box<Account<'info, User>>>,

    pub nft_metadata: Option<Account<'info, MetadataAccount>>,

    pub nft_ata: Option<Account<'info, TokenAccount>>,

    pub metadata_program: Program<'info, Metadata>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
#[derive(Accounts)]
pub struct OrderTokenToUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub auto_account: Box<Account<'info, User>>,

    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub auto_ata: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub signer_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}