const Codeeditor = ({ code, setCode }) => {
  return (
    <div className="h-full w-full p-4 bg-gray-900">
      <textarea
        className="w-full h-full p-4 text-sm text-white bg-gray-800 rounded resize-none font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
    </div>
  );
};

export default Codeeditor;
