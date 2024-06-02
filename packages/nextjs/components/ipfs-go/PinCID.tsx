import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useIPFS } from "~~/hooks/go-ipfs/useIPFS";

const PinCID = ({ setTx }: { setTx: any }) => {
  const { address } = useAccount();
  const { pinCID, loading, error, success, tx } = useIPFS();
  const [cid, setCid] = useState("");

  const handlePin = async () => {
    if (address) {
      await pinCID(cid, address);
    }
  };

  useEffect(() => {
    tx && setTx(tx);
  }, [tx]);

  return (
    <div>
      <h1>Pin CID</h1>
      <input
        className="input input-bordered w-full mb-2"
        type="text"
        value={cid}
        onChange={e => setCid(e.target.value)}
        placeholder="Enter CID"
      />
      <button onClick={handlePin} disabled={loading} className=" btn btn-primary float-right">
        Pin CID
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {success && <p>CID pinned successfully!</p>}
    </div>
  );
};

export default PinCID;
