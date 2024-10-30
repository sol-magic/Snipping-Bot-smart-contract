use anchor_lang::prelude::*;

use crate::{constants::*, states::*,errors::*};

#[derive(Accounts)]
pub struct BotSettings<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
      seeds = [TRESURE_SEED],
      bump,
    )]
    pub treasure: Box<Account<'info, Treasure>>,
    
    #[account(
        mut,
        seeds = [BOTROLE_SEED],
        bump,
    )]
    pub botrole: Box<Account<'info, BotRole>>,
    pub system_program: Program<'info, System>,
}

impl<'info> BotSettings<'info> {
    pub fn add_bot(ctx: Context<Self>,bot:Pubkey) -> Result<()> {
        let accts: &mut BotSettings<'_> = ctx.accounts;
        if accts.treasure.admin != accts.admin.to_account_info().key() {
            return Err(CustomError::Unauthorized.into());
        }
        if accts.botrole.addresses.contains(&bot){
            return Err(CustomError::AddressExist.into());
        }
        accts.botrole.addresses.push(bot);
        Ok(())
    }
    pub fn rmv_bot(ctx: Context<Self>,bot:Pubkey) -> Result<()> {
        let accts: &mut BotSettings<'_> = ctx.accounts;
        let accts_bots: &Vec<Pubkey> = &accts.botrole.addresses;
        if accts.treasure.admin != accts.admin.to_account_info().key() {
            return Err(CustomError::Unauthorized.into());
        }
        for i in 0..accts_bots.len(){
            if bot == accts_bots[i]{
                accts.botrole.addresses.remove(i);
                break;
            }
        }
        Ok(())
    }
}
