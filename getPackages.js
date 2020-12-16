/**
 * Toggle on/off the dropdown spoiler '_WHOAMI'
 */
document.getElementById("collapsible").addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.height === '0px' || content.style.height === '') {
        content.style.height = content.scrollHeight + "px"; // magic property
    } else content.style.height = "0px";
});

/**
 * Function to get html content as a string (for markdown parser)
 */
async function getContentOfURL(url) {
    return await new Promise((resolve, reject) => {
        try {
            var req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.send();
            req.onload = () => {
                if (req.readyState == 4 && req.status == 200) resolve(req.responseText);
                reject("An error occurred.\n(readyState = "
                    + req.readyState + ", status = " + req.status + ")");
            }
        } catch (er) {
            reject(er.message);
        }
    });
}

/**
 * Add packages (almost) automatically in the appropriate section
 */
$(function () {
    // I have to put existing packages manually as GitHub Pages doesn't
    // accept Node.JS/PHP, so I can't browse subfolders automatically :(
    const packages = ["sbcolors", "fastlpm", "respringpack", "appmore"];

    // Random order with Chrome/Opera
    $.each(packages, function (i, actualPackage) {
        $.ajax({
            type: "GET",
            url: location.origin + location.pathname + "depictions/com.redenticdev." + actualPackage + "/info.xml",
            dataType: "xml",
            success: function (xml) {
                $(xml).find("packageInfo").each(function () {
                    $("section#packages").append("<a href=\"depictions/?p=com.redenticdev." + actualPackage + "\" target=\"_blank\" class=\"package\">");
                    $("section#packages a:last-child").append("<img src=\"depictions/com.redenticdev." + actualPackage + "/icon.png\" alt=\"\" />");
                    $(xml).find("name").each(function () {
                        $("section#packages a:last-child").append("<h3>" + $(this).text().trim() + "</h3>");
                    });
                    $(xml).find("description:first").each(function () {
                        $("section#packages a:last-child").append("<p>" + $(this).text().trim() + "</p>");
                    });
                    $("section#packages").append("</a>");
                });
            }
        });
    })
});

/**
 * Remove "Add to" section if not on iOS/iPadOS
 */
document.addEventListener("readystatechange", function () {
    if (document.readyState != "interactive") return;

    var section = document.getElementById("add-repo");
    var alert = document.getElementById("alert");
    function iOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13+ detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    if (section && alert && iOS()) {
        alert.style.display = "none";
        section.style.display = "flex";
    }
}, false);

/**
 * Add devices in section dynamically
 */
document.addEventListener("readystatechange", function () {
    if (document.readyState != "interactive") return;

    const devices = [
        ["unc0ver", "iPhone XS", "iOS 13.5", "64 Go", "Space Grey", "<strong><em>(Main device)</em></strong>"],
        ["checkra1n", "iPhone 7", "iOS 14.2", "128 Go", "PRODUCT(RED)"],
        ["checkra1n", "iPhone 6s", "iOS 13.7", "128 Go", "Space Grey"],
        ["checkra1n", "iPhone 6", "iOS 12.4.9", "64 Go", "Gold"],
        ["checkra1n", "iPad 6", "iPadOS 14.2", "32 Go", "Gold"],
        ["MacBook 2017", "macOS 11.1 Big Sur", "i5", "8 Go / 512 Go", "Space Grey"],
        ["Apple Watch Series 5", "watchOS 6.2.8", "Space Grey"],
        ["AirPods", "1st Gen", "Wireless Case"]
    ];
    var content = "";
    var spaceplease = false;

    devices.forEach(line => {
        content += "<tr><td>";
        line.forEach((word, index) => {
            switch (word) {
                case "unc0ver":
                    word = "<img src=\"https://unc0ver.dev/favicon.ico\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                case "checkra1n":
                    word = "<img src=\"https://checkra.in/img/favicon.png\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                default:
                    break;
            }
            if (index == 0) {
                if (!word.startsWith("<")) content += "<strong>" + word + "</strong>";
            } else if ((index == line.length - 1 && line[index].startsWith("<")) || spaceplease) {
                if (spaceplease) {
                    word = "<strong>" + word + "</strong>";
                    spaceplease = false;
                }
                content += " " + word;
            } else {
                content += " • " + word;
            }
        });
        content += "</td></tr>\n";
    });

    document.getElementById("devices-list").innerHTML += content;

}, false);
