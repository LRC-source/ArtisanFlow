import re

with open(r"components\Layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_map = '''      const gateMap: Record<string, string> = {
        '/marketing/avatar': 'mktg_avatar',
        '/forecasting': 'logistics_forecast',
        '/business-pulse-check': 'dash_diagnostic',
        '/business-pulse': 'dash_diagnostic',
        '/budget-guard': 'profit_guard'
      };'''

new_map = '''      const gateMap: Record<string, string> = {
        '/marketing/avatar': 'mktg_avatar',
        '/forecasting': 'logistics_forecast',
        '/business-pulse-check': 'dash_diagnostic',
        '/business-pulse': 'dash_diagnostic',
        '/budget-guard': 'profit_guard',
        '/profit-guard': 'profit_guard',
        '/finance/budget-guard': 'profit_guard'
      };'''

content = content.replace(old_map, new_map)

with open(r"components\Layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("gateMap updated.")
