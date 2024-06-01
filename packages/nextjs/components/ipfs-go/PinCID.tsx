import { useState } from "react";
import { useAccount } from "wagmi";
import { useIPFS } from "~~/hooks/go-ipfs/useIPFS";

const PinCID = () => {
  const { address } = useAccount();
  const { pinCID, loading, error, success } = useIPFS();
  const [cid, setCid] = useState("");

  const handlePin = async () => {
    if (address) {
      await pinCID(cid, address);
    }
  };

  return (
    <div>
      <h1>Pin CID</h1>
      <input type="text" value={cid} onChange={e => setCid(e.target.value)} placeholder="Enter CID" />
      <button onClick={handlePin} disabled={loading}>
        Pin CID
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {success && <p>CID pinned successfully!</p>}
    </div>
  );
};

export default PinCID;
