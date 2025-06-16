const Testcase = ({ input, setInput, output }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-medium mb-1">Input</label>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 p-2 border rounded bg-white"
          placeholder="Enter custom input"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Verdict</label>
        <div className="w-full h-24 p-2 border rounded bg-gray-100 text-green-700 font-semibold">
          {output}
        </div>
      </div>
    </div>
  );
};

export default Testcase;
