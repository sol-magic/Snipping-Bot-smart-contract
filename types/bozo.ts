export type Bozo = {
  "version": "0.1.0",
  "name": "bozo",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "collection",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "refferal",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "changeCollection",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newCollection",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addBot",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bot",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "rmvBot",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bot",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createOrder",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFromMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenToMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "types",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minAmountExpected",
          "type": "u64"
        },
        {
          "name": "rpc",
          "type": "string"
        },
        {
          "name": "side",
          "type": "bool"
        },
        {
          "name": "interval",
          "type": "u64"
        },
        {
          "name": "orders",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "nftMetadata",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "limit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeOrder",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFromMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromSignerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "depositSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createOrderAndDeposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFromMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenToMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromSignerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "types",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minAmountExpected",
          "type": "u64"
        },
        {
          "name": "rpc",
          "type": "string"
        },
        {
          "name": "side",
          "type": "bool"
        },
        {
          "name": "interval",
          "type": "u64"
        },
        {
          "name": "orders",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "nftMetadata",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "limit",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createOrderAndSolDeposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenToMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "types",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minAmountExpected",
          "type": "u64"
        },
        {
          "name": "rpc",
          "type": "string"
        },
        {
          "name": "side",
          "type": "bool"
        },
        {
          "name": "interval",
          "type": "u64"
        },
        {
          "name": "orders",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "nftMetadata",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "limit",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "autoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "orderSwap",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adminAtaDestination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "refferalAtaDestination",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "refferal",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "poolCoinTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolPcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammOpenOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammTargetOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumBids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAsks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumEventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumCoinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumPcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumVaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "raydiumAmmProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenamountPerSwapAmount",
          "type": "u64"
        },
        {
          "name": "platformFeeBips",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "treasure",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "collection",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "refferal",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "refferalNumbers",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "botRole",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "addresses",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "open",
            "type": "bool"
          },
          {
            "name": "orderType",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "holder",
            "type": "bool"
          },
          {
            "name": "rpc",
            "type": "string"
          },
          {
            "name": "side",
            "type": "bool"
          },
          {
            "name": "fromToken",
            "type": "publicKey"
          },
          {
            "name": "fromTokenAta",
            "type": "publicKey"
          },
          {
            "name": "toToken",
            "type": "publicKey"
          },
          {
            "name": "toTokenAta",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "amountExpected",
            "type": "u64"
          },
          {
            "name": "interval",
            "type": "u64"
          },
          {
            "name": "slippageBips",
            "type": "u64"
          },
          {
            "name": "limit",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "orders",
            "type": "u64"
          },
          {
            "name": "fill",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "NotAllowedAuthority",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6002,
      "name": "IncorrectAmount",
      "msg": "Incorrect Amount."
    },
    {
      "code": 6003,
      "name": "AddressExist",
      "msg": "Address already exist."
    },
    {
      "code": 6004,
      "name": "OrderFinish",
      "msg": "Order Finish."
    },
    {
      "code": 6005,
      "name": "OrderFilled",
      "msg": "Order Completely Filled."
    },
    {
      "code": 6006,
      "name": "IncorrectTime",
      "msg": "Incorrect Time to Execute."
    },
    {
      "code": 6007,
      "name": "IncorrectNFT",
      "msg": "Incorrect NFT Definition."
    },
    {
      "code": 6008,
      "name": "IncorrectDefinition",
      "msg": "Incorrect Order Definition."
    },
    {
      "code": 6009,
      "name": "ZeroAddressDetected",
      "msg": "ZeroAddressDetected"
    },
    {
      "code": 6010,
      "name": "IncorrectAssociated",
      "msg": "Incorrect associated account"
    },
    {
      "code": 6011,
      "name": "MathOverflow",
      "msg": "Math Operation Overflow"
    },
    {
      "code": 6012,
      "name": "EmptyData",
      "msg": "account with empty data"
    }
  ]
};

