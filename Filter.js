(function() {
    if (window.autoBuyerLoaded) return;
    window.autoBuyerLoaded = true;

    function initApp() {
        let isRunning = false;
        let alarmInterval = null;

        // UI Panel - Matching the provided image (Light Gray Tile)
        const panel = document.createElement("div");
        panel.id = "alien-panel";
        panel.style = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #f0f0f0; 
            color: #000;
            padding: 20px;
            border-radius: 20px;
            z-index: 1000000;
            width: 260px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            user-select: none;
            touch-action: none;
            cursor: move;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; align-self: flex-start; margin-bottom: 15px;">
                <div style="width: 18px; height: 18px; border: 3px solid #777; border-radius: 50%; background: #999;"></div>
                <span style="font-weight: 700; font-size: 18px;">Redx</span>
            </div>
            
            <input id="targetAmt" type="number" value="1000" style="width: 100%; height: 50px; background: #fff; color: #000; border: 1px solid #ccc; border-radius: 12px; text-align: center; font-size: 24px; font-weight: 500; margin-bottom: 15px; outline: none; cursor: text;"/>
            
            <div id="statusText" style="margin-bottom: 15px; font-size: 16px; font-weight: 500; color: #555;">
                <span id="statusSpan">Idle</span>
            </div>
            
            <div style="display: flex; gap: 12px; width: 100%;">
                <button id="startBtn" style="flex: 1; background: #28a745; color: #fff; border: none; padding: 12px 0; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 16px;">Start</button>
                <button id="stopBtn" style="flex: 1; background: #dc3545; color: #fff; border: none; padding: 12px 0; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 16px;">Stop</button>
            </div>
        `;
        document.body.appendChild(panel);

        const statusLabel = document.getElementById("statusSpan");
        const targetInput = document.getElementById("targetAmt");

        // --- Smooth Draggable Logic (Anywhere on panel) ---
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        const startDrag = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            isDragging = true;
            const cx = e.clientX || e.touches[0].clientX;
            const cy = e.clientY || e.touches[0].clientY;
            offset.x = cx - panel.getBoundingClientRect().left;
            offset.y = cy - panel.getBoundingClientRect().top;
            document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', moveDrag);
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            const x = (e.clientX || e.touches[0].clientX) - offset.x;
            const y = (e.clientY || e.touches[0].clientY) - offset.y;
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', moveDrag);
            document.removeEventListener('touchmove', moveDrag);
        };

        panel.addEventListener('mousedown', startDrag);
        panel.addEventListener('touchstart', startDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);

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
            
            statusLabel.innerText = "Refreshing...";

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
                                if (document.body.innerText.toLowerCase().includes("success") || document.body.innerText.toLowerCase().includes("processing")) {
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
