(function() {
    if (window.autoBuyerLoaded) return;
    window.autoBuyerLoaded = true;

    function initApp() {
        let isRunning = false;
        let alarmInterval = null;

        // UI Panel - Small Slide Rectangular Design
        const panel = document.createElement("div");
        panel.id = "alien-panel";
        panel.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #f0f0f0; 
            color: #000;
            padding: 10px 15px;
            border-radius: 15px;
            z-index: 1000000;
            width: 210px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            user-select: none;
            touch-action: none;
            cursor: move;
            border: 1px solid #ccc;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px; align-self: flex-start; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border: 2px solid #555; border-radius: 50%; background: #888;"></div>
                <span style="font-weight: 800; font-size: 14px; letter-spacing: 0.5px;">AlienX</span>
            </div>
            
            <input id="targetAmt" type="number" value="1000" style="width: 100%; height: 35px; background: #fff; color: #000; border: 1px solid #bbb; border-radius: 8px; text-align: center; font-size: 18px; font-weight: 600; margin-bottom: 8px; outline: none; cursor: text;"/>
            
            <div id="statusText" style="margin-bottom: 8px; font-size: 12px; font-weight: 600; color: #666;">
                <span id="statusSpan">Idle</span>
            </div>
            
            <div style="display: flex; gap: 8px; width: 100%;">
                <button id="startBtn" style="flex: 1; background: #28a745; color: #fff; border: none; padding: 8px 0; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 13px;">Start</button>
                <button id="stopBtn" style="flex: 1; background: #dc3545; color: #fff; border: none; padding: 8px 0; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 13px;">Stop</button>
            </div>
        `;
        document.body.appendChild(panel);

        const statusLabel = document.getElementById("statusSpan");
        const targetInput = document.getElementById("targetAmt");

        // --- Drag Anywhere Logic ---
        let isDragging = false;
        let offset = { x: 0, y: 0 };

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
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
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

        panel.addEventListener('mousedown', start);
        panel.addEventListener('touchstart', start);
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

            const refreshBtn = Array.from(document.querySelectorAll("div, button, span")).find(el => el.innerText.trim() === "Default");
            if (refreshBtn) refreshBtn.click();
            
            statusLabel.innerText = "Searching...";

            setTimeout(() => {
                const target = targetInput.value;
                const divs = document.querySelectorAll("div");
                let found = false;

                for (let el of divs) {
                    if (el.innerText.includes("₹") && el.innerText.includes(target)) {
                        const buyBtn = Array.from(el.querySelectorAll("button")).find(b => /buy/i.test(b.innerText));
                        if (buyBtn) {
                            found = true;
                            buyBtn.click();
                            
                            setTimeout(() => {
                                if (document.body.innerText.toLowerCase().includes("success")) {
                                    statusLabel.innerText = "Success ✅";
                                    isRunning = false;
                                    playAlarm();
                                } else {
                                    statusLabel.innerText = "Page Changed 🔔";
                                    performCycle();
                                }
                            }, 450);
                            return; 
                        }
                    }
                }
                if (isRunning && !found) setTimeout(performCycle, 350); 
            }, 250); 
        }

        document.getElementById("startBtn").onclick = (e) => {
            e.stopPropagation();
            if (isRunning) return;
            isRunning = true;
            performCycle();
        };

        document.getElementById("stopBtn").onclick = (e) => {
            e.stopPropagation();
            isRunning = false;
            clearInterval(alarmInterval);
            alarmInterval = null;
            statusLabel.innerText = "Stopped";
        };

        targetInput.onclick = (e) => e.stopPropagation();
    }

    initApp();
})();
