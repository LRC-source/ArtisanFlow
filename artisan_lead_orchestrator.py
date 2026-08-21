import os
import sys
import json
import logging
import requests
import re
import time
import random
from datetime import datetime
from bs4 import BeautifulSoup
from ddgs import DDGS

# ==============================================================================
# ARTISAN FLOW MASTER LEAD ORCHESTRATOR & LATOYA CARTER PERSONA ENGINE
# Optimized for Peer-to-Peer Founder Outreach & Habit-Forming Growth
# ==============================================================================

CONFIG = {
    "PROJECT_NAME": "Artisan Flow VIP Waitlist Launch",
    "FOUNDER_NAME": "LaToya Renee Carter",
    "FOUNDER_BRAND": "Herbalistic Wellness",
    "TARGET_SHEET_TAB": "Artisan_Flow_Waitlist_Prospects",
    "WEBHOOK_URL": "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec",
    "TARGET_REGION": "Maryland"
}

# ------------------------------------------------------------------------------
# DIAGNOSTICS & SYSTEM LOGGING
# ------------------------------------------------------------------------------
LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

error_logger = logging.getLogger("SystemErrors")
error_logger.setLevel(logging.ERROR)
fh = logging.FileHandler(os.path.join(LOG_DIR, "system_errors.log"))
fh.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
error_logger.addHandler(fh)

# ------------------------------------------------------------------------------
# 1. EXPANDED MULTI-VERTICAL MAPPING 
# ------------------------------------------------------------------------------
VERTICAL_BUCKETS = {
    "formulators_apothecaries": {
        "categories": [
            "Skincare or Formulator", "Herbalist & Apothecary", "Perfumer & Fragrance Creator",
            "Essential Oil & Aromatherapy Blender", "Hair Care & Body Care Artisan",
            "Herbal Tea & Beverage Formulator", "Tincture & Botanical Extract Craftsman"
        ],
        "context_intro": "As a fellow formulator running [Herbalistic Wellness](https://herbalisticwellness.com/), I know firsthand how quickly managing ingredient Bills of Materials (BOMs), batch yields, and lot tracking in spreadsheets gets out of hand.",
        "pain_point": "ingredient scaling, batch consistency, and raw material tracking",
        "strategy_bias": "Eyal_Internal_Trigger"
    },
    "hard_goods_crafts": {
        "categories": [
            "Resin & Home Decor Maker", "Ceramic & Pottery Artisan", "Leather Goods Craftsman",
            "Woodworking & Custom Furniture Maker", "Jewelry & Metal Accessories Designer",
            "Textile, Fiber & Apparel Artisan", "Custom T-Shirt & Clothing Maker",
            "Stationery, Paper & Printmaker", "Other Artisan / Handmade Goods"
        ],
        "context_intro": "While my roots are in formulation with [Herbalistic Wellness](https://herbalisticwellness.com/), stepping into the broader maker space showed me how brutal tracking multi-component inventory, custom production queues, and material costs across collections can be.",
        "pain_point": "multi-component inventory, material cost leakage, and production scheduling",
        "strategy_bias": "Ellis_Growth_Hacking"
    },
    "culinary_confectionery": {
        "categories": [
            "Specialty Food & Confectioner", "Gourmet Sauce & Condiment Artisan", "Bakery & Artisan Treats Maker"
        ],
        "context_intro": "Running a small-batch culinary business means juggling recipe batch scaling, shifting ingredient costs, and wholesale margin compliance all at once.",
        "pain_point": "recipe batch scaling, ingredient cost fluctuations, and wholesale margins",
        "strategy_bias": "Kennedy_Direct_ROI"
    }
}

# Simplified negative filters to ensure search engines process them cleanly
NEGATIVE_FILTERS = "-site:instagram.com -site:facebook.com -site:pinterest.com -site:etsy.com -site:yelp.com -site:linkedin.com"

# Realistic User-Agents for Stealth Scraping
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
]

