(function() {
    if (window.autoBuyerLoaded) return;
    window.autoBuyerLoaded = true;

    function initApp() {
        let isRunning = false;
        let alarmInterval = null;

        // Create the UI Panel - Sleek Rectangular "Slide" Design
        const panel = document.createElement("div");
        panel.id = "alien-panel";
        panel.style = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #d1d1d1; 
            color: #000;
            padding: 8px 15px;
            border-radius: 8px;
            z-index: 1000000;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-family: sans-serif;
            border: 1px solid #777;
            user-select: none;
            touch-action: none;
            cursor: move;
        `;
        
        panel.innerHTML = `
            <div style="font-weight: 900; font-size: 14px; letter-spacing: 1px;">ALIEN</div>
            <div style="height: 20px; width: 1px; background: #999;"></div>
            <input id="targetAmt" type="number" value="1000" style="width: 70px; padding: 4px; background: #fff; color: #000; border: 1px solid #777; border-radius: 4px; text-align: center; font-size: 14px; font-weight: bold; cursor: text;"/>
            <div id="statusText" style="font-size: 11px; font-weight: bold; min-width: 80px;">Status: <span id="statusSpan" style="color:#555;">IDLE</span></div>
            <button id="startBtn" style="background: #2e7d32; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">START</button>
            <button id="stopBtn" style="background: #c62828; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">STOP</button>
        `;
        document.body.appendChild(panel);

        const statusLabel = document.getElementById("statusSpan");
        const targetInput = document.getElementById("targetAmt");

        // --- Drag Anywhere Logic ---
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        const start = (e) => {
            // Prevent dragging if clicking the input field or buttons
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            
            isDragging = true;
            const cx = e.clientX || e.touches[0].clientX;
            const cy = e.clientY || e.touches[0].clientY;
            offset.x = cx - panel.getBoundingClientRect().left;
            offset.y = cy - panel.getBoundingClientRect().top;
            
            document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', move);
        };

        const move = (e) => {
            if (!isDragging) return;
            const x = (e.clientX || e.touches[0].clientX) - offset.x;
            const y = (e.clientY || e.touches[0].clientY) - offset.y;
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
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
            
            statusLabel.innerText = "RUNNING";
            statusLabel.style.color = "#2e7d32";

            setTimeout(() => {
                const target = targetInput.value;
                const divs = document.querySelectorAll("div");
                let foundAnyMatch = false;

                for (let el of divs) {
                    if (el.innerText.includes("₹") && el.innerText.includes(target)) {
                        const buyBtn = Array.from(el.querySelectorAll("button")).find(b => /buy/i.test(b.innerText));
                        if (buyBtn) {
                            foundAnyMatch = true;
                            buyBtn.click();
                            
                            setTimeout(() => {
                                const bodyText = document.body.innerText.toLowerCase();
                                if (bodyText.includes("success") || bodyText.includes("processing")) {
                                    statusLabel.innerText = "BOUGHT! ✅";
                                    isRunning = false;
                                    playAlarm();
                                } else {
                                    statusLabel.innerText = "RETRYING...";
                                    performCycle();
                                }
                            }, 400);
                            return; 
                        }
                    }
                }

                if (isRunning && !foundAnyMatch) {
                    setTimeout(performCycle, 350); 
                }
            }, 250); 
        }

        document.getElementById("startBtn").onclick = (e) => {
            e.stopPropagation(); // Stop drag event
            if (isRunning) return;
            isRunning = true;
            performCycle();
        };

        document.getElementById("stopBtn").onclick = (e) => {
            e.stopPropagation(); // Stop drag event
            isRunning = false;
            clearInterval(alarmInterval);
            alarmInterval = null;
            statusLabel.innerText = "IDLE";
            statusLabel.style.color = "#555";
        };

        targetInput.onclick = (e) => e.stopPropagation();
    }

    initApp();
})();
