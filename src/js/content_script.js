import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react"
//import 'bootstrap/dist/css/bootstrap.min.css';

document.onclick = function () {
    onConnectButtonClick();
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

let port;

async function onConnectButtonClick() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        while (port.readable) {
            const reader = port.readable.getReader();

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        addSerial("Canceled\n");
                        break;
                    }
                    const inputValue = new TextDecoder().decode(value);
                    addSerial(inputValue);
                }
            } catch (error) {
                addSerial("Error: Read" + error + "\n");
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        addSerial("Error: Open" + error + "\n");
    }
}

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