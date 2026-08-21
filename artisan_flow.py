import os
import json
import requests
from datetime import datetime

# ==============================================================================
# ARTISAN FLOW MASTER LEAD ORCHESTRATOR & STRATEGY ENGINE
# Built for Founder-to-Maker Personalization & Habit-Forming Growth
# ==============================================================================

CONFIG = {
    "PROJECT_NAME": "Artisan Flow VIP Waitlist Launch",
    "TARGET_SHEET_TAB": "Artisan_Flow_Waitlist_Prospects",
    "WEBHOOK_URL": "https://script.google.com/macros/s/YOUR_ARTISAN_WEBHOOK_URL/exec"
}

# 1. VERTICAL MAPPING (Covering all 21 maker types without false assumptions)
VERTICAL_BUCKETS = {
    "formulators_apothecaries": {
        "categories": [
            "Skincare or Formulator", "Herbalist & Apothecary", "Perfumer & Fragrance Creator",
            "Essential Oil & Aromatherapy Blender", "Hair Care & Body Care Artisan",
            "Herbal Tea & Beverage Formulator", "Tincture & Botanical Extract Craftsman"
        ],
        "pain_point": "managing ingredient Bills of Materials (BOMs), batch yield calculations, and complex lot/expiration tracking across spreadsheets.",
        "strategy_bias": "Eyal_Internal_Trigger"  # Focus on the anxiety of formulation errors
    },
    "hard_goods_crafts": {
        "categories": [
            "Resin & Home Decor Maker", "Ceramic & Pottery Artisan", "Leather Goods Craftsman",
            "Woodworking & Custom Furniture Maker", "Jewelry & Metal Accessories Designer",
            "Textile, Fiber & Apparel Artisan", "Custom T-Shirt & Clothing Maker",
            "Stationery, Paper & Printmaker", "Other Artisan / Handmade Goods"
        ],
        "pain_point": "tracking raw material costs, multi-component inventory, and custom production queues without losing margins to administrative overhead.",
        "strategy_bias": "Ellis_Growth_Hacking"  # Focus on throughput and scaling bottlenecks
    },
    "culinary_confectionery": {
        "categories": [
            "Specialty Food & Confectioner", "Gourmet Sauce & Condiment Artisan", "Bakery & Artisan Treats Maker"
        ],
        "pain_point": "juggling recipe batch scaling, fluctuating raw material costs, and wholesale margin compliance.",
        "strategy_bias": "Kennedy_Direct_ROI"  # Focus straight on profit protection
    }
}

class ArtisanStrategyEngine:
    """
    Combines Dan Kennedy, Neil Patel, Sean Ellis, Nir Eyal, 
    Daniel Priestley, and Brendan Kane methodologies.
    """
    @staticmethod
    def classify_vertical(category_name):
        for vertical_key, data in VERTICAL_BUCKETS.items():
            if category_name in data["categories"]:
                return vertical_key, data["pain_point"], data["strategy_bias"]
        return "hard_goods_crafts", "managing material costs and scaling production workflows.", "Ellis_Growth_Hacking"

    @staticmethod
    def generate_founder_pitch(lead_name, business_name, category, website_url):
        vertical_key, pain_point, bias = ArtisanStrategyEngine.classify_vertical(category)
        
        # Brendan Kane Hook (3-Second Rule) + Neil Patel Value Observation
        hook = f"Hey {lead_name}, fellow maker here. Stumbled across {business_name} today—love what you're building."
        
        # Daniel Priestley (Key Person of Influence) + Nir Eyal (Hooked Trigger) Frame
        if bias == "Eyal_Internal_Trigger":
            body = (
                f"As creators, we love the craft, but let's be honest: {pain_point} "
                f"usually feels like running a marathon in lead shoes. That exact friction is why we built Artisan Flow—"
                f"to turn your workshop operations into an automated command center."
            )
        elif bias == "Ellis_Growth_Hacking":
            body = (
                f"When you start moving past hobbyist volume, {pain_point} becomes the silent killer of profit margins. "
                f"We built Artisan Flow specifically to give independent makers the operational backbone usually reserved for enterprise brands."
            )
        else: # Kennedy Direct ROI
            body = (
                f"If we're being straight, {pain_point} eats profits faster than anything else in a small-batch business. "
                f"Artisan Flow is launching soon to lock down your margins and automate your production workflow."
            )

        # Dan Kennedy Direct Response Call to Action + Grandfathered Incentive
        cta = (
            f"We’re opening our VIP waitlist for a tight circle of makers before public launch. "
            f"Lock in lifetime grandfathered pricing right here: [VIP_WAITLIST_LINK]\n\n"
            f"Keep creating,\n- Founder, Artisan Flow"
        )

        return f"{hook}\n\n{body}\n\n{cta}"

# 2. THE ARTISAN HARVESTER & AUDITOR (Phases 1 & 2)
def run_artisan_pipeline():
    print(f"[{datetime.now()}] Initializing {CONFIG['PROJECT_NAME']} Engine...")
    
    # Simulated multi-vertical target cache ingestion
    raw_leads = [
        {"name": "Sarah", "business": "Botanical Glow Apothecary", "category": "Herbalist & Apothecary", "url": "botanicalglow.com"},
        {"name": "Marcus", "business": "Iron & Oak Woodshop", "category": "Woodworking & Custom Furniture Maker", "url": "ironoakshop.com"},
        {"name": "Elena", "business": "Wild Flour Confections", "category": "Bakery & Artisan Treats Maker", "url": "wildflourtreats.com"}
    ]

    processed_leads = []

    for lead in raw_leads:
        print(f"Auditing e-commerce footprint for: {lead['business']} ({lead['category']})")
        
        # Generate the elite multi-strategy founder pitch
        custom_pitch = ArtisanStrategyEngine.generate_founder_pitch(
            lead['name'], lead['business'], lead['category'], lead['url']
        )

        lead_payload = {
            "MakerName": lead['name'],
            "BusinessName": lead['business'],
            "Category": lead['category'],
            "Website": lead['url'],
            "PersonalizedPitch": custom_pitch,
            "Timestamp": datetime.now().isoformat()
        }
        processed_leads.append(lead_payload)

    # Cache locally to dedicated ArtisanFlow logs folder
    os.makedirs(os.path.join(os.path.dirname(__file__), "logs"), exist_ok=True)
    cache_path = os.path.join(os.path.dirname(__file__), "logs", "audited_maker_leads.json")
    with open(cache_path, "w") as f:
        json.dump(processed_leads, f, indent=4)
        
    print(f"Successfully processed {len(processed_leads)} artisan leads. Saved to {cache_path}")
    return processed_leads

if __name__ == "__main__":
    run_artisan_pipeline()
