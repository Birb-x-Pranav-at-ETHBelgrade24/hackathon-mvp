"use client";

import { useEffect, useState } from "react";
import { useScaffoldContract } from "../../hooks/scaffold-eth";
import { NextPage } from "next";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ethers = require("ethers");

const Operator: NextPage = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [price, setPrice] = useState<any>(0);
  const signer = provider.getSigner();
  const [events, setEvents] = useState<any[]>([]);
  const [quotaUsedEvents, setQuotaUsedEvents] = useState<any[]>([]);

  const handleClick = async () => {
    if (storageContract) {
      const storageContractInstance = new ethers.Contract(storageContract.address, storageContract.abi, signer);
      const tx = await storageContractInstance.setPricePerQuota(price);
      console.log("Transaction receipt:", tx);
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
      alert("price updated!");
    }
  };

  const { data: storageContract } = useScaffoldContract({
    contractName: "StorageContract",
  });

  useEffect(() => {
    if (storageContract) {
      const storateContractInstance = new ethers.Contract(storageContract?.address, storageContract?.abi, signer);
      storateContractInstance.queryFilter("QuotaPurchased").then(setEvents);
      storateContractInstance.queryFilter("QuotaUsed").then(setQuotaUsedEvents);
    }
  }, [storageContract?.address]);

  console.log({ events });

  return (
    <div className="pt-10">
      <h1 className="text-4xl ">Operator dashboard</h1>

      <div className="flex flex-row">
        <div className="card p-1 mx-4 w-96 bg-base-100 shadow-xl">
          <div className="card-title my-2 text-center w-100"></div>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Quota used</h1>
            <ul className="space-y-4">
              {quotaUsedEvents.map((item, index) => (
                <li key={index} className=" shadow rounded-lg p-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">Block Number: {item.blockNumber}</span>
                    <span className="text-sm text-gray-500">
                      <a
                        href={`https://sepolia-optimism.etherscan.io/tx/${item.transactionHash}`}
                        className="text-right"
                        target="_blank"
                      >
                        View on Blockexplorer
                      </a>
                    </span>
                    <span className="text-sm text-gray-500">View on Block</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card p-1 w-96 bg-base-100 shadow-xl mt-2">
          <div className="card-title my-2 text-center w-100"></div>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Quota Purchased</h1>
            <ul className="space-y-4">
              {events.map((item, index) => (
                <li key={index} className=" shadow rounded-lg p-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">Block Number: {item.blockNumber}</span>
                    <span className="text-sm text-gray-500">
                      <a
                        href={`https://sepolia-optimism.etherscan.io/tx/${item.transactionHash}`}
                        className="text-right"
                        target="_blank"
                      >
                        View on Blockexplorer
                      </a>
                    </span>
                    <span className="text-sm text-gray-500">View on Block</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="card mx-4 p-1 w-96 bg-base-100 shadow-xl mt-2">
          <div className="card-title my-2 text-center w-100">
            <h1 className="w-full">Set price per quota</h1>
          </div>
          <div className="card-body">
            <input
              onChange={e => setPrice(e?.target?.value)}
              className="input input-bordered w-full mb-2"
              type="number"
              placeholder="Set price"
              value={price}
            />
            <button onClick={handleClick} className=" btn btn-primary float-right">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operator;
