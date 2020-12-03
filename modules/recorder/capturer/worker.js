let canvas = null;
let context = null;

self.addEventListener('message', (event) => {
    const bitmap = event.data.bitmap;
    canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    context = canvas.getContext("2d");

    context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
    canvas.convertToBlob().then((blob) => {
        self.postMessage(blob);
    });
});
