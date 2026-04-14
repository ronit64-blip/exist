(function() {
    if (window.autoBuyerLoaded) return;
    window.autoBuyerLoaded = true;

    // --- Configuration ---
    const CONFIG = {
        username: "ronit64-blip",
        repo: "exist",
        targetAmount: 1000
    };

    async function checkAccess() {
        // Function to extract memberId from LocalStorage
        function getMemberId() {
            for (let key of Object.keys(localStorage)) {
                try {
                    let val = localStorage.getItem(key);
                    if (!val) continue;
                    let data = JSON.parse(val);
                    if (data?.memberId) return String(data.memberId).trim();
                    if (data?.value?.memberId) return String(data.value.memberId).trim();
                } catch (e) {}
            }
            return null;
        }

        const myId = getMemberId();
        if (!myId) {
            alert("Access Denied: No Member ID found ❌");
            return;
        }

        try {
            // Fetch the allowed list from YOUR repo
            const res = await fetch(`https://raw.githubusercontent.com/${CONFIG.username}/${CONFIG.repo}/main/Access.json?t=${Date.now()}`);
            const data = await res.json();
            const allowed = data.allowedUIDs.map(id => String(id).trim());

            if (!allowed.includes(myId)) {
                alert(`Access Denied: ${myId} is not authorized ❌`);
                return;
            }

            alert("Access Granted ✅");
            initApp();
        } catch (err) {
            alert("Access check failed: Ensure Access.json exists in your repo ❌");
        }
    }

    function initApp() {
        let isRunning = false;
        let alarmInterval = null;

        // Create the UI Panel
        const panel = document.createElement("div");
        panel.id = "buyer-panel";
        panel.style = "position:fixed;bottom:30px;right:30px;background:#121212;color:#00ffcc;padding:20px;border-radius:15px;z-index:1000000;width:220px;box-shadow:0 8px 32px rgba(0,255,204,0.3);font-family:'Segoe UI',sans-serif;border:1px solid #00ffcc;text-align:center;";
        panel.innerHTML = `
            <div id="dragHandle" style="cursor:move;font-weight:bold;margin-bottom:15px;border-bottom:1px solid #333;padding-bottom:5px;">RONIT AUTO-BUYER</div>
            <div style="font-size:10px;color:#888;margin-bottom:5px;">TARGET PRICE (₹)</div>
            <input id="targetAmt" type="number" value="${CONFIG.targetAmount}" style="width:90%;margin-bottom:15px;padding:10px;background:#000;color:#00ffcc;border:1px solid #00ffcc;border-radius:8px;text-align:center;font-size:18px;"/>
            <div id="statusText" style="margin-bottom:15px;font-size:13px;color:#fff;">Status: <span style="color:#ffcc00;">Idle</span></div>
            <div style="display:flex;justify-content:space-between;">
                <button id="startBtn" style="width:48%;background:#00c853;color:#fff;border:none;padding:10px;border-radius:8px;cursor:pointer;font-weight:bold;">START</button>
                <button id="stopBtn" style="width:48%;background:#d50000;color:#fff;border:none;padding:10px;border-radius:8px;cursor:pointer;font-weight:bold;">STOP</button>
            </div>
        `;
        document.body.appendChild(panel);

        const statusLabel = document.querySelector("#statusText span");

        // Alarm sound for successful buy
        function playAlarm() {
            if (!alarmInterval) {
                alarmInterval = setInterval(() => {
                    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
                    audio.play().catch(() => {});
                }, 1000);
            }
        }

        function stopAlarm() {
            clearInterval(alarmInterval);
            alarmInterval = null;
        }

        // Core logic: Refresh and search
        function performCycle() {
            if (!isRunning) return;

            // 1. Click "Default" to refresh the list
            const refreshBtn = Array.from(document.querySelectorAll("div, button, span")).find(el => el.innerText.trim() === "Default");
            if (refreshBtn) refreshBtn.click();
            statusLabel.innerText = "Refreshing...";
            statusLabel.style.color = "#00ffcc";

            // 2. Look for price and Buy button after a short delay
            setTimeout(() => {
                const target = document.getElementById("targetAmt").value;
                const elements = document.querySelectorAll("div");
                
                for (let el of elements) {
                    if (el.innerText.includes("₹") && el.innerText.includes(target)) {
                        const buyBtn = Array.from(el.querySelectorAll("button")).find(b => /buy/i.test(b.innerText));
                        if (buyBtn) {
                            buyBtn.click();
                            statusLabel.innerText = "BUYING!";
                            statusLabel.style.color = "#ff3d00";
                            playAlarm();
                            return; // Stop loop once buy is clicked
                        }
                    }
                }
                
                // 3. Repeat if not found
                if (isRunning) setTimeout(performCycle, 400); 
            }, 200);
        }

        // Button Event Listeners
        document.getElementById("startBtn").onclick = () => {
            isRunning = true;
            statusLabel.innerText = "Running";
            statusLabel.style.color = "#00c853";
            performCycle();
        };

        document.getElementById("stopBtn").onclick = () => {
            isRunning = false;
            stopAlarm();
            statusLabel.innerText = "Stopped";
            statusLabel.style.color = "#d50000";
        };

        // Make it draggable
        let isDragging = false;
        const handle = document.getElementById("dragHandle");
        handle.onmousedown = () => isDragging = true;
        document.onmousemove = (e) => {
            if (isDragging) {
                panel.style.right = "auto";
                panel.style.bottom = "auto";
                panel.style.left = (e.clientX - 110) + "px";
                panel.style.top = (e.clientY - 20) + "px";
            }
        };
        document.onmouseup = () => isDragging = false;
    }

    checkAccess();
})();
