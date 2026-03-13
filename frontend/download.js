const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

async function download() {
    console.log("Starting download...");
    try {
        const url1 = 'https://raw.githubusercontent.com/google/fonts/main/ofl/spacemono/SpaceMono-Regular.ttf';
        const res1 = await fetch(url1);
        const buffer1 = await res1.arrayBuffer();
        fs.writeFileSync(path.join(dir, 'SpaceMono-Regular.ttf'), Buffer.from(buffer1));
        console.log("Finished regular");

        const url2 = 'https://raw.githubusercontent.com/google/fonts/main/ofl/spacemono/SpaceMono-Bold.ttf';
        const res2 = await fetch(url2);
        const buffer2 = await res2.arrayBuffer();
        fs.writeFileSync(path.join(dir, 'SpaceMono-Bold.ttf'), Buffer.from(buffer2));
        console.log("Finished bold");
    } catch (e) {
        console.error("Error:", e);
    }
}
download();
