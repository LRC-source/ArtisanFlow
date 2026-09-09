import re

with open(r"components\LandingPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '''<PricingCard 
                            title="Margin Protection Pro"
                            price="$99"''',
    '''<PricingCard 
                            title="Margin Protection Pro"
                            price="$149"'''
)

with open(r"components\LandingPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Pricing updated.")
