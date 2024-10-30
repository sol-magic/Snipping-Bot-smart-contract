use anchor_lang::prelude::*;

#[account]
pub struct Treasure {
    pub admin: Pubkey,
    pub collection: Pubkey
}
#[account]
pub struct User {
    pub owner:Pubkey,
    pub refferal:Option<Pubkey>,
    pub refferal_numbers:u64,
}

#[account]
pub struct BotRole {
    pub addresses:Vec<Pubkey>
}
#[account]
pub struct Order {
    pub open:bool,
    pub order_type: u8,
    pub owner:Pubkey,
    pub holder:bool,
    pub rpc:String,
    pub side:bool,
    pub from_token:Pubkey,
    pub from_token_ata:Pubkey,
    pub to_token:Pubkey,
    pub to_token_ata:Pubkey,
    pub amount: u64,
    pub amount_expected:u64,
    pub interval:u64,
    pub slippage_bips:u64,
    pub limit:u64,
    pub timestamp:u64,
    pub orders:u64,
    pub fill:u64,
}