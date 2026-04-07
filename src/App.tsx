import { useState } from "react";

function App() {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addSubscription = () => {
    if (!input.trim()) return;
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter subscription"
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={addSubscription}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md">
        {subscriptions.map((sub, index) => (
          <li
            key={index}
            className="flex justify-between bg-white p-3 mb-2 rounded shadow"
          >
            {sub}
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