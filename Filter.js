(function() {
    if (window.autoBuyerLoaded) return;
    window.autoBuyerLoaded = true;

    function initApp() {
        let isRunning = false;
        let alarmInterval = null;

        // Small, Rectangular "Slide" Panel
        const panel = document.createElement("div");
        panel.id = "alien-panel";
        panel.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #d1d1d1; 
            color: #000;
            padding: 5px 12px;
            border-radius: 6px;
            z-index: 1000000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: sans-serif;
            border: 1px solid #888;
            user-select: none;
            touch-action: none;
            cursor: move;
            height: 35px;
        `;
        
        panel.innerHTML = `
            <div style="font-weight: 900; font-size: 12px; letter-spacing: 1px;">ALIEN</div>
            <input id="targetAmt" type="number" value="1000" style="width: 60px; height: 22px; padding: 0 4px; background: #fff; color: #000; border: 1px solid #777; border-radius: 3px; text-align: center; font-size: 13px; font-weight: bold; cursor: text;"/>
            <div id="statusText" style="font-size: 10px; font-weight: bold; min-width: 70px; white-space: nowrap;">Status: <span id="statusSpan" style="color:#555;">IDLE</span></div>
            <button id="startBtn" style="background: #2e7d32; color: #fff; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-weight: bold; font-size: 10px;">START</button>
            <button id="stopBtn" style="background: #c62828; color: #fff; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-weight: bold; font-size: 10px;">STOP</button>
        `;
        document.body.appendChild(panel);

        const statusLabel = document.getElementById("statusSpan");
        const targetInput = document.getElementById("targetAmt");

        // --- Drag Anywhere Logic ---
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
            
            statusLabel.innerText = "RUNNING";
            statusLabel.style.color = "#2e7d32";

            setTimeout(() => {
                const target = targetInput.value;
                const divs = document.querySelectorAll("div");
                let foundMatch = false;

                for (let el of divs) {
                    if (el.innerText.includes("₹") && el.innerText.includes(target)) {
                        const buyBtn = Array.from(el.querySelectorAll("button")).find(b => /buy/i.test(b.innerText));
                        if (buyBtn) {
                            foundMatch = true;
                            buyBtn.click();
                            
                            setTimeout(() => {
                                if (document.body.innerText.toLowerCase().includes("success") || document.body.innerText.toLowerCase().includes("processing")) {
                                    statusLabel.innerText = "DONE! ✅";
                                    isRunning = false;
                                    playAlarm();
                                } else {
                                    statusLabel.innerText = "MISSED!";
                                    performCycle();
                                }
                            }, 450);
                            return; 
                        }
                    }
                }

                if (isRunning && !foundMatch) setTimeout(performCycle, 350); 
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
            statusLabel.innerText = "IDLE";
            statusLabel.style.color = "#555";
        };

        targetInput.onclick = (e) => e.stopPropagation();
    }

    initApp();
})();
