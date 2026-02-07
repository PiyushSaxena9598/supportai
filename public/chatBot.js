(function () {
  const api_Url = "http://localhost:3000/api/chat";
  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");
  if (!ownerId) {
    console.error("Owner ID is required");
    return;
  }
  const button = document.createElement("div");
  button.innerHTML = "💬";

  Object.assign(button.style, {
    position: "fixed",
    bottom: "35px",
    right: "50px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "22px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
    zIndex: "999999",
  });

  document.body.appendChild(button);

  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    bottom: "120px",
    right: "24px",
    width: "320px",
    height: "420px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif",
    zIndex: "999999",
  });

  box.innerHTML = `<div style="
        background:#000;
        color:#fff;
        padding:12px 14px;
        font-size:14px;
        display:flex;
        justify-content:space-between;
        align-items:center;
    ">
    <span>Customer Support</span>
    <span id="chat-close" style="cursor:pointer; font-size:16px">❌</span>
    </div>
    
    <div id="chat-messages" style="
    flex:1;
    padding:12px;
    overflow-y:auto;
    background:#f9fafb;
    display:flex;
    flex-direction:column;
    ">
    </div>


    <div style="
        display:flex;
        border-top:1px solid #e5e7eb;
        padding:8px;
        gap:6px;
    ">
        <input type="text" style="
        flex:1;
        padding:8px 10px;
        border:1px solid #d1d5db;
        border-radius:8px;
        font-size:13px;
        outline:none;
        " id="chat-input" placeholder="Type a message"/>
        <button style="
        padding:8px 12px;
        border:none;
        background:#000;
        color:#fff;
        border-radius:8px;
        font-size:13px;
        cursor:pointer;
        " id="chat-send">Send</button>
    </div>

    `;

  document.body.appendChild(box);

  button.onclick = () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  };

  document.querySelector("#chat-close").onclick = () => {
    box.style.display = "none";
  };

  const input = document.querySelector("#chat-input");
  const sendBtn = document.querySelector("#chat-send");
  const messageArea = document.querySelector("#chat-messages");

  function addMessage(text, from) {
    const bubble = document.createElement("div");
    bubble.innerHTML = text;
    Object.assign(bubble.style, {
      maxWidth: "78%",
      padding: "8px 12px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: "1.4",
      marginBottom: "8px",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      background: from === "user" ? "#000" : "#e5e7eb",
      color: from === "user" ? "#fff" : "#111",
      borderTopRightRadius: from === "user" ? "4px" : "14px",
      borderTopLeftRadius: from === "user" ? "14px" : "4px",
    });
    messageArea.appendChild(bubble)
    messageArea.scrollTop=messageArea.scrollHeight
  }
  sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";

    const typing = document.createElement("div");
    typing.innerHTML = "Typing...";
    Object.assign(typing.style, {
      fontSize: '12px',
      color: "#6b7280",
      marginBottom: "8px",
      alignSelf: "flex-start",
    });
    messageArea.appendChild(typing);
    messageArea.scrollTop = messageArea.scrollHeight;

    try {
      const response = await fetch(api_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: text }),
      });

      console.log("API response status:", response.status);
      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        data = raw;
      }
      console.log("API response parsed:", data);

      if (!response.ok) {
        console.error("Non-OK response:", raw);
        throw new Error(`HTTP ${response.status}`);
      }

      // Determine reply text from possible shapes
      let reply = "";
      if (typeof data === 'string') reply = data;
      else if (data && typeof data === 'object') reply = data.reply || data.text || data.message || data.result || JSON.stringify(data);
      else reply = "";

      if (messageArea.contains(typing)) messageArea.removeChild(typing);
      addMessage(reply || "something went wrong", "ai");
    } catch (error) {
      console.error("Chat request failed:", error);
      if (messageArea.contains(typing)) messageArea.removeChild(typing);
      addMessage("Sorry, something went wrong. Check console for details.", "ai");
    }
  };


  

})();
