const puppeteer = require("puppeteer");

async function main() {
  console.log("🚀 Abrindo browser...");
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");

  console.log("🔍 Acessando GSMArena...");
  await page.goto("https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=Samsung+Galaxy+S24", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });

  const title = await page.title();
  console.log("📄 Título da página:", title);

  const html = await page.content();
  const hasMakers = html.includes("class=\"makers\"");
  console.log("📦 .makers presente:", hasMakers);

  if (hasMakers) {
    const results = await page.$$eval(".makers li", (els) =>
      els.map((el) => ({
        name: el.querySelector("span")?.textContent?.trim(),
        href: el.querySelector("a")?.getAttribute("href"),
        img: el.querySelector("img")?.getAttribute("src"),
      }))
    );
    console.log("✅ Resultados:", results.slice(0, 3));
  } else {
    console.log("⚠️  Turnstile ainda presente ou estrutura diferente");
    console.log(html.slice(0, 500));
  }

  await browser.close();
}

main().catch(console.error);
