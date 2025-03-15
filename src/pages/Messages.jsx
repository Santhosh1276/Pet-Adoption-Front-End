/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Box, Card, CardContent } from "@mui/material";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { fetchAllUsers, fetchShelters } from "../api/api";
import NavBar from "../components/NavBar";

const socket = io("https://pet-adoption-service.onrender.com");
let API = "https://pet-adoption-service.onrender.com/api"
let token = localStorage.getItem("accessToken");


export default function MessagingApp() {
  const [userRole, setUserRole] = useState(localStorage.getItem("user_role"));
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [shelterList, setShelterList] = useState([]);
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState('');
  const [grpUsers, setGroupUsers] = useState({})

  useEffect(() => {
    async function shelter() {
      let allUsers = await fetchAllUsers();
      console.log('sheleter data >>>', allUsers) 
      let groupUserById = {}
      let mapShelter = allUsers?.data ? allUsers.data.map((val) => {
        if (!groupUserById[val?._id]) {
           groupUserById[val?._id] = val
        }
        console.log("group users by id >>>", groupUserById)
        setGroupUsers(groupUserById)

        if (val?.role == "shelter") {
          return ({
            "label": val?.name,
            "value": val?._id
          })
        }
      }).filter((value) => { return value !== undefined}) : []
      console.log(mapShelter,"map shelter >>>>")
      setShelterList(mapShelter)

    }
    shelter()
      async function fetchMessagesByUserId() {
        const response = await fetch(`${API}/messagesById?userId=${userId}`, {
       method:"GET",
       headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
    });
        const messages = await response.json();
        console.log("Message <<<>>>",messages)
        if (messages?.length) {
          // 
         let data = messages.reduce((acc, curr) => {
    const chatKey = [curr.senderId, curr.receiverId].sort().join("-"); // Unique conversationId
    if (!acc[chatKey]) {
        acc[chatKey] = [];
    }
    acc[chatKey].push(curr);
    return acc;
}, {});
setChats({ ...data });


          console.log("messages on useEffect >>>>>>>>>>", data)
        setChats({...data})

        }
    }
    fetchMessagesByUserId()
   
socket.on("receiveMessage", (message) => {
    const chatKey = [message.senderId, message.receiverId].sort().join("-");
    setChats((prevChats) => ({
        ...prevChats,
        [chatKey]: [...(prevChats[chatKey] || []), message],
    }));
});

  }, [userId]);

const handleSelectShelter = async (shelter) => {
    if (!shelter) {
        console.error("No shelter selected");
        return;
    }

    setSelectedShelter(shelter);
    socket.emit("joinChat", { adopterId: userId, shelterId: shelter });

    try {
        const response = await fetch(`${API}/messages?adopterId=${userId}&shelterId=${shelter}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
        });

        const messages = await response.json();
        setChats((prevChats) => ({ ...prevChats, [shelter]: messages }));
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};



const handleSendMessage = (shelter, message) => {
    if (!message.trim()) return;
    if (!shelter) {
        console.error("No receiverId (shelter) selected");
        return;
    }

    const msgObj = { senderId: userId, receiverId: shelter, message };
    console.log("Sending message:", msgObj); // Debugging log

    socket.emit("sendMessage", msgObj);

    const chatKey = [userId, shelter].sort().join("-");
    setChats((prevChats) => ({
        ...prevChats,
        [chatKey]: [...(prevChats[chatKey] || []), msgObj],
    }));

    setMessage("");
};




const mergedChats = {};

Object.keys(chats).forEach((chatKey) => {
    const [id1, id2] = chatKey.split("-");
    const partnerId = id1 === userId ? id2 : id1; // Ensure we store the correct partner ID

    const partnerName = grpUsers?.[partnerId]?.name || "Unknown";
    const role = grpUsers?.[partnerId]?.role || "User";
    
    const displayKey = `${partnerName}-${role}`;
    if (!mergedChats[displayKey]) {
        mergedChats[displayKey] = { messages: [], partnerId }; // Store partnerId
    }
    mergedChats[displayKey].messages = [...mergedChats[displayKey].messages, ...chats[chatKey]];
});

  
  console.log("merged chats >>>>>>>>>>",mergedChats)



  return (
    <Box>
    <NavBar />

    <Box sx={{pt:10 }}>
      {(userRole === "adopter" || userRole === "foster") && (
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Select Shelter</InputLabel>
          <Select value={selectedShelter || ""} onChange={(e) => handleSelectShelter(e.target.value)}>
            {shelterList.map((shelter) => (
              <MenuItem key={shelter} value={shelter?.value}>{shelter?.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

  <Box 
  style={{ 
    display: "flex", 
    flexWrap: "wrap", 
    gap: "16px", 
    justifyContent: "center", 
    padding: "20px" 
  }}
>
  {Object.keys(mergedChats).map((conversationKey) => {
    const { messages, partnerId } = mergedChats[conversationKey];

    return (
      <Card 
        key={conversationKey} 
        variant="outlined"
        sx={{ 
          width: "100%", 
          maxWidth: "400px", 
          minHeight: "350px", 
          display: "flex", 
          flexDirection: "column", 
          borderRadius: "12px", 
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#f9f9f9"
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: "#2C3E50", 
            color: "white", 
            padding: "12px", 
            fontSize: "16px", 
            fontWeight: "bold", 
            borderTopLeftRadius: "12px", 
            borderTopRightRadius: "12px",
            textAlign: "center"
          }}
        >
          Chat with {conversationKey}
        </Box>

        <CardContent
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            maxHeight: "250px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {messages?.length > 0 ? messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.senderId === userId ? "flex-end" : "flex-start",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  maxWidth: "75%",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: msg.senderId === userId ? "#2C3E50" : "#E0E0E0",
                  color: msg.senderId === userId ? "white" : "black",
                  textAlign: "left",
                  wordWrap: "break-word",
                }}
              >
                {msg.message}
              </span>
            </div>
          )) : (
            <p style={{ textAlign: "center", color: "#999" }}>No messages yet</p>
          )}
        </CardContent>

        <Box sx={{ display: "flex", gap: "8px", padding: "12px" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(partnerId, message);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSendMessage(partnerId, message)}
            sx={{ minWidth: "80px", textTransform: "none" , backgroundColor:"#2C3E50"}}
          >
            Send
          </Button>
        </Box>
      </Card>
    );
  })}
</Box>




    </Box>
</Box>
  );
}
