import { useState, useEffect } from "react";
import axios from "axios";

const StockTable = () => {
  const [stocks, setStocks] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [inputQuantity, setInputQuantity] = useState("");
  const [newStockName, setNewStockName] = useState("");
  const [newStockPrice, setNewStockPrice] = useState("");
  const [newStockQuantity, setNewStockQuantity] = useState("");

  // Fetch stocks from MongoDB
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stocks');
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stocks", error);
      }
    };

    fetchStocks();
  }, []);

  // Handle Add Stock
  const addNewItem = async () => {
    if (!newStockName || !newStockPrice || isNaN(newStockPrice) || newStockPrice <= 0 || isNaN(newStockQuantity) || newStockQuantity <= 0) {
      toast("Please enter valid stock name, price, and quantity!");
      return;
    }

    const newStock = {
      name: newStockName,
      price: newStockPrice,
      quantity: newStockQuantity
    };

    try {
      const response = await axios.post('http://localhost:5000/api/stocks', newStock);
      setStocks([...stocks, response.data]); // Add new stock to UI
      setNewStockName("");
      setNewStockPrice("");
      setNewStockQuantity("");
      closeModal();
    } catch (error) {
      toast("Error adding stock!");
    }
  };

  // Handle Update (buy/sell)
  const handleUpdate = async () => {
    const { id, action } = modalData;
    const item = stocks.find((stock) => stock.id === id);
    const quantityToUpdate = Number(inputQuantity);

    if (action === "buy" && quantityToUpdate <= 0) {
      toast("Invalid Request! Buy At least One Item");
      return;
    }

    const newQuantity = action === "buy" ? item.quantity + quantityToUpdate : item.quantity - quantityToUpdate;
    const updatedStock = { quantity: newQuantity };

    try {
      await axios.put(`http://localhost:5000/api/stocks/${id}`, updatedStock);
      const updatedStocks = stocks.map((stock) =>
        stock.id === id ? { ...stock, quantity: newQuantity } : stock
      );
      setStocks(updatedStocks);
      closeModal();
    } catch (error) {
      toast("Error updating stock!");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Stock Management System</h1>
        <button
          onClick={() => openModal(null, "add")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ADD ITEMS
        </button>
      </div>

      {/* Stock Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Serial No.</th>
            <th className="border p-2">Stock Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price (₹)</th>
            <th className="border p-2">Total Amount (₹)</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((item, index) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.price}</td>
              <td className="border p-2">{item.quantity * item.price}</td>
              <td className="border p-2">
                <button
                  onClick={() => openModal(item.id, "buy")}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                >
                  Buy
                </button>
                <button
                  onClick={() => openModal(item.id, "sell")}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Stock Add */}
      {modalData && modalData.action === "add" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-lg font-bold mb-4">Add New Stock Item</h2>
            <label className="block mb-2">Stock Name:</label>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
            />
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              className="w-full border p-2 mb-4"
              value={newStockPrice}
              onChange={(e) => setNewStockPrice(e.target.value)}
            />
            <label className="block mb-2">Quantity:</label>
            <input
              type="number"
              className="w-full border p-2 mb-4"
              value={newStockQuantity}
              onChange={(e) => setNewStockQuantity(e.target.value)}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addNewItem}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Buy/Sell */}
      {modalData && modalData.action !== "add" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {modalData.action === "buy" ? "Buy Stock" : "Sell Stock"}
            </h2>
            <label className="block mb-2">Enter Quantity:</label>
            <input
              type="number"
              className="w-full border p-2 mb-4"
              value={inputQuantity}
              onChange={(e) => setInputQuantity(e.target.value)}
              min="0"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div>
        <button onClick={toast}></button>
        <ToastContainer />
      </div>
      
    </div>
  );
};



export default StockTable;

