import Toast from "./toasts.js";

document.getElementById('toggle').addEventListener('click', () => {
    const toast = new Toast({ text: "hello world!", design: 'material' });
})