import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { SunIcon ,UserGroupIcon, XCircleIcon} from '@heroicons/react/24/solid';
import socket from "../socket/Socket";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';

const Compiler = () => {
  const [code, setCode] = useState(`#include<bits/stdc++.h>
using namespace std;

int main(){
    // Write your code here...
    return 0;
}`);
  const navigate=useNavigate();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tosocketid, settosocketid] = useState(null);
  const [invitePrompt, setInvitePrompt] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showInviteList, setShowInviteList] = useState(false);
  const [collaboration, setCollaboration] = useState({ isActive: false, partner: null, roomId: null });
  const userName = localStorage.getItem('userName');
  
  const apiurl = import.meta.env.VITE_BACKEND_URL;
  const compilerurl = import.meta.env.VITE_COMPILER_URL;

  useEffect(() => {
        const checklogin = async () => {
            try {
                const p = await axios.get(`${apiurl}/dashboard`, { withCredentials: true });
            } catch (err) {
                alert("Not loggedin, Try logging in");
                navigate('/login');
            }
        };

        checklogin();
    }, [navigate]);

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

        const handleInviteAccepted = ({ roomId, a, b ,from}) => {
            const partner = from;
            setCollaboration({ isActive: true, partner, roomId });
            console.log('✅ Invite accepted, room:', roomId);
            settosocketid(b);
            setInviteLoading(false);
            setShowInviteList(false);
            toast.success(`🚀 You are now collaborating with ${partner}!`);
        };

        const handleInviteRejected = ({ roomId, a, b }) => {
            console.log('✅ Invite accepted, room:', roomId);
            settosocketid(null);
            setInviteLoading(false);
            setShowInviteList(false);
            toast.warn(`❌ Connection Rejected`);
        };

        const handleReceiveCode = ({ code }) => {
            setCode(code);
        };

        const handleleave = ({code}) => {
            toast.info("Friend Left");
            setCollaboration({ isActive: false, partner: null, roomId: null });
            settosocketid(null);
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
        socket.on('leave', handleleave);
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
            socket.off('leave', handleleave);
            socket.off('disconnect', handleDisconnect);
        };
    }, [userName]);

  const handleSendInvite = (toUserId) => {
    setInviteLoading(true);
    toast.info(`Sending invite to ${toUserId}...`);
    socket.emit('send-invite', { fromUserId: userName, toUserId });
    setShowInviteList(false);
  };
  

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running your code...");
    try {
      const response = await axios.post(`${compilerurl}/run`, { code, language, input }, { withCredentials: true });
      setOutput(response.data.output.output || "Execution finished with no output.");
    } catch (err) {
      setOutput(err.response?.data?.message || 'Error running code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleLeaveSession = () => {
    socket.emit('leave-session', { tosocketid, code});
    toast.info("You have left the collaborative session.");
    setCollaboration({ isActive: false, partner: null, roomId: null });
    settosocketid(null);
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguage(value);
    const templates = {
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n    // Write your code here...\n    return 0;\n}`,
      py: `# Write your code here...\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`,
      java: `// Write your code here...
class Main {
    public static void main(String[] args) {
        // Your Java code goes inside this method
        System.out.println("Hello, Java!");
    }
}`,
      c: `#include <stdio.h>\n\nint main() {\n    // Write your code here...\n    return 0;\n}`,
      js: `// Write your code here...\nfunction main() {\n    console.log("Hello, World!");\n}\n\nmain();`
    };
    setCode(templates[value] || '// Write your code here...');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
            
            {collaboration.isActive && (
                <div className="bg-purple-600 text-white px-6 py-2 flex justify-between items-center shadow-lg z-10">
                    <div className="flex items-center gap-2">
                        <UserGroupIcon className="h-6 w-6" />
                        <span className="font-bold">Collaborating with: {collaboration.partner}</span>
                    </div>
                    <button
                        onClick={handleLeaveSession}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:cursor-pointer hover:bg-red-600 transition flex items-center gap-1"
                    >
                        <XCircleIcon className="h-5 w-5" />
                        Leave Session
                    </button>
                </div>
            )}
      <div className="flex justify-between items-center border-b px-6 py-3 bg-white shadow">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border hover:cursor-pointer px-3 py-2 rounded focus:outline-none"
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="py">Python</option>
          <option value="js">JavaScript</option>
        </select>
        <div className="flex gap-3">
          <button
            className="bg-purple-500 hover:cursor-pointer text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => setShowInviteList(prev => !prev)}
            disabled={collaboration.isActive || inviteLoading}
          >
            {inviteLoading ? "Sending..." : "Invite"}
          </button>
          <button
            className="bg-black text-white hover:cursor-pointer p-2 rounded"
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
              if (collaboration.isActive && collaboration.roomId) {
                  socket.emit('code-change', { tosocketid, code: value  });
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
            disabled={isRunning}
            className="bg-green-500 text-white py-2 hover:cursor-pointer rounded hover:bg-green-600 mb-4"
          >
            {isRunning ? 'Running...' : 'Run Code'}
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
                className="bg-green-500 text-white hover:cursor-pointer px-4 py-1 rounded"
                onClick={() => {
                  socket.emit('accept-invite', { fromUserId: invitePrompt.fromUserId, toUserId: userName });
                  setInvitePrompt(null);
                }}
              >Accept</button>
              <button
                className="bg-red-500 text-white hover:cursor-pointer px-4 py-1 rounded"
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
        <div className="absolute right-4 top-30 bg-white border shadow-md p-3 rounded font-serif z-40 max-h-48 overflow-y-auto">
          <p className="font-semibold mb-2">Online Users</p>
          {onlineUsers.length === 0 ? (
            <p className="text-gray-400">No users online</p>
          ) : (
            onlineUsers.map(user => (
              <button
                key={user}
                onClick={() => handleSendInvite(user)}
                className="block w-full bg-gray-500 text-white hover:cursor-pointer font-mono text-left px-3 py-1 hover:bg-gray-800 rounded"
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
