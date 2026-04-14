(function() {
    if (window.autoBuyerLoaded) return;
    window.autoBuyerLoaded = true;

    // --- Configuration ---
    const CONFIG = {
        username: "ronit64-blip",
        repo: "exist"
    };

    function initApp() {
        let isRunning = false;
        let alarmInterval = null;

        // Create the UI Panel (Gray background, Black font)
        const panel = document.createElement("div");
        panel.id = "alien-panel";
        panel.style = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #d1d1d1; 
            color: #000000;
            padding: 15px;
            border-radius: 10px;
            z-index: 1000000;
            width: 200px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-family: 'Segoe UI', Tahoma, sans-serif;
            border: 2px solid #555;
            user-select: none;
            touch-action: none;
        `;
        
        panel.innerHTML = `
            <div id="dragHandle" style="cursor: move; font-weight: 800; font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid #999; padding-bottom: 5px; text-align: center; letter-spacing: 2px;">ALIEN</div>
            <div style="font-size: 11px; font-weight: bold; margin-bottom: 4px;">TARGET PRICE (₹)</div>
            <input id="targetAmt" type="number" value="1000" style="width: 88%; margin-bottom: 12px; padding: 8px; background: #fff; color: #000; border: 1px solid #777; border-radius: 5px; text-align: center; font-size: 16px; font-weight: bold;"/>
            <div id="statusText" style="margin-bottom: 12px; font-size: 12px; font-weight: bold;">Status: <span id="statusSpan" style="color: #555;">IDLE</span></div>
            <div style="display: flex; justify-content: space-between;">
                <button id="startBtn" style="width: 48%; background: #2e7d32; color: #fff; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px;">START</button>
                <button id="stopBtn" style="width: 48%; background: #c62828; color: #fff; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px;">STOP</button>
            </div>
        `;
        document.body.appendChild(panel);

        const statusLabel = document.getElementById("statusSpan");

        // --- Smooth Dragging Logic ---
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const x = (e.clientX || e.touches[0].clientX) - offset.x;
            const y = (e.clientY || e.touches[0].clientY) - offset.y;
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        const onMouseDown = (e) => {
            isDragging = true;
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            offset.x = clientX - panel.getBoundingClientRect().left;
            offset.y = clientY - panel.getBoundingClientRect().top;
            document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', onMouseMove);
        };

        const stopDragging = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);
        };

        const handle = document.getElementById("dragHandle");
        handle.addEventListener('mousedown', onMouseDown);
        handle.addEventListener('touchstart', onMouseDown);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);

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
            
            statusLabel.innerText = "RUNNING...";
            statusLabel.style.color = "#2e7d32";

            setTimeout(() => {
                const target = document.getElementById("targetAmt").value;
                const allDivs = document.querySelectorAll("div");
                let found = false;

                for (let el of allDivs) {
                    if (el.innerText.includes("₹") && el.innerText.includes(target)) {
                        const buyBtn = Array.from(el.querySelectorAll("button")).find(b => /buy/i.test(b.innerText));
                        if (buyBtn) {
                            buyBtn.click();
                            statusLabel.innerText = "TARGET FOUND!";
                            statusLabel.style.color = "#c62828";
                            isRunning = false; 
                            playAlarm();
                            found = true;
                            break;
                        }
                    }
                }

                if (isRunning && !found) {
                    setTimeout(performCycle, 400); 
                }
            }, 300); 
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
            statusLabel.innerText = "STOPPED";
            statusLabel.style.color = "#c62828";
        };
    }

    // Access Check (Points to your new repo)
    (async function checkAccess() {
        // You can add your ID check here or just call initApp()
        initApp(); 
    })();
})();
