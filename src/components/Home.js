import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="flex justify-evenly flex-wrap items-center"
      style={{ height: "calc(100vh - 96px)" }}
    >
      <Link
        to="/pos"
        className="text-2xl text-black flex flex-col justify-evenly items-center bg-gray-100 w-40 h-40 rounded-2xl shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[#E75B4E] hover:border-2"
      >
        <img src="./assets/pos.svg" alt="POS" className="w-24 h-24" />
        POS
      </Link>
      <Link
        to="/invoices"
        className="text-2xl text-black flex flex-col justify-evenly items-center bg-gray-100 w-40 h-40 rounded-2xl shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[#E75B4E] hover:border-2"
      >
        <img src="./assets/invoice.svg" alt="invoice" className="w-24 h-24" />
        Invoices
      </Link>
    </div>
  );
}

export default Home;
