import { useState } from "react";
import axios from "axios";

export const useIPFS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const pinCID = async (cid: string, address: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.get(`http://localhost:3030/pincid/${cid}`, {
        headers: { Authorization: `Bearer ${address}` },
      });
      setSuccess(true);
    } catch (err) {
      setError("Error pinning CID");
      console.error(err, "================");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, address: string) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3030/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${address}`,
        },
      });
      setSuccess(true);
      return response.data.cid;
    } catch (err) {
      setError("Error uploading file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { pinCID, uploadFile, loading, error, success };
};
