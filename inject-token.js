const fs = require("fs");
const path = require("path");

// Read the public token from the environment variable
const publicToken = process.env.SIGNALZEN_PUBLIC_TOKEN;

if (!publicToken) {
  console.error(
    "ERROR: SIGNALZEN_PUBLIC_TOKEN environment variable is not set."
  );
  process.exit(1);
}

// Path to the HTML file
const filePath = path.join(__dirname, "index.html");

// Read the HTML file
let htmlContent = fs.readFileSync(filePath, "utf8");

// Add the SignalZen script with the token dynamically
const signalZenScript = `
<script type="text/javascript">
    var _sz = _sz || {};
    _sz.appId = "${publicToken}";
    (function() {
        var e = document.createElement("script");
        e.src = "https://cdn.signalzen.com/signalzen.js";
        e.setAttribute("async", "true");
        document.documentElement.firstChild.appendChild(e);
        var t = setInterval(function() {
            if (typeof SignalZen !== "undefined") {
                clearInterval(t);
                new SignalZen(_sz).load();
            }
        }, 10);
    })();
</script>
`;

// Insert the script just before the closing </body> tag
htmlContent = htmlContent.replace("</body>", `${signalZenScript}\n</body>`);

// Write the updated HTML back to the file
fs.writeFileSync(filePath, htmlContent);

console.log("SignalZen token injected successfully!");