class LatoyaPersonalizationEngine:
    @staticmethod
    def classify_vertical(category_name):
        for vertical_key, data in VERTICAL_BUCKETS.items():
            if category_name in data["categories"]:
                return data["context_intro"], data["pain_point"], data["strategy_bias"]
        return (
            "Stepping into the maker space showed me how brutal tracking material costs and manual inventory across collections can be.",
            "manual workflow tracking and overhead time",
            "Ellis_Growth_Hacking"
        )

    @staticmethod
    def generate_founder_pitch(lead_name, business_name, category, website_url):
        context_intro, pain_point, bias = LatoyaPersonalizationEngine.classify_vertical(category)
        
        # Highly optimized, peer-to-peer subject lines based on cognitive biases
        if bias == "Eyal_Internal_Trigger":
            subject = f"Fellow maker / ingredient scaling at {business_name}"
        elif bias == "Ellis_Growth_Hacking":
            subject = f"Quick question about {business_name}'s production workflow"
        else: # Kennedy Direct ROI
            subject = f"Protecting wholesale margins at {business_name}"
            
        hook = f"Hey {lead_name}, LaToya Renee Carter here from Herbalistic Wellness and LRC Artisan Flow. Stumbled across {business_name} today—love what you're building."
        
        if bias == "Eyal_Internal_Trigger":
            body = (
                f"{context_intro} We love the craft, but let's be honest: {pain_point} "
                f"usually feels like running a marathon in lead shoes. That exact friction is why I built Artisan Flow—"
                f"to turn your workshop operations into an automated command center."
            )
        elif bias == "Ellis_Growth_Hacking":
            body = (
                f"{context_intro} When you start moving past hobbyist volume, {pain_point} becomes the silent killer of profit margins. "
                f"I built Artisan Flow specifically to give independent makers the operational backbone usually reserved for enterprise brands."
            )
        else: # Kennedy Direct ROI
            body = (
                f"{context_intro} If we're being straight, {pain_point} eats profits faster than anything else in a small-batch business. "
                f"Artisan Flow is launching soon to lock down your margins and automate your production workflow."
            )

        cta = (
            f"We’re opening our VIP waitlist for a tight circle of makers before public launch, and I wanted to personally invite you. "
            f"Lock in lifetime member perks accessible on our launch day (Sept 1st, 2026) by joining our VIP waitlist now ... Click here: [https://artisanflow.lrcholisticmarketing.online/](https://artisanflow.lrcholisticmarketing.online/)\n\n"
            f"Hope to see you there & Keep creating,\n- LaToya Renee Carter\n  Founder, LRC Artisan Flow"
        )

        return subject, f"{hook}\n\n{body}\n\n{cta}"

# ------------------------------------------------------------------------------
# 2. ZERO-COST ANTI-BLOCK SEARCH & DEEP-LINK EXTRACTION
# ------------------------------------------------------------------------------
def extract_emails_from_html(html):
    """Regex engine for capturing raw emails, stripping false positives."""
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    emails = re.findall(email_pattern, html)
    
    valid_emails = []
    for e in emails:
        e = e.lower()
        if not e.endswith(('.png', '.jpg', '.jpeg', '.gif', 'wixpress.com', 'sentry.io')):
            valid_emails.append(e)
            
    return list(set(valid_emails))

def scrape_website_for_contact(url):
    """
    Crawls the homepage and /contact pages.
    Enforces strict anti-hallucination guardrails.
    """
    try:
        headers = {'User-Agent': random.choice(USER_AGENTS)}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        emails = extract_emails_from_html(response.text)
        
        if not emails:
            for link in soup.find_all('a', href=True):
                href = link.get('href', '').lower()
                if 'contact' in href or 'about' in href:
                    contact_url = link['href']
                    if contact_url.startswith('/'):
                        contact_url = url.rstrip('/') + contact_url
                    elif not contact_url.startswith('http'):
                        continue
                    
                    try:
                        c_resp = requests.get(contact_url, headers=headers, timeout=10)
                        emails = extract_emails_from_html(c_resp.text)
                        if emails: break
                    except:
                        continue
                        
        if not emails:
            return None, None, None
            
        title = soup.title.string.strip() if soup.title else url.split('//')[-1].split('/')[0]
        business_name = title.split('|')[0].split('-')[0].strip()
        
        name_match = re.search(r"(?:Hi|Hello),? I(?:'| a)m ([A-Z][a-z]+)", response.text)
        founder_name = name_match.group(1) if name_match else "Founder"
        
        return business_name, emails[0], founder_name
        
    except Exception as e:
        error_logger.warning(f"Scrape failed for {url}: {e}")
        return None, None, None


