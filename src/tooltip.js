let timeoutId = null;
let currentTooltip = null;
let cursorX = 0;
let cursorY = 0;

function initTooltip(container) {
    disableCssTooltips(container);
    trackMousePosition();

    let nodes = container.querySelectorAll('.qp-node');

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.addEventListener("mouseover", function() {
            timeoutId = window.setTimeout(function () {
                currentTooltip = container.querySelector(".qp-tt").cloneNode(true);
                document.body.appendChild(currentTooltip);
                currentTooltip.style.left = cursorX + 'px';
                currentTooltip.style.top = cursorY + 'px';
            }, 500);
        });
        node.addEventListener("mouseout", function () {
            window.clearTimeout(timeoutId);
            if (currentTooltip != null) {
                document.body.removeChild(currentTooltip);
                currentTooltip = null;
            }
        });
    }
}

function disableCssTooltips(container) {
    let root = container.querySelector(".qp-root");
    root.className += " qp-noCssTooltip";
}

function trackMousePosition() {
    document.onmousemove = function(e){
        cursorX = e.pageX;
        cursorY = e.pageY;
    }
}

module.exports.initTooltip = initTooltip;