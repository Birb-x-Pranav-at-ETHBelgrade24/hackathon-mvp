const NodeSelect = ({ onSucess }: { onSucess: any }) => {
  return (
    <div className="card p-1 w-96 bg-base-100 shadow-xl">
      <div className="card-title my-2 text-center w-100">
        <h1 className="w-full">Select a STOP storage provider</h1>
      </div>

      <div className="card-body p-1">
        <ul className="menu bg-base-200  rounded-box">
          <li>
            <div>
              <a onClick={onSucess}>
                Dercio&apos;s Node &nbsp;
                <span className="italic float-right">1 USDC / quota</span>
              </a>
              <p>Uptime: 99%</p>
            </div>
          </li>
          <li>
            <div>
              <a onClick={onSucess}>
                Pranav MVP node &nbsp;
                <span className="italic float-right">1 USDC / quota</span>
              </a>
              <p>Uptime: 98%</p>
            </div>
          </li>
          <li>
            <div>
              <a onClick={onSucess}>
                TalentLayer &nbsp;
                <span className="italic float-right">1 USDC / quota</span>
              </a>
              <p>Uptime: 99.999%</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NodeSelect;
