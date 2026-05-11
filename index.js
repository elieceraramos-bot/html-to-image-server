const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/screenshot', async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'Falta el campo html' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 30000 });

    const screenshot = await page.screenshot({ fullPage: true, type: 'png' });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(screenshot);

  } catch (err) {
    if (browser) await browser.close();
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));