export const IDL: Bozo = {
  "version": "0.1.0",
  "name": "bozo",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "collection",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "refferal",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "changeCollection",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newCollection",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addBot",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bot",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "rmvBot",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bot",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createOrder",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFromMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenToMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "types",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minAmountExpected",
          "type": "u64"
        },
        {
          "name": "rpc",
          "type": "string"
        },
        {
          "name": "side",
          "type": "bool"
        },
        {
          "name": "interval",
          "type": "u64"
        },
        {
          "name": "orders",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "nftMetadata",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "limit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeOrder",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFromMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromSignerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "depositSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createOrderAndDeposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFromMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenToMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromSignerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "types",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minAmountExpected",
          "type": "u64"
        },
        {
          "name": "rpc",
          "type": "string"
        },
        {
          "name": "side",
          "type": "bool"
        },
        {
          "name": "interval",
          "type": "u64"
        },
        {
          "name": "orders",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "nftMetadata",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "limit",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createOrderAndSolDeposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenToMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refferal",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "nftAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "types",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minAmountExpected",
          "type": "u64"
        },
        {
          "name": "rpc",
          "type": "string"
        },
        {
          "name": "side",
          "type": "bool"
        },
        {
          "name": "interval",
          "type": "u64"
        },
        {
          "name": "orders",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "nftMetadata",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "limit",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "autoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "orderSwap",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "autoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adminAtaDestination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "refferalAtaDestination",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "refferal",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "poolCoinTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolPcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAutoAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammOpenOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammTargetOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumBids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAsks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumEventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumCoinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumPcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumVaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "raydiumAmmProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenamountPerSwapAmount",
          "type": "u64"
        },
        {
          "name": "platformFeeBips",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "treasure",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "collection",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "refferal",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "refferalNumbers",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "botRole",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "addresses",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "open",
            "type": "bool"
          },
          {
            "name": "orderType",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "holder",
            "type": "bool"
          },
          {
            "name": "rpc",
            "type": "string"
          },
          {
            "name": "side",
            "type": "bool"
          },
          {
            "name": "fromToken",
            "type": "publicKey"
          },
          {
            "name": "fromTokenAta",
            "type": "publicKey"
          },
          {
            "name": "toToken",
            "type": "publicKey"
          },
          {
            "name": "toTokenAta",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "amountExpected",
            "type": "u64"
          },
          {
            "name": "interval",
            "type": "u64"
          },
          {
            "name": "slippageBips",
            "type": "u64"
          },
          {
            "name": "limit",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "orders",
            "type": "u64"
          },
          {
            "name": "fill",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "NotAllowedAuthority",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6002,
      "name": "IncorrectAmount",
      "msg": "Incorrect Amount."
    },
    {
      "code": 6003,
      "name": "AddressExist",
      "msg": "Address already exist."
    },
    {
      "code": 6004,
      "name": "OrderFinish",
      "msg": "Order Finish."
    },
    {
      "code": 6005,
      "name": "OrderFilled",
      "msg": "Order Completely Filled."
    },
    {
      "code": 6006,
      "name": "IncorrectTime",
      "msg": "Incorrect Time to Execute."
    },
    {
      "code": 6007,
      "name": "IncorrectNFT",
      "msg": "Incorrect NFT Definition."
    },
    {
      "code": 6008,
      "name": "IncorrectDefinition",
      "msg": "Incorrect Order Definition."
    },
    {
      "code": 6009,
      "name": "ZeroAddressDetected",
      "msg": "ZeroAddressDetected"
    },
    {
      "code": 6010,
      "name": "IncorrectAssociated",
      "msg": "Incorrect associated account"
    },
    {
      "code": 6011,
      "name": "MathOverflow",
      "msg": "Math Operation Overflow"
    },
    {
      "code": 6012,
      "name": "EmptyData",
      "msg": "account with empty data"
    }
  ]
};
