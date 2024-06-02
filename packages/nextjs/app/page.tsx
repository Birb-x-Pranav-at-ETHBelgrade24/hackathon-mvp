"use client";

import { useState } from "react";
import FileUpload from "../components/widgets/FileUpload";
import NodeSelect from "../components/widgets/NodeSelect";
import PurchasedQuota from "../components/widgets/PurchaseQuota";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [step, setStep] = useState<number>(1);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {step === 1 && (
          <NodeSelect
            onSucess={() => {
              setStep(2);
            }}
          />
        )}

        <div className="my-2"></div>
        {step === 2 && (
          <PurchasedQuota
            onSucess={() => {
              setStep(3);
            }}
          />
        )}

        <div className="my-2"></div>
        {step === 3 && <FileUpload />}
      </div>
    </>
  );
};

export default Home;
