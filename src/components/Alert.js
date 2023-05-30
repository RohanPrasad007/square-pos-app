import React from "react";
import { useEffect } from "react";

function Alert({ save, handleCloseAlert }) {
  useEffect(() => {
    const handleEnter = (event) => {
      if (event.key === "y" || event.key === "Y") {
        save();
        handleCloseAlert();
      } else if (event.key === "n" || event.key === "N") {
        handleCloseAlert();
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [save, handleCloseAlert]);

  return (
    <div className=" bg-[#e3ece7] h-64 w-96 mx-auto px-8 rounded-2xl shadow">
      <p class=" py-8 text-2xl  border-b border-black pl-16 mx-auto">
        <b>
          Do you want to
          <br />
          save the invoice?
        </b>
      </p>

      <div class="flex justify-between pt-7">
        <button
          class="w-28 h-9 rounded-lg text-2xl text-white shadow-sm bg-[#316789] hover:bg-[#4C7C9E] transition-all duration-200 ease-linear"
          onClick={() => {
            save();
            handleCloseAlert();
          }}
        >
          Yes
        </button>
        <button
          class="w-28 h-9 rounded-lg text-2xl text-white shadow-sm bg-[#E75B4E] hover:bg-[#d44839] transition-all duration-200 ease-linear"
          onClick={() => handleCloseAlert()}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default Alert;
