import { Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const optimism = require("@eth-optimism/sdk");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ethers = require("ethers");
const privateKey = "69d65f530d05f85d27958361cf3ec82485ab83bdc97b04c9af20fc74e30e7a48";
export const adminAccount = privateKeyToAccount(`0x${privateKey}`);

export const l1Token = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; //sepolia
export const l2Token = "0x629c2fd5d5F432357465B59D7832389A89956f0B"; // op-sepolia

const l1Provider = new ethers.providers.StaticJsonRpcProvider("https://rpc.ankr.com/eth_sepolia");
const l2Provider = new ethers.providers.StaticJsonRpcProvider("https://sepolia.optimism.io");
const l1Wallet = new ethers.Wallet(privateKey, l1Provider);
const l2Wallet = new ethers.Wallet(privateKey, l2Provider);
export const erc20ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

const l1ERC20 = new ethers.Contract(l1Token, erc20ABI, l1Wallet);
const l2ERC20 = new ethers.Contract(l2Token, erc20ABI, l2Wallet);
const messenger = new optimism.CrossChainMessenger({
  l1ChainId: 11155111, // 11155111 for Sepolia, 1 for Ethereum
  l2ChainId: 11155420, // 11155420 for OP Sepolia, 10 for OP Mainnet
  l1SignerOrProvider: l1Wallet,
  l2SignerOrProvider: l2Wallet,
});

export const brdigeAdminWallet = async (usdc: bigint) => {
  try {
    let tx = await messenger.approveERC20(l1Token, l2Token, usdc);
    console.log("bridge: ", "fetching approval");
    await tx.wait();

    tx = await messenger.approveERC20(l1Token, l2Token, usdc);
    console.log("bridge: ", "fetching approval");
    await tx.wait();

    tx = await messenger.depositERC20(l1Token, l2Token, usdc);
    console.log("bridge: ", "depositing eth to bridge");
    await tx.wait();

    console.log("bridge: ", "waiting for message status to update");
    await messenger.waitForMessageStatus(tx.hash, optimism.MessageStatus.RELAYED);

    console.log("bridge: success! new balance on mainnet: ", (await l1ERC20.balanceOf(l1Wallet.address)).toString());

    console.log("bridge: success! new balance on layer 2: ", (await l2ERC20.balanceOf(l2Wallet.address)).toString());

    return true;
  } catch (error) {
    console.log("bdrige: error: ", error);
    return false;
  }
};

export const sendTokenOnL2ToUser = async (usdc: bigint, user: Address) => {
  console.log("sending usdc to user on l2");
  const tx = await l2ERC20.transfer(user, usdc);
  console.log("Transaction hash:", tx.hash);

  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);
};

export function formatBigIntToDecimalString(numerator: bigint, denominator: bigint, decimalPlaces: number) {
  const result = (numerator * BigInt(2)) / denominator;
  let resultString = result.toString();

  // Ensure the result string has at least `decimalPlaces` + 1 length for inserting the decimal point
  while (resultString.length <= decimalPlaces) {
    resultString = "0" + resultString;
  }

  // Insert the decimal point at the correct position
  const decimalPosition = resultString.length - decimalPlaces;
  const formattedString = resultString.slice(0, decimalPosition) + "." + resultString.slice(decimalPosition);

  return formattedString;
}
