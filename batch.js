import puppeteer from 'puppeteer';
import fs, {existsSync} from 'node:fs'
import fsp from 'node:fs/promises'

(async () => {

  const browser = await puppeteer.launch({
    channel: "chrome",
    headless: "new",
    devtools: true,
    args: [
      '--enable-webgl'
    ]
  });

  let counter = process.argv[2] ? parseInt(process.argv[2], 10) : 10;

  while(counter--){

    const page = await browser.newPage();
    await page.goto('http://localhost:5173/');

    const canvas = '#defaultCanvas0';
    await page.waitForSelector(canvas);
    
    // get hash
    const tokenData = await page.evaluate( () => tokenData );
    const PARAMS = await page.evaluate( () => PARAMS );
    console.log(counter, tokenData.hash)

    // create export dir (if not exist)
    if (!existsSync('./export')){
      fs.mkdirSync('./export', { recursive: true });
    }

    // save canvas img 1k
    const img = await page.$eval(canvas, el => getResizedCanvas(el, el.width/4, el.height/4).toDataURL());
    const data = img.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, "base64");
    await fsp.writeFile(`./export/${PARAMS.scaleType}-${PARAMS.paletteType}-${PARAMS.paletteName}-${tokenData.hash}.png`, buf);
    await page.close()
  }

  await browser.close();
})();