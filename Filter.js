(function(){
    if(window[_0xabc("0x0")]) return;
    window[_0xabc("0x0")] = !![];

    (async function(){
        function _0xuid(){
            for(let _0xk of Object[_0xabc("0x1")](localStorage)){
                try{
                    let _0xv = localStorage[_0xabc("0x2")](_0xk);
                    if(!_0xv) continue;
                    try{
                        let _0xo = JSON[_0xabc("0x3")](_0xv);
                        if(_0xo?.memberId) return String(_0xo.memberId).trim();
                        if(_0xo?.value?.memberId) return String(_0xo.value.memberId).trim();
                    }catch{ }
                }catch{ }
            }
            return null;
        }

        const _0xid = _0xuid();
        if(!_0xid){
            alert("Access Denied ❌");
            window[_0xabc("0x0")] = ![];
            return;
        }

        try {
            const _0xr = await fetch("https://raw.githubusercontent.com/Shibdas123/Example-/main/Access.json?nocache="+Date.now());
            const _0xd = await _0xr.json();
            const _0xa = _0xd.allowedUIDs.map(_0xx => String(_0xx).trim());
            
            if(!_0xa.includes(_0xid)){
                alert("Access Denied ❌");
                window[_0xabc("0x0")] = ![];
                return;
            }
            alert("Access Granted ✅");
            _0xmain();
        } catch(_0xe) {
            alert("Access check failed ❌");
            window[_0xabc("0x0")] = ![];
            return;
        }
    })();

    function _0xmain(){
        let _0xrun = ![], _0xtarget = 1000, _0xp = null, _0xls = "", _0xlt = 0, _0xaud = null, _0xint = null;

        function _0xsa(){
            if(_0xint) return;
            _0xint = setInterval(() => {
                try {
                    _0xaud = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
                    _0xaud.volume = 1;
                    _0xaud.play();
                } catch { }
            }, 1200);
        }

        function _0xst(){
            if(_0xint){ clearInterval(_0xint); _0xint = null; }
            if(_0xaud){ _0xaud.pause(); _0xaud.currentTime = 0; }
        }

        function _0xgs(){
            let _0xt = document.body.innerText || "";
            return _0xt.slice(0, 300);
        }

        const _0xobs = new MutationObserver(() => {
            if(!_0xrun) return;
            let _0xn = Date.now(), _0xc = _0xgs(), _0xd = Math.abs(_0xc.length - _0xls.length);
            if(_0xc !== _0xls && _0xd > 50 && _0xn - _0xlt > 4000){
                _0xls = _0xc; _0xlt = _0xn; _0xsa();
                _0xus("Page Changed 🔔");
                setTimeout(_0xst, 4000);
            }
        });
        _0xobs.observe(document.body, {childList: !![], subtree: !![]});

        function _0xrc(_0xel){
            try {
                const _0xk = Object.keys(_0xel).find(_0xk => _0xk.startsWith("__reactProps"));
                if(_0xk && _0xel[_0xk]?.onClick){ _0xel[_0xk].onClick({target: _0xel}); }
                else { _0xel.dispatchEvent(new MouseEvent("click", {bubbles: !![]})); }
            } catch { _0xel.click(); }
        }

        function _0xus(_0xm){
            let _0xs = document.getElementById("status");
            if(_0xs) _0xs.innerText = _0xm;
        }

        function _0xgb(){ return Array.from(document.querySelectorAll("div, button")).find(_0xel => _0xel.innerText.trim() === "Default"); }
        function _0xea(_0xt){ let _0xm = _0xt.match(/₹\s?(\d+(\.\d+)?)/); return _0xm ? parseFloat(_0xm[1]) : null; }
        function _0xok(){ return document.body.innerText.includes("Order submitted") || document.body.innerText.includes("Processing"); }
        function _0xfail(){ return document.body.innerText.includes("Limited by functionality"); }

        function _0xcp(){
            document.querySelectorAll("button, div").forEach(_0xel => {
                let _0xt = (_0xel.innerText || "").toLowerCase();
                if(_0xt.includes("close") || _0xt.includes("ok") || _0xt.includes("cancel")){ _0xrc(_0xel); }
            });
        }

        function _0xsb(){
            let _0xr = document.querySelectorAll("div");
            for(let _0xrow of _0xr){
                let _0xt = _0xrow.innerText || "", _0xa = _0xea(_0xt);
                if(_0xa !== null && _0xa === Number(_0xtarget)){
                    let _0xb = Array.from(_0xrow.querySelectorAll("button")).find(_0xb => /buy/i.test(_0xb.innerText));
                    if(_0xb){ _0xus("Buying " + _0xa); _0xrc(_0xb); return !![]; }
                }
            }
            return ![];
        }

        function _0xloop(){
            if(!_0xrun) return;
            let _0xdb = _0xgb();
            if(_0xdb){ _0xrc(_0xdb); _0xus("Refreshing..."); }
            setTimeout(() => {
                _0xsb();
                if(_0xok()){ 
                    _0xus("Success"); 
                    _0xcp(); 
                    _0xst(); 
                    _0xrun = ![]; 
                    if(_0xp) _0xp.remove(); // This line hides the toolbox on success
                    return; 
                }
                if(_0xfail()){ _0xus("Retry..."); _0xcp(); }
                setTimeout(_0xloop, 250);
            }, 120);
        }

        _0xp = document.createElement("div");
        _0xp.style = "position:fixed;top:100px;right:20px;background:#f0f0f0;color:#000;padding:12px;border-radius:12px;z-index:999999;width:200px;box-shadow:0 4px 15px rgba(0,0,0,0.2);font-family:sans-serif;border:1px solid #ccc;user-select:none;";
        _0xp.innerHTML = `
            <div id="dragHandle" style="margin-bottom:10px;cursor:move;font-weight:bold;font-size:14px;display:flex;align-items:center;color:#333;">
                <span style="margin-right:5px;">🔘</span> Redx
            </div>
            <input id="amt" type="number" value="1000" style="width:100%;margin-bottom:8px;padding:8px;background:#fff;color:#000;border:1px solid #bbb;border-radius:6px;text-align:center;font-size:16px;box-sizing:border-box;"/>
            <div id="status" style="margin-bottom:10px;font-size:12px;color:#666;text-align:center;font-weight:bold;">Idle</div>
            <div style="display:flex;justify-content:space-between;">
                <button id="start" style="width:48%;background:#28a745;color:#fff;border:none;padding:8px;border-radius:6px;cursor:pointer;font-weight:bold;">Start</button>
                <button id="stop" style="width:48%;background:#dc3545;color:#fff;border:none;padding:8px;border-radius:6px;cursor:pointer;font-weight:bold;">Stop</button>
            </div>
        `;
        document.body.appendChild(_0xp);

        (function(){
            let isDragging = false;
            let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
            const handle = document.getElementById("dragHandle");

            function dragStart(e) {
                if (e.type === "touchstart") {
                    initialX = e.touches[0].clientX - xOffset;
                    initialY = e.touches[0].clientY - yOffset;
                } else {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                }
                if (e.target === handle || handle.contains(e.target)) isDragging = true;
            }

            function dragEnd() {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    if (e.type === "touchmove") {
                        currentX = e.touches[0].clientX - initialX;
                        currentY = e.touches[0].clientY - initialY;
                    } else {
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                    }
                    xOffset = currentX;
                    yOffset = currentY;
                    _0xp.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            }

            handle.addEventListener("touchstart", dragStart, false);
            document.addEventListener("touchend", dragEnd, false);
            document.addEventListener("touchmove", drag, false);

            handle.addEventListener("mousedown", dragStart, false);
            document.addEventListener("mouseup", dragEnd, false);
            document.addEventListener("mousemove", drag, false);
        })();

        document.getElementById("start").onclick = () => {
            _0xtarget = Number(document.getElementById("amt").value);
            _0xrun = !![];
            _0xls = _0xgs();
            _0xus("Started...");
            _0xloop();
        };

        document.getElementById("stop").onclick = () => {
            _0xrun = ![];
            _0xst();
            _0xus("Stopped");
        };
    }

    function _0xabc(_0xi){
        const _0xarr = ["autoBuyerRunning","keys","getItem","parse"];
        return _0xarr[_0xi.replace("0x","")];
    }
})();