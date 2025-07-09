import { io } from "socket.io-client";
const apiurl = import.meta.env.VITE_BACKEND_URL;
const socket = io(`${apiurl}`,{
    transports: ["websocket"],
    withCredentials: true,
}); 

export default socket;