const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /PRIMARY NODES/g, to: "MAIN MENU" },
  { from: /Primary Nodes/g, to: "Main Menu" },
  { from: /Support Node/g, to: "Support" },
  { from: /12 Studio Nodes/g, to: "12 Studio Tools" },
  { from: /Governance node for marketing deployment\./g, to: "Review and approve marketing content before it goes live." },
  { from: /SEO-optimized content synthesis node with structural preview/g, to: "SEO blog writer with live outline preview" },
  { from: /NODE 1 OF 2/g, to: "STEP 1 OF 2" },
  { from: /PERSONALITY NODE/gi, to: "CREATOR ARCHETYPE" },
  { from: /Personality Node/gi, to: "Creator Archetype" },
  { from: /Stressed \(Dropping nodes\)/g, to: "Stressed (losing momentum)" },
  { from: /Node: Marketing Studio/g, to: "Section: Marketing Studio" },
  { from: /BILL OF MATERIALS \(BOM NODES\)/g, to: "BILL OF MATERIALS" },
  { from: /INITIALIZE NEW BOM NODE/g, to: "ADD MATERIAL" },
  { from: /DATA PERSISTENT IN VAULT NODE/g, to: "SAVED AUTOMATICALLY" },
  { from: /At least one BOM node is required/g, to: "Add at least one material to your recipe" },
  { from: /ADD MANUAL NODE/g, to: "ADD CUSTOMER" },
  { from: /Initialize Vault Node/g, to: "Add New Customer" },
  { from: /AUTHORIZE NODE CREATION/g, to: "ADD CUSTOMER" },
  { from: /Scan for nodes by name, email, or metadata\.\.\./g, to: "Search customers by name, email, or keyword..." },
  { from: /ACTIVE NODES/g, to: "TOTAL CUSTOMERS" },
  { from: /ORDER NODES/g, to: "ORDERS" },
  { from: /0 ACTIVE NODES/g, to: "0 ACTIVE ITEMS" },
  { from: /ALL NODES STABLE/g, to: "ALL STOCK LEVELS OK" },
  { from: /BALANCE SHEET NODE/gi, to: "BALANCE SHEET" },
  { from: /Balance Sheet Node/gi, to: "Balance Sheet" },
  { from: /TARGET AUDIENCE NODE/g, to: "TARGET AUDIENCE" },
  { from: /Internal governance node for marketing deployment\./g, to: "Review and approve marketing content before it goes live." },
  { from: /DEPLOY LOGIC TO LOLA NODE/g, to: "ACTIVATE FOR LOLA" },
  { from: /ArtisanFlow Support Node/gi, to: "ArtisanFlow Support" },
  { from: /SUBMIT NODE/g, to: "SUBMIT REQUEST" },
  { from: /Identity Nodes/gi, to: "Profile" }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./components').concat(walk('./src'));

let changedFiles = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  replacements.forEach(r => {
    newContent = newContent.replace(r.from, r.to);
  });
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log("Updated", file);
  }
});
console.log(`Replaced in ${changedFiles} files`);
