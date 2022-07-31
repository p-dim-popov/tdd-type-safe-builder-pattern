import writeTextFile = Deno.writeTextFile;
import remove = Deno.remove;
import readTextFile = Deno.readTextFile;

const htmlPath = `${Deno.cwd()}/index.html`;

(async function () {
    if (await readTextFile(htmlPath).catch(() => null)) {
        console.log(`Removing old ${htmlPath}`);
        await remove(htmlPath)
    }

    const response = await fetch(`https://google.com/search?${new URLSearchParams([["q", "typescript"], ["tbs", "qdr:d"]])}`)
    const html = await response.text();
    await writeTextFile(htmlPath, html);
    console.log(`${htmlPath} ready`)
})()
