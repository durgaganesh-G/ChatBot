// Allow pressing Enter to ask a question
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("questionInput").addEventListener("keydown", function (e) {
        if (e.key === "Enter") askQuestion();
    });
});

async function uploadFile() {
    const fileInput = document.getElementById("fileInput").files[0];
    if (!fileInput) {
        alert("Please select a .txt, .pdf, or .docx file first.");
        return;
    }

    const uploadBtn = document.getElementById("uploadBtn");
    const uploadStatus = document.getElementById("uploadStatus");

    uploadBtn.disabled = true;
    uploadStatus.textContent = "Uploading...";

    const formData = new FormData();
    formData.append("file", fileInput);

    try {
        const res = await fetch("http://127.0.0.1:8000/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            uploadStatus.textContent = "✅ " + data.message;
            uploadStatus.style.color = "green";

            // Clear previous chat and enable question input
            document.getElementById("chatLog").innerHTML = "";
            document.getElementById("questionInput").disabled = false;
            document.getElementById("askBtn").disabled = false;
            document.getElementById("questionInput").focus();
        } else {
            uploadStatus.textContent = "❌ " + data.detail;
            uploadStatus.style.color = "red";
        }
    } catch (err) {
        uploadStatus.textContent = "❌ Server not reachable.";
        uploadStatus.style.color = "red";
    }

    uploadBtn.disabled = false;
}

async function askQuestion() {
    const questionInput = document.getElementById("questionInput");
    const question = questionInput.value.trim();

    if (!question) return;

    const chatLog = document.getElementById("chatLog");

    // Append the user's question
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = "🧑 " + question;
    chatLog.appendChild(userBubble);

    // Placeholder while waiting
    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.textContent = "🤖 Thinking...";
    chatLog.appendChild(botBubble);

    // Scroll to bottom
    chatLog.scrollTop = chatLog.scrollHeight;

    // Clear input immediately
    questionInput.value = "";

    try {
        const response = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: question })
        });

        const data = await response.json();
        botBubble.textContent = "🤖 " + (data.answer || "No answer found.");
    } catch (err) {
        botBubble.textContent = "❌ Server not reachable.";
    }

    // Scroll to bottom after reply
    chatLog.scrollTop = chatLog.scrollHeight;
}
