import React from "react";

function Header() {
  return (
    <div className="h-24 bg-gray-100 px-4 flex items-center justify-around gap-8">
      <img src="./assets/icon.svg" alt="icon" className="h-[80%]" />
      <img src="./assets/logo.svg" alt="Rohan Auto Care" className="h-[80%]" />
    </div>
  );
}

export default Header;
