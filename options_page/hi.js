
async function hi() {
    setTimeout(2000, () => {
        let text = await Promise.resolve("musha");
        console.log(text);
    });
}
