const axios = require("axios");
const cheerio = require("cheerio");

async function main() {
  console.log("🔍 Testando busca direta no GSMArena...\n");

  try {
    const res = await axios({
      method: "get",
      url: "https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=Samsung+Galaxy+S24",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.gsmarena.com/",
        "Cookie": "PHPSESSID=gsmarena; ratePercentage=0; siteversion=2",
      },
      timeout: 15000,
    });

    const html = res.data;
    const $ = cheerio.load(html);

    const makers = $(".makers");
    console.log("📦 .makers encontrado:", makers.length > 0 ? "SIM" : "NÃO");

    const items = makers.find("li");
    console.log("📱 Itens encontrados:", items.length);

    if (items.length > 0) {
      items.slice(0, 3).each((i, el) => {
        console.log(`  [${i + 1}]`, $(el).find("span").text().trim(), "→", $(el).find("a").attr("href"));
      });
    } else {
      // Print first 2000 chars to diagnose
      console.log("\n⚠️  HTML retornado (primeiros 2000 chars):");
      console.log(html.slice(0, 2000));
    }

    // Test gsmarena-api with patched utils
    console.log("\n🔁 Testando via gsmarena-api (após patch)...");
    const gsmarena = require("gsmarena-api");
    const results = await gsmarena.search.search("Samsung Galaxy S24");
    console.log("✅ Resultados:", results.length);
    if (results.length > 0) {
      console.log("  Primeiro:", results[0]);
    }

  } catch (err) {
    console.error("❌ Erro:", err.message);
    if (err.response) {
      console.error("   Status:", err.response.status);
      console.error("   Headers:", JSON.stringify(err.response.headers, null, 2));
    }
  }
}

main();
