import { NextPage } from "next";

const Operator: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <h1 className="text-4xl ">Operator dashboard</h1>
      <div className="card p-1 w-96 bg-base-100 shadow-xl">
        <div className="card-title my-2 text-center w-100">
          <h1 className="w-full">Total Purchased</h1>
        </div>
      </div>
    </div>
  );
};

export default Operator;
