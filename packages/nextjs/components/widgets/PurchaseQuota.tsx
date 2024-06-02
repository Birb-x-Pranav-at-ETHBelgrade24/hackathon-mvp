"use client";

import { useState } from "react";
import { useScaffoldContract } from "../../hooks/scaffold-eth";
import {
  adminAccount,
  brdigeAdminWallet,
  erc20ABI,
  formatBigIntToDecimalString,
  l1Token,
  sendTokenOnL2ToUser,
} from "../../services/bridge";
import { useAccount } from "wagmi";
import { IntegerInput } from "~~/components/scaffold-eth";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ethers = require("ethers");

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

const PurchasedQuota = ({ onSucess }: { onSucess: any }) => {
  const [quotaAmount, setQuotaAmount] = useState<string | bigint>("");
  const [pricePerQuota, setPricePerQuota] = useState<bigint>(0n);
  const [isQuotaLoading, setIsQuotaLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");

  const { address: connectedAddress } = useAccount();

  const { data: storageContract } = useScaffoldContract({
    contractName: "StorageContract",
  });

  const bridgeAmount = pricePerQuota * BigInt(quotaAmount);

  storageContract?.read
    .pricePerQuota()
    .then((_quota: bigint) => {
      setPricePerQuota(_quota);
    })
    .finally(() => {
      setIsQuotaLoading(false);
    });

  if (isQuotaLoading) {
    return <span className="loading loading-spinner loading-xs"></span>;
  }

  const handleClick = async () => {
    if (connectedAddress) {
      // 1. all the bridging
      setStatus("Bridging from home chain to op stack");
      await sendErc20ToAdminOnL1(bridgeAmount);
      await brdigeAdminWallet(bridgeAmount);

      // // // 2. send to user
      await sendTokenOnL2ToUser(bridgeAmount, connectedAddress);

      // 3. call purcahsedQuota
      setStatus("Bridging completed! Now initiating purchase");

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
        setStatus("");
        onSucess();
      }
    } else {
      alert("no connected address");
    }
  };

  return (
    <div className="card p-1 w-96 bg-base-100 shadow-xl">
      <div className="card-title my-2 text-center w-100">
        <h1 className="w-full">Buy STOP storage with USDC</h1>
      </div>
      <IntegerInput
        value={quotaAmount}
        onChange={updatedTxValue => {
          setQuotaAmount(updatedTxValue);
        }}
        placeholder="Enter amount"
      />
      <div className="card-body p-1">
        <>
          {quotaAmount && (
            <p className="text-right">
              You will pay: {formatBigIntToDecimalString(pricePerQuota * BigInt(quotaAmount), 1n, 6)} USDC
            </p>
          )}
          <button onClick={handleClick} className=" btn btn-primary float-right">
            Purchase
          </button>

          <div className="card-actions justify-end"></div>
          <div>
            {status && <span className="loading loading-spinner loading-xs mr-2"></span>}
            {status && status + "..."}
          </div>
        </>
      </div>
    </div>
  );
};

export default PurchasedQuota;
