use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_spl::{
    associated_token::AssociatedToken, token::{transfer, Mint, Token, TokenAccount, Transfer}
};
use crate::{constants::*, states::*,errors::CustomError::*};
use raydium_contract_instructions::amm_instruction::swap_base_in;

pub fn swap(
  ctx: Context<OrderSwapToken>, 
  min_out: u64,
  platform_fee_bips: u64,
  _bump:u8
) -> Result<()> {
  let accts: &mut OrderSwapToken<'_> = ctx.accounts;
  let binding: [u8; 1] = _bump.to_le_bytes();
  let timestamp: u64 = Clock::get()?.unix_timestamp as u64;
  let mut amount: u64 = accts.order.amount;
  let signer = &accts.signer.key();

  let seeds: &[&[&[u8]]] = &[&[
          USER_SEED.as_ref(),
          signer.as_ref(),
          binding.as_ref()
      ]];
  if accts.treasure.admin.key() != accts.admin.key(){
      return Err(NotAllowedAuthority.into());
  }
  if !accts.botrole.addresses.contains(&accts.authority.key()) {
    return Err(ZeroAddressDetected.into());
  }
  if accts.order.owner != accts.signer.key() 
  || accts.auto_account.owner != accts.signer.key() {
      return Err(Unauthorized.into());
  }
  if accts.order.open == false{
      return Err(OrderFinish.into());
  }
  if accts.order.orders <= accts.order.fill{
      return Err(OrderFilled.into());
  }
  if accts.order.timestamp.checked_add(accts.order.interval).ok_or(MathOverflow)? > timestamp
  && accts.order.order_type == 3{
      return Err(IncorrectTime.into());
  }
  if accts.order.order_type == 2{
    if accts.order.amount_expected > min_out && accts.order.side == true{
        return Err(IncorrectAmount.into());
    }
    if accts.order.amount_expected < min_out && accts.order.side == false{
      return Err(IncorrectAmount.into());
    }
  }
  if amount > accts.from_auto_ata.amount{
      amount = accts.from_auto_ata.amount;
  }
  if amount <= 0{
      accts.order.open = false;
  }else {

      let mut fee: u64 = amount
      .checked_mul(platform_fee_bips)
      .ok_or(MathOverflow)?
      .checked_div(10000)
      .ok_or(MathOverflow)?;

      if accts.order.holder == false{
        if accts.auto_account.refferal.is_some() 
            && accts.refferal.is_some() && accts.refferal_ata_destination.is_some(){

                let refferal_fee: u64 = fee.checked_div(100).ok_or(MathOverflow)?.checked_mul(20).ok_or(MathOverflow)?;
                fee = fee.checked_sub(refferal_fee).ok_or(MathOverflow)?;
                amount = amount.checked_sub(refferal_fee).ok_or(MathOverflow)?;
                OrderSwapToken::collect_fee_refferal(accts,accts.signer.key(),binding,refferal_fee)?;
            }
          OrderSwapToken::collect_fee_token(accts,accts.signer.key(),binding,fee)?;
      }else {
          fee = 0;
      }
      
      amount = amount.checked_sub(fee).ok_or(MathOverflow)?;
      
      let swap_ix = swap_base_in(
      &accts.raydium_amm_program.key(),
      &accts.amm_id.key(),
      &accts.amm_authority.key(),
      &accts.amm_open_orders.key(),
      &accts.amm_target_orders.key(),

      &accts.pool_coin_token_account.key(),
      &accts.pool_pc_token_account.key(),
      &accts.serum_program.key(),
      &accts.serum_market.key(),
      &accts.serum_bids.key(),
      &accts.serum_asks.key(),
      &accts.serum_event_queue.key(),

      &accts.serum_coin_vault.key(),
      &accts.serum_pc_vault.key(),
      &accts.serum_vault_signer.key(),
      &accts.from_auto_ata.key(),
      &accts.to_auto_ata.key(),
      &accts.auto_account.key(),
      amount,
      min_out,
      )?;

      invoke_signed(
          &swap_ix,
          &[
              accts.token_program.to_account_info(),
              accts.amm_id.to_account_info(),
              accts.amm_authority.to_account_info(),
              accts.amm_open_orders.to_account_info(),
              accts.amm_target_orders.to_account_info(),
              accts.pool_coin_token_account.to_account_info(),
              accts.pool_pc_token_account.to_account_info(),
              
              accts.serum_program.to_account_info(),
              accts.serum_market.to_account_info(),
              accts.serum_bids.to_account_info(),
              accts.serum_asks.to_account_info(),
              accts.serum_event_queue.to_account_info(),
              accts.serum_coin_vault.to_account_info(),
              accts.serum_pc_vault.to_account_info(),
              accts.serum_vault_signer.to_account_info(),

              accts.from_auto_ata.to_account_info(),
              accts.to_auto_ata.to_account_info(),
              accts.auto_account.to_account_info(),
          ],
          seeds
      )?;
      if accts.order.order_type > 2{
        accts.order.amount_expected = accts.order.amount_expected
        .checked_add(min_out).ok_or(MathOverflow)?;
      }
      if accts.order.limit < timestamp
      || accts.order.orders <= accts.order.fill+1{
          accts.order.open = false;
      }else {
          accts.order.fill += 1;
      }
      accts.order.timestamp = timestamp;
  }
  Ok(())
}

