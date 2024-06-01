import { useState } from "react";
import { useAccount } from "wagmi";
import { useIPFS } from "~~/hooks/go-ipfs/useIPFS";

const UploadFile = () => {
  const { address } = useAccount();
  const { uploadFile, loading, error, success } = useIPFS();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (file && address) {
      const cid = await uploadFile(file, address);
      if (cid) {
        alert(`File uploaded successfully! CID: ${cid}`);
      }
    }
  };

  return (
    <div>
      <h1>Upload File</h1>
      <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
      <button onClick={handleUpload} disabled={loading || !file}>
        Upload
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {success && <p>File uploaded successfully!</p>}
    </div>
  );
};

export default UploadFile;