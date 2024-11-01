use anchor_lang::prelude::*;
use std::mem::size_of;

use crate::{constants::*, states::*};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        seeds = [TRESURE_SEED],
        bump,
        space = 8 + size_of::<Treasure>()
    )]
    pub treasure: Box<Account<'info, Treasure>>,
    
    #[account(
        init,
        payer = admin,
        seeds = [BOTROLE_SEED],
        bump,
        space = 8 + size_of::<Pubkey>() * 300
    )]
    pub botrole: Box<Account<'info, BotRole>>,

    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn validate(ctx: Context<Self>,collection:Pubkey) -> Result<()> {
        let accts: &mut Initialize<'_> = ctx.accounts;
        let admin_key: Pubkey = accts.admin.key();
        accts.treasure.admin = admin_key;
        accts.treasure.collection = collection;
        Ok(())
    }
}