impl<'info> OrderSwapToken<'info> {
fn collect_fee_token(
      accts: &mut OrderSwapToken<'_>,
      auto_signer: Pubkey,
      binding: [u8; 1],
      fee:u64
  ) -> Result<()>  {

      let seeds: &[&[&[u8]]] = &[&[
          USER_SEED.as_ref(),
          auto_signer.as_ref(),
          binding.as_ref()
      ]];
    let cpi_context = CpiContext::new_with_signer(
      accts.token_program.to_account_info(),
        Transfer {
            from: accts.from_auto_ata.to_account_info(),
            to: accts.admin_ata_destination.to_account_info(),
            authority: accts.auto_account.to_account_info(),
        },
        seeds
    );
    transfer(cpi_context, fee).ok();
    Ok(())
}
fn collect_fee_refferal(
      accts: &mut OrderSwapToken<'_>,
      auto_signer: Pubkey,
      binding: [u8; 1],
      fee:u64
  ) -> Result<()>  {

      let seeds: &[&[&[u8]]] = &[&[
          USER_SEED.as_ref(),
          auto_signer.as_ref(),
          binding.as_ref()
      ]];
    let cpi_context = CpiContext::new_with_signer(
      accts.token_program.to_account_info(),
        Transfer {
            from: accts.from_auto_ata.to_account_info(),
            to: accts.refferal_ata_destination.clone().ok_or(EmptyData)?.to_account_info(),
            authority: accts.auto_account.to_account_info(),
        },
        seeds
    );
    transfer(cpi_context, fee).ok();
    Ok(())
    }
}

#[derive(Accounts)]
pub struct OrderSwapToken<'info> {

  #[account(mut)]
  pub authority: Signer<'info>,
  /// CHECK: function check
  pub signer: UncheckedAccount<'info>,

  #[account(mut)]
  pub auto_account: Box<Account<'info, User>>,

  #[account(mut)]
  pub order: Box<Account<'info, Order>>,

  pub botrole: Account<'info, BotRole>, 

  pub treasure: Box<Account<'info, Treasure>>,

  #[account(mut)]
  /// CHECK: program will check
  pub admin_ata_destination: Box<Account<'info, TokenAccount>>,
  /// CHECK: program will check
  pub admin: AccountInfo<'info>,

  #[account(mut)]
  pub refferal_ata_destination: Option<Account<'info, TokenAccount>>,
  
  pub refferal: Option<Account<'info, User>>,

  #[account(mut)]
  pub pool_coin_token_account: Box<Account<'info, TokenAccount>>,
  
  #[account(mut)]
  pub pool_pc_token_account: Box<Account<'info, TokenAccount>>,

  #[account(mut)]
  pub from_auto_ata: Box<Account<'info, TokenAccount>>,

  #[account(mut)]
  pub to_auto_ata: Box<Account<'info, TokenAccount>>,

  #[account(mut)]
  pub token_mint: Box<Account<'info, Mint>>,

  #[account(mut)]
  pub out_mint: Box<Account<'info, Mint>>,

  
  #[account(mut)]
  /// CHECK: raydium will check
  pub amm_id: AccountInfo<'info>,
  /// CHECK: raydium will check
  pub amm_authority: AccountInfo<'info>,
  /// CHECK: raydium will check
  #[account(mut)]
  pub amm_open_orders: AccountInfo<'info>,

  #[account(mut)]
  /// CHECK: raydium will check
  pub amm_target_orders: AccountInfo<'info>,
  
  /// CHECK: raydium will check
  pub serum_program: AccountInfo<'info>,
  #[account(mut)]
  /// CHECK: raydium will check
  pub serum_market: AccountInfo<'info>,

  #[account(mut)]
  /// CHECK: raydium will check
  pub serum_bids: AccountInfo<'info>,
  
  #[account(mut)]
  /// CHECK: raydium will check
  pub serum_asks: AccountInfo<'info>,
  
  #[account(mut)]
  /// CHECK: raydium will check
  pub serum_event_queue: AccountInfo<'info>,
  
  #[account(mut)]
  /// CHECK: raydium will check
  pub serum_coin_vault: AccountInfo<'info>,
  
  #[account(mut)]
  /// CHECK: raydium will check
  pub serum_pc_vault: AccountInfo<'info>,

  /// CHECK: raydium will check
  pub serum_vault_signer: AccountInfo<'info>,
  
  /// CHECK: raydium will check
  pub raydium_amm_program: AccountInfo<'info>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,
}