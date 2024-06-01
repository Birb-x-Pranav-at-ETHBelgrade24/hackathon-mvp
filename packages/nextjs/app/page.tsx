"use client";

import { useState } from "react";
import Link from "next/link";
import { useDeployedContractInfo, useScaffoldContract } from "../hooks/scaffold-eth";
import {
  adminAccount,
  brdigeAdminWallet,
  erc20ABI,
  formatBigIntToDecimalString,
  l1Token,
  sendTokenOnL2ToUser,
} from "../services/bridge";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ethers = require("ethers");

const Home: NextPage = () => {
  const [quotaAmount, setQuotaAmount] = useState<number>(0);
  const [pricePerQuota, setPricePerQuota] = useState<bigint>(0n);
  const { address: connectedAddress } = useAccount();

  const { data: storageContract } = useScaffoldContract({
    contractName: "StorageContract",
  });

  const { data: deployedContractData } = useDeployedContractInfo("StorageContract");

  console.log({ deployedContractData });

  storageContract?.read.pricePerQuota().then(setPricePerQuota);
  const bridgeAmount = pricePerQuota * BigInt(quotaAmount);

  const sendErc20ToAdminOnL1 = async (usdc: bigint) => {
    await window?.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xAA36A7" }],
    });

    // Create a new provider and signer from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create a new instance of the token contract
    const tokenContract = new ethers.Contract(l1Token, erc20ABI, signer);

    // Send the tokens
    const tx = await tokenContract.transfer(adminAccount.address, usdc);
    console.log("Transaction receipt:", tx);
    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);
  };

  const handleClick = async () => {
    if (connectedAddress) {
      // 1. all the bridging
      await sendErc20ToAdminOnL1(bridgeAmount);
      await brdigeAdminWallet(bridgeAmount);

      // // // 2. send to user
      await sendTokenOnL2ToUser(bridgeAmount, connectedAddress);

      // 3. call purcahsedQuota
      console.log("starting quota purchase by switching to op again");

      await window?.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa37dc" }],
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      if (storageContract) {
        const storageContractInstance = new ethers.Contract(storageContract.address, storageContract.abi, signer);
        const tx = await storageContractInstance.purchasedQuota(quotaAmount);
        console.log("Transaction receipt:", tx);
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);
      }
    } else {
      alert("no connected address");
    }
  };

  console.log({ pricePerQuota });
  return (
    <>
      <input type="number" onChange={e => setQuotaAmount(parseInt(e?.target?.value) || 0)} value={quotaAmount} />

      {pricePerQuota}
      {pricePerQuota && (
        <div>You will pay: {formatBigIntToDecimalString(pricePerQuota * BigInt(quotaAmount), 1n, 6)}</div>
      )}
      {pricePerQuota && <div>You will pay: {((pricePerQuota * BigInt(quotaAmount)) / 1000000n).toString()}</div>}
      <button onClick={handleClick}>purchase quota</button>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
