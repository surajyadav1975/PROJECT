import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { SunIcon } from '@heroicons/react/24/solid';
import socket from "../socket/Socket";

const Compiler = () => {
  const [code, setCode] = useState(`#include<bits/stdc++.h>
using namespace std;

int main(){
    // Write your code here...
    return 0;
}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [tosocketid, settosocketid] = useState(null);
  const [invitePrompt, setInvitePrompt] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showInviteList, setShowInviteList] = useState(false);
  const userName = localStorage.getItem('userName');
  

  useEffect(() => {
    const handleConnect = () => {
            console.log('🎉 Connected successfully with ID:', socket.id, userName);
            socket.emit('user-online', userName);
        };

        const handleUpdateOnlineUsers = (users) => {
            setOnlineUsers(users.filter(user => user !== userName));
            console.log('Updated online users:', users);
        };

        const handleReceiveInvite = ({ fromUserId}) => {
            setInvitePrompt({ fromUserId});
        };

        const handleInviteAccepted = ({ roomId, a, b }) => {
            console.log('✅ Invite accepted, room:', roomId);
            settosocketid(b);
            setInviteLoading(false);
            setShowInviteList(false);
            alert('✅ Connected! You are now collaborating. To disconnect just leave the page');
        };

        const handleInviteRejected = ({ roomId, a, b }) => {
            console.log('✅ Invite accepted, room:', roomId);
            settosocketid(null);
            setInviteLoading(false);
            setShowInviteList(false);
            alert('❌ Connection Rejected');
        };

        const handleReceiveCode = ({ code }) => {
            setCode(code);
        };

        const handleDisconnect = () => {
            console.log('❌ Disconnected from server');
        };

        socket.on('connect', handleConnect);
        socket.on('update-online-users', handleUpdateOnlineUsers);
        socket.on('receive-invite', handleReceiveInvite);
        socket.on('invite-accepted', handleInviteAccepted);
        socket.on('invite-rejected', handleInviteRejected);
        socket.on('receive-code', handleReceiveCode);
        socket.on('disconnect', handleDisconnect);

        if (socket.connected) {
            handleConnect();
        }


        return () => {
            socket.off('connect', handleConnect);
            socket.off('update-online-users', handleUpdateOnlineUsers);
            socket.off('receive-invite', handleReceiveInvite);
            socket.off('invite-accepted', handleInviteAccepted);
            socket.off('receive-code', handleReceiveCode);
            socket.off('disconnect', handleDisconnect);
        };
    }, [userName]);

  const handleSendInvite = (toUserId) => {
    setInviteLoading(true);
    socket.emit('send-invite', { fromUserId: userName, toUserId });
  };

  const handleRun = async () => {
    try {
      const response = await axios.post(`http://localhost:8752/run`, { code, language, input }, { withCredentials: true });
      setOutput(response.data.output.output);
    } catch (err) {
      setOutput(err.response?.data?.message || 'Error running code');
    }
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguage(value);
    const templates = {
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n    // Write your code here...\n    return 0;\n}`,
      py: `# Write your code here...\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`,
      java: `// Write your code here...\nfunction main() {\n    \n}\n\nmain();`,
      c: `#include <stdio.h>\n\nint main() {\n    // Write your code here...\n    return 0;\n}`,
      js: `// Write your code here...\nfunction main() {\n    console.log("Hello, World!");\n}\n\nmain();`
    };
    setCode(templates[value] || '// Write your code here...');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex justify-between items-center border-b px-6 py-3 bg-white shadow">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border px-3 py-2 rounded focus:outline-none"
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="py">Python</option>
          <option value="js">JavaScript</option>
        </select>
        <div className="flex gap-3">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => setShowInviteList(!showInviteList)}
          >
            {inviteLoading ? "Sending..." : "Invite"}
          </button>
          <button
            className="bg-black text-white p-2 rounded"
            onClick={() => setTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark')}
          >
            <SunIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-2/3 border-r">
          <Editor
            height="100%"
            language={language === 'py' ? 'python' : language === 'js' ? 'javascript' : language}
            theme={theme}
            value={code}
            onChange={(value) => {
              setCode(value);
              if (tosocketid) {
                socket.emit('code-change', { tosocketid, code: value });
              }
            }}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              fontFamily: 'Fira Code, monospace',
              automaticLayout: true,
            }}
          />
        </div>

        <div className="w-1/3 p-4 flex flex-col bg-white">
          <label className="font-semibold mb-2">Input:</label>
          <textarea
            className="w-full h-32 border p-2 mb-4 rounded resize-none"
            placeholder="Type input..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleRun}
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-4"
          >
            Run
          </button>
          <label className="font-semibold mb-2">Output:</label>
          <div className="w-full h-40 border p-2 rounded bg-gray-50 overflow-auto">
            <pre>{output}</pre>
          </div>
        </div>
      </div>

      {invitePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4 font-medium">User <strong>{invitePrompt.fromUserId}</strong> invited you to collaborate. Accept?</p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-green-500 text-white px-4 py-1 rounded"
                onClick={() => {
                  socket.emit('accept-invite', { fromUserId: invitePrompt.fromUserId, toUserId: userName });
                  setInvitePrompt(null);
                }}
              >Accept</button>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded"
                onClick={() => {
                  socket.emit('decline-invite', { fromUserId: invitePrompt.fromUserId, toUserId: userName });
                  setInvitePrompt(null);
                }}
              >Decline</button>
            </div>
          </div>
        </div>
      )}

      {showInviteList && (
        <div className="absolute right-4 top-16 bg-white border shadow-md p-3 rounded font-serif z-40 max-h-48 overflow-y-auto">
          <p className="font-semibold mb-2">Online Users</p>
          {onlineUsers.length === 0 ? (
            <p className="text-gray-400">No users online</p>
          ) : (
            onlineUsers.map(user => (
              <button
                key={user}
                onClick={() => handleSendInvite(user)}
                className="block w-full bg-gray-500 text-white font-mono text-left px-3 py-1 hover:bg-gray-800 rounded"
                disabled={inviteLoading}
              >
                {user}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Compiler;
