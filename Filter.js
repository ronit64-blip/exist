(function() {
    if (window.autoBuyerLoaded) return;
    window.autoBuyerLoaded = true;

    function initApp() {
        let isRunning = false;
        let alarmInterval = null;

        const panel = document.createElement("div");
        panel.id = "alien-panel";
        panel.style = `position:fixed;bottom:30px;right:30px;background:#d1d1d1;color:#000;padding:15px;border-radius:10px;z-index:1000000;width:200px;box-shadow:0 4px 15px rgba(0,0,0,0.3);font-family:sans-serif;border:2px solid #555;user-select:none;touch-action:none;`;
        
        panel.innerHTML = `
            <div id="dragHandle" style="cursor:move;font-weight:800;font-size:16px;margin-bottom:12px;border-bottom:1px solid #999;padding-bottom:5px;text-align:center;letter-spacing:2px;">ALIEN</div>
            <div style="font-size:11px;font-weight:bold;margin-bottom:4px;">TARGET PRICE (₹)</div>
            <input id="targetAmt" type="number" value="1000" style="width:88%;margin-bottom:12px;padding:8px;background:#fff;color:#000;border:1px solid #777;border-radius:5px;text-align:center;font-size:16px;font-weight:bold;"/>
            <div id="statusText" style="margin-bottom:12px;font-size:12px;font-weight:bold;">Status: <span id="statusSpan" style="color:#555;">IDLE</span></div>
            <div style="display:flex;justify-content:space-between;">
                <button id="startBtn" style="width:48%;background:#2e7d32;color:#fff;border:none;padding:8px;border-radius:5px;cursor:pointer;font-weight:bold;">START</button>
                <button id="stopBtn" style="width:48%;background:#c62828;color:#fff;border:none;padding:8px;border-radius:5px;cursor:pointer;font-weight:bold;">STOP</button>
            </div>
        `;
        document.body.appendChild(panel);

        const statusLabel = document.getElementById("statusSpan");

        // --- Smooth Draggable Logic ---
        let isDragging = false;
        let offset = { x: 0, y: 0 };
        const handle = document.getElementById("dragHandle");

        const move = (e) => {
            if (!isDragging) return;
            const x = (e.clientX || e.touches[0].clientX) - offset.x;
            const y = (e.clientY || e.touches[0].clientY) - offset.y;
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        const start = (e) => {
            isDragging = true;
            const cx = e.clientX || e.touches[0].clientX;
            const cy = e.clientY || e.touches[0].clientY;
            offset.x = cx - panel.getBoundingClientRect().left;
            offset.y = cy - panel.getBoundingClientRect().top;
            document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', move);
        };

        const stop = () => {
            isDragging = false;
            document.removeEventListener('mousemove', move);
            document.removeEventListener('touchmove', move);
        };

        handle.addEventListener('mousedown', start);
        handle.addEventListener('touchstart', start);
        document.addEventListener('mouseup', stop);
        document.addEventListener('touchend', stop);

        // --- Core Auto-Buy Logic ---
        function playAlarm() {
            if (!alarmInterval) {
                alarmInterval = setInterval(() => {
                    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play().catch(() => {});
                }, 1000);
            }
        }

        async function performCycle() {
            if (!isRunning) return;

            // 1. Refresh attempt
            const refreshBtn = Array.from(document.querySelectorAll("div, button, span")).find(el => el.innerText.trim() === "Default");
            if (refreshBtn) refreshBtn.click();
            
            statusLabel.innerText = "SEARCHING...";
            statusLabel.style.color = "#2e7d32";

            // 2. Search logic with "Item Gone" safety
            setTimeout(() => {
                const target = document.getElementById("targetAmt").value;
                const divs = document.querySelectorAll("div");
                let foundAnyMatch = false;

                for (let el of divs) {
                    if (el.innerText.includes("₹") && el.innerText.includes(target)) {
                        const buyBtn = Array.from(el.querySelectorAll("button")).find(b => /buy/i.test(b.innerText));
                        if (buyBtn) {
                            foundAnyMatch = true;
                            buyBtn.click();
                            
                            // Check after clicking: did we actually succeed?
                            setTimeout(() => {
                                if (document.body.innerText.toLowerCase().includes("success") || document.body.innerText.toLowerCase().includes("processing")) {
                                    statusLabel.innerText = "BOUGHT! ✅";
                                    isRunning = false;
                                    playAlarm();
                                } else {
                                    // Item was likely taken by someone else, resume searching
                                    statusLabel.innerText = "MISSED! RETRYING...";
                                    performCycle();
                                }
                            }, 500);
                            return; 
                        }
                    }
                }

                // 3. If no match was found at all, keep looping
                if (isRunning && !foundAnyMatch) {
                    setTimeout(performCycle, 350); 
                }
            }, 250); 
        }

        document.getElementById("startBtn").onclick = () => {
            if (isRunning) return;
            isRunning = true;
            performCycle();
        };

        document.getElementById("stopBtn").onclick = () => {
            isRunning = false;
            clearInterval(alarmInterval);
            alarmInterval = null;
            statusLabel.innerText = "IDLE";
            statusLabel.style.color = "#555";
        };
    }

    initApp();
})();
