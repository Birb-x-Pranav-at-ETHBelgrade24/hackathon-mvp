const NodeSelect = ({ onSucess }: { onSucess: any }) => {
  return (
    <div className="card p-1 w-96 bg-base-100 shadow-xl">
      <div className="card-title my-2 text-center w-100">
        <h1 className="w-full">Select a STOP storage provider</h1>
      </div>

      <div className="card-body p-1">List of nodes goes here</div>
      <button onClick={onSucess}>select Node</button>
    </div>
  );
};

export default NodeSelect;
