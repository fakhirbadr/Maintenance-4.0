import React, { useState } from "react";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={`bg-gray-500/20 rounded-lg animate-pulse ${className}`}
      {...props}
    ></div>
  );
}

const Test = () => {
  const [state, setState] = useState("success");
  return (
    <main className="bg-slate-950 text-slate-100 h-screen grid place-content-center">
      <Skeleton className="h-40 w-96" />
    </main>
  );
};

export default Test;
