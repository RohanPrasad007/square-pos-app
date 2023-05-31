import React, { useState } from "react";

function AddCustomer({ handleCloseAddCustomer, setLoading, getCustomers }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleName, setVehicleName] = useState("");

  const addCustomer = async () => {
    setLoading(true);

    const customer = {
      name,
      address,
      pincode,
      phone,
      email,
      vehicleNumber,
      vehicleName,
    };
    await window.api.addCustomer(customer);
    setLoading(false);
    getCustomers();
    handleCloseAddCustomer();
  };
  return (
    <div className="bg-[#ECF2FC] p-5 rounded-xl w-[600px]">
      <h3 className="text-2xl font-bold">Add Customer</h3>
      <hr className="border-black border my-3" />
      <div>
        <p className="text-xl font-semibold text-[#E75B4E] underline">
          Personal
        </p>
        <div className="flex items-center my-4">
          <label
            htmlFor="fullName"
            className="text-base font-medium text-gray-700 w-1/4"
          >
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            required
            type="text"
            className="block w-3/4 rounded-md bg-white border border-gray-300 shadow-sm py-1 px-3 focus:outline-none text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="fullName"
            name="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex items-center my-4">
          <label
            htmlFor="address"
            className="text-base font-medium text-gray-700 w-1/4"
          >
            Address:
          </label>
          <textarea
            required
            type="text"
            className="block w-3/4 rounded-md bg-white border border-gray-300 shadow-sm py-1 px-3 focus:outline-none text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex items-center my-4">
          <label
            htmlFor="pincode"
            className="text-base font-medium text-gray-700 w-1/4"
          >
            Pin-code:
          </label>
          <input
            required
            type="text"
            className="block w-3/4 rounded-md bg-white border border-gray-300 shadow-sm py-1 px-3 focus:outline-none text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="pincode"
            name="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>
        <div className="flex items-center my-4">
          <label
            htmlFor="number"
            className="text-base font-medium text-gray-700 w-1/4"
          >
            Phone number: <span className="text-red-600">*</span>
          </label>
          <input
            required
            type="tel"
            className="block w-3/4 rounded-md bg-white border border-gray-300 shadow-sm py-1 px-3 focus:outline-none text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="number"
            name="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex items-center my-4">
          <label
            htmlFor="email"
            className="text-base font-medium text-gray-700 w-1/4"
          >
            Email: <span className="text-red-600">*</span>
          </label>
          <input
            required
            type="email"
            className="block w-3/4 rounded-md bg-white border border-gray-300 shadow-sm py-1 px-3 focus:outline-none text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold text-[#E75B4E] underline">
          Vehicle
        </p>
        <div className="flex items-center my-4">
          <label
            htmlFor="vehicleNumber"
            className="text-base font-medium text-gray-700 w-1/4"
          >
            Vehicle Number: <span className="text-red-600">*</span>
          </label>
          <input
            required
            type="text"
            className="block w-3/4 rounded-md bg-white border border-gray-300 shadow-sm py-1 px-3 focus:outline-none text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="vehicleNumber"
            name="vehicleNumber"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center my-4">
          <label
            htmlFor="vehicleName"
            className="text-base font-medium text-gray-700 w-1/4"
          >
            Vehicle Name: <span className="text-red-600">*</span>
          </label>
          <input
            required
            type="text"
            className="block w-3/4 rounded-md bg-white border border-gray-300 shadow-sm py-1 px-3 focus:outline-none text-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="vehicleName"
            name="vehicleName"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <button
          className="py-2 px-4 rounded-lg text-[#E75B4E] font-semibold shadow-sm bg-white hover:bg-[#E75B4E] hover:text-white transition-all duration-200 ease-linear"
          onClick={() => handleCloseAddCustomer()}
        >
          Cancel
        </button>
        <button
          className="py-2 px-4 rounded-lg text-[#E75B4E] font-semibold shadow-sm bg-white hover:bg-[#E75B4E] hover:text-white transition-all duration-200 ease-linear"
          onClick={() => addCustomer()}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default AddCustomer;
