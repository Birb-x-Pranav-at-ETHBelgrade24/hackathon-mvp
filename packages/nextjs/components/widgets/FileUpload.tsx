import PinCID from "../ipfs-go/PinCID";
import UploadFile from "../ipfs-go/UploadFile";

const FileUpload = () => {
  return (
    <div className="card p-1 w-96 bg-base-100 shadow-xl">
      <div className="card-title my-2 text-center w-100">
        <h1 className="w-full px-2">Upload your files to the STOP ecosystem</h1>
      </div>

      <div className="card-body p-1">
        <PinCID />

        <h1 className="text-center w-full">OR</h1>

        <UploadFile />
      </div>
    </div>
  );
};

export default FileUpload;
