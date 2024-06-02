import { NextPage } from "next";

const Operator: NextPage = () => {
  return (
    <div className="pt-10">
      <h1 className="text-4xl ">Operator dashboard</h1>

      <div className="flex flex-row">
        <div className="card p-1 mx-4 w-96 bg-base-100 shadow-xl">
          <div className="card-title my-2 text-center w-100">
            <h1 className="w-full">Total Purchased</h1>
          </div>
        </div>

        <div className="card p-1 w-96 bg-base-100 shadow-xl mt-2">
          <div className="card-title my-2 text-center w-100">
            <h1 className="w-full">Event logs</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="card mx-4 p-1 w-96 bg-base-100 shadow-xl mt-2">
          <div className="card-title my-2 text-center w-100">
            <h1 className="w-full">Set price per quota</h1>
          </div>
          <div className="card-body">
            <input className="input input-bordered w-full mb-2" type="text" placeholder="Set price" />
            <button className=" btn btn-primary float-right">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operator;
