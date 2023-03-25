// import { divide } from "lodash";
import React from "react";
import ReactDOM from "react-dom";
// import Layout from "./Layout"
import { initButton } from "./button";
import { ChakraProvider, Button, ButtonGroup } from "@chakra-ui/react";
//import 'bootstrap/dist/css/bootstrap.min.css';
// const React = require("react");
// const ReactDOM = require("react-dom");
// const { initButton } = require("./button")
// const { ChakraProvider, Button, ButtonGroup } = require("@chakra-ui/react")
// import fetch from "node-fetch";
// import fetch from "node-fetch";
let btnFlag = false;

let loadDetector = document.getElementsByTagName("main")[0];
let observer = new MutationObserver(records => {
    let url = location.href.split("/");
    let team = url.pop();
    url = url.join("/");
    team = team.split("?")[0];

    if (url == "https://f2.catk.jp/#/team" && !(btnFlag)) {
        addInitBtn(team);
    } else {
        navigator.usb.getDevices().then((devices) => {
            devices.forEach((device) => {
                console.log(device.productName);      // "Arduino Micro"
                console.log(device.manufacturerName); // "Arduino LLC"
            });
        })

    }
})

observer.observe(loadDetector, {
    attributes: true,
    childList: true,
    subtree: true
})

function addInitBtn(team) {
    btnFlag = true;
    // let root_element = document.getElementsByTagName("team")[0];
    let root_element = document.querySelector("body > app-root > main > team > div:nth-child(7)");
    root_element.id = "react-root";
    const initBtn = <div>
        <button onClick={connectPort}>てすと</button>
        <button onClick={write}>書き込み</button>
    </div>
    const root = ReactDOM.createRoot(root_element);
    // root.render(initButton());
    root.render(initBtn);
}

async function getStudentInfo() {
    let url = location.href.split("/");
    let param = url.pop();
    url = url.join("/");
    let team = param.split("?")[0];
    let info = param.split("?")[1].split("&");
    // console.log(info);
    let classIndex = info[3].split("=")[1];
    let attendDateYear = info[0].split("=")[1];
    let attendDateMonth = info[1].split("=")[1];
    let attendDateDate = info[2].split("=")[1];
    const URL = `https://f2.catk.jp/api/localattend?team=${team}&classIndex=${classIndex}&attendDateYear=${attendDateYear}&attendDateMonth=${attendDateMonth}&attendDateDate=${attendDateDate}&region=渋谷スクール`;
    try {
        const res = await fetch(URL);
        // console.log(res);
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const text = await res.json();
        // console.log(text);
        let id_list = text.map(student => student._id);
        // console.log(id_list);
        return text;
    } catch (err) {
        console.error(err);
        return;
    }
}

async function changeProgress2Red(n) {
    let id = parseInt(n);
    let studentList = await getStudentInfo();

    console.log(studentList);
    let i = 0;
    for (const student of studentList) {
        student.progressAlert = 2;
        const putParam = student;

        const parameter = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(putParam)
        }
        // if (student._id === id) {
        if (i === id) {
            const res = await fetch(`https://f2.catk.jp/api/localattend/${student._id}`, parameter).then((response) => {
                return response.json();
            });
        }
        i++;
    }
}

async function write(txt) {
    const filter = {
        usbVendorId: 0x2341 // Arduino SA
    };
    const port = await navigator.serial.getPorts()
    console.log('port', port[0])
    const encoder = new TextEncoder();
    const writer = port[0].writable.getWriter();
    writer.write(encoder.encode(txt));
    writer.releaseLock();
}

async function connectPort() {
    const filter = {
        usbVendorId: 0x2341 // Arduino SA
    };
    const port = await navigator.serial.requestPort({ filters: [filter] })
    await port.open({ baudRate: 9600 });
    // const decoder = new TextDecoder();
    // const reader = port.readable.getReader();
    // const { value, done } = await reader.read();
    while (port.readable) {
        // console.log(decoder.decode(value));
        // writer.write(encoder.encode("AT"));

        const reader = port.readable.getReader();
        const decoder = new TextDecoder();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    // |reader| がキャンセルされました。
                    break;
                }
                // let pressedId = value;
                let pressedId = decoder.decode(value);
                console.log(pressedId);
                write("9");
                changeProgress2Red(pressedId);
                console.log(pressedId);
            }
        } catch (error) {
            console.error(error);
        } finally {
            reader.releaseLock();
        }
    }
}

/*
var stringReceived = '';

var onReceiveCallback = function (info) {
    if (info.connectionId == expectedConnectionId && info.data) {
        var str = convertArrayBufferToString(info.data);
        if (str.charAt(str.length - 1) === '\n') {
            stringReceived += str.substring(0, str.length - 1);
            console.log(stringReceived);    //文字列取得
            stringReceived = '';
        } else {
            stringReceived += str;
        }
    }
};

chrome.serial.onReceive.addListener(onReceiveCallback);
*/

// let port;

// async function onConnectButtonClick() {
//     try {
//         port = await navigator.serial.requestPort();
//         await port.open({ baudRate: 115200 });

//         while (port.readable) {
//             const reader = port.readable.getReader();

//             try {
//                 while (true) {
//                     const { value, done } = await reader.read();
//                     if (done) {
//                         addSerial("Canceled\n");
//                         break;
//                     }
//                     const inputValue = new TextDecoder().decode(value);
//                     addSerial(inputValue);
//                 }
//             } catch (error) {
//                 addSerial("Error: Read" + error + "\n");
//             } finally {
//                 reader.releaseLock();
//             }
//         }
//     } catch (error) {
//         addSerial("Error: Open" + error + "\n");
//     }
// }

function addSerial(msg) {
    var textarea = document.getElementById('outputArea');
    textarea.value += msg;
    textarea.scrollTop = textarea.scrollHeight;
}

async function sendSerial() {
    var text = document.getElementById('sendInput').value;
    document.getElementById('sendInput').value = "";

    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(text + "\n"));
    writer.releaseLock();
}