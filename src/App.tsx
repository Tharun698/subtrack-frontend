import { useState } from "react";

function App() {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addSubscription = () => {
    if (input.trim() === "") return;
    setSubscriptions([...subscriptions, input]);
    setInput("");
  };

  const removeSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Subscription Tracker
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter subscription..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-3 py-2 rounded-lg w-64"
        />
        <button
          onClick={addSubscription}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md">
        {subscriptions.map((sub, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white shadow p-3 rounded-lg mb-2"
          >
            <span>{sub}</span>
            <button
              onClick={() => removeSubscription(index)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;