const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const email = 'qafree3a20260912bot_' + Date.now() + '@example.com';
  console.log('Registering with:', email);
  
  await page.goto('https://artisanflow.lrcholisticmarketing.online/', { waitUntil: 'networkidle2' });
  
  // Wait for GET STARTED
  await page.waitForSelector('button', { timeout: 15000 });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('GET STARTED'));
    if (btn) btn.click();
  });
  
  // Fill signup
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="text"]', 'QA Bot'); // Name
  await page.type('input[type="email"]', email); // Email
  await page.type('input[type="password"]', 'Password123!'); // Password
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('START FREE TRIAL'));
    if (btn) btn.click();
  });
  
  // Wait for Enter Dashboard
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('ENTER DASHBOARD'));
  }, { timeout: 20000 });
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('ENTER DASHBOARD'));
    if (btn) btn.click();
  });
  
  // Navigate to CRM
  await page.waitForFunction(() => window.location.href.includes('dashboard') || document.querySelector('h1'), { timeout: 20000 });
  await page.goto('https://artisanflow.lrcholisticmarketing.online/crm', { waitUntil: 'networkidle2' });
  
  // Wait for CRM page
  await page.waitForSelector('h1', { timeout: 15000 });
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find(b => b.innerText.includes('ADD'));
    if (addBtn) addBtn.click();
  });
  
  // Add customer
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs[0].value = 'QA Recheck Customer';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = 'qarecheckbot@example.com';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const save = btns.find(b => b.innerText.includes('SAVE'));
    if (save) save.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Click the customer in the list
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.luxury-card'));
    const card = cards.find(c => c.innerText.includes('QA Recheck Customer'));
    if (card) card.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Handle window.confirm
  page.on('dialog', async dialog => {
    console.log('Dialog opened:', dialog.message());
    await dialog.accept();
  });

  // Click Delete Customer
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const delBtn = btns.find(b => b.innerText.includes('DELETE CUSTOMER'));
    if (delBtn) delBtn.click();
    else console.log('Delete Customer button NOT FOUND!');
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  // Verify it's gone
  const stillExists = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.luxury-card')).some(c => c.innerText.includes('QA Recheck Customer'));
  });
  
  console.log('Still exists:', stillExists);
  
  await browser.close();
})();