def run_artisan_pipeline():
    print(f"[{datetime.now()}] Initializing Zero-Cost DDG Harvester for {CONFIG['FOUNDER_NAME']}...")
    print("[STEALTH MODE ACTIVE] - Bypassing Google 429 Blocks via DuckDuckGo routing.\n")
    
    processed_leads = []
    
    all_categories = []
    for bucket in VERTICAL_BUCKETS.values():
        all_categories.extend(bucket["categories"])
        
    target_categories = random.sample(all_categories, 3)
    
    print(f"[*] Selected 3 categories for this batch: {', '.join(target_categories)}")
        
    for idx, category in enumerate(target_categories):
        query = f'{category} {CONFIG["TARGET_REGION"]} email contact {NEGATIVE_FILTERS}'
        print(f"\n[SEARCHING] DuckDuckGo for: {category}")
        
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=4))
                
            for result in results:
                url = result.get('href')
                if not url: continue
                
                print(f" -> Found URL: {url}")
                business_name, email, founder_name = scrape_website_for_contact(url)
                
                if email and business_name:
                    print(f"    [+] EXECUTED: Extracted {founder_name} at {business_name} ({email})")
                    
                    subject, custom_pitch = LatoyaPersonalizationEngine.generate_founder_pitch(
                        founder_name, business_name, category, url
                    )
                    
                    lead_payload = {
                        "MakerName": founder_name,
                        "BusinessName": business_name,
                        "Category": category,
                        "Website": url,
                        "Email": email,
                        "SenderPersona": f"{CONFIG['FOUNDER_NAME']} ({CONFIG['FOUNDER_BRAND']})",
                        "PitchSubject": subject,
                        "PersonalizedPitch": custom_pitch,
                        "Timestamp": datetime.now().isoformat()
                    }
                    processed_leads.append(lead_payload)
                else:
                    print(f"    [-] DROPPED: No public email found. Strict anti-hallucination policy enforced.")
                    
        except Exception as e:
            error_msg = f"Search failed for {category}: {e}"
            error_logger.error(error_msg)
            print(f"    [!] {error_msg}")
                
        if idx < len(target_categories) - 1:
            delay = random.randint(10, 22)
            print(f"\n[STEALTH] Sleeping for {delay} seconds before next category...")
            time.sleep(delay)

    if not processed_leads:
        print("\n[WARNING] No viable leads passed the strict exclusion filters on this run.")
        return []

    cache_path = os.path.join(LOG_DIR, "audited_maker_leads.json")
    with open(cache_path, "w") as f:
        json.dump(processed_leads, f, indent=4)
        
    print(f"\n[SUCCESS] Harvested & generated pitches for {len(processed_leads)} valid leads. Saved locally.")

    if CONFIG["WEBHOOK_URL"] and CONFIG["WEBHOOK_URL"].startswith("https://script.google.com/"):
        try:
            print("Pushing validated leads to Google Apps Script Webhook...")
            response = requests.post(CONFIG["WEBHOOK_URL"], json=processed_leads, timeout=10)
            if response.status_code == 200:
                print("[SUCCESS] Payload delivered! Check your inbox for the Phase 1 Approval Email.")
            else:
                error_msg = f"Failed to push leads to Google Sheets. Status Code: {response.status_code}"
                error_logger.error(error_msg)
                print(f"[ERROR] {error_msg}")
        except Exception as e:
            error_msg = f"Webhook Connection Error: {e}"
            error_logger.error(error_msg)
            print(f"[ERROR] {error_msg}")

    return processed_leads

if __name__ == "__main__":
    run_artisan_pipeline()
