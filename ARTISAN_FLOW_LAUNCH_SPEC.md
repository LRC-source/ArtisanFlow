# Artisan Flow - Launch Specification & Capability Map

## Core Value Proposition & Target Personas
**Artisan Flow** is the ultimate AI-powered manufacturing and marketing ecosystem designed specifically for modern makers. It bridges the gap between raw industrial precision and artisanal craftsmanship. 

**Target Personas:**
- **Herbalists & Apothecaries**: Managing complex botanical formulations, batch tracking, and raw material shelf-life.
- **Botanical Formulators & Skincare Creators**: Requiring precise Bill of Materials (BOM), unit cost tracking, and quality control logs.
- **Artisan Makers (Candles, Soaps, Fragrances)**: Scaling operations from the kitchen table to commercial warehouses, needing integrated CRM, orders, and automated multi-channel marketing.

---

## Complete Feature Inventory

### 1. Operations Hub
- **Recipe Builder (BOM)**: Create and manage exact formulations, tracking precise raw material deductions and cost-per-unit.
- **Production Scheduler & Workflow**: Kanban-style board tracking active jobs from prep, to curing, to final packaging.
- **Warehouse & Inventory View**: Deep auditing of raw and finished goods, integrating low-stock alerts and valuation.
- **Supplier Manager & QC**: Vendor tracking, purchase orders, and pass/fail quality control ledgers.
- **CRM & Order Processing**: Intake sales from any channel (Square, manual) and track fulfillment.

### 2. Finance Hub & Profit Guard™
- **Financial Projections & Budget Guard**: AI-assisted cash flow analysis and budget monitoring.
- **Profit Guard™**: Advanced anomaly detection, high-precision margin analysis, and burn-rate tracking.
- **Forecasting**: Predictive inventory analysis to avoid stock-outs.

### 3. Marketing Hub & Lola AI
- **Generative AI Marketing**: One-click generation of Blogs, Social Media, and Video scripts tailored to the brand's unique voice.
- **Lola Intelligence Node**: Embedded AI assistant offering strategic todos, workflow guidance, and real-time business insights.
- **Content Calendar**: Drag-and-drop marketing deployment scheduling.

---

## User Tier Matrix

### Tier 1: Free Audit
**"The Baseline Access"**
- **Included**: Inventory Hub, Recipe Builder (BOM), Basic Production Workflow, CRM, Lola AI Assistant, Basic Pulse Check.
- **Locked**: Operations Command Center, Suppliers, Quality Control, Advanced Marketing Hub (Studio, Video, Blog), Finance Projections, Profit Guard, Forecasting.

### Tier 2: Artisan Flow Basic
**"The Scaling Maker"**
- **Included**: Everything in Free Audit, *plus*:
  - Full Operations Command Center (Orders, Suppliers, Warehouse, QC, Scheduler).
  - Complete Marketing Hub (Social, Blog, Video Creator, Content Calendar, Brand Voice Profile).
  - Finance Hub & Financial Projections.
  - Customer Portal & Advanced Integrations.

### Tier 3: Margin Protection Pro
**"The Enterprise Artisan"**
- **Included**: Everything in Artisan Flow Basic, *plus*:
  - **Profit Guard™**: Real-time margin protection and anomaly detection.
  - **Inventory Forecasting**: Advanced predictive analytics and safety stock modeling.

---

## End-to-End User Workflows

### 1. The Formulation to Fulfillment Pipeline
1. **Raw Material Intake**: Maker logs new waxes, wicks, and botanicals via the Inventory Hub, setting unit costs.
2. **Recipe Creation**: Maker builds a new BOM in the Recipe Builder, allocating specific percentages of raw materials. The system calculates exact unit costs and retail margins.
3. **Batch Production**: Maker schedules a batch in the Production Workflow. Upon completion, the Batch Deduction Engine automatically deducts the raw materials from inventory and adds the finished goods to the stock ledger.
4. **Order Fulfillment**: A customer purchases the item via Square. The CRM logs the order, and the stock is automatically decremented. Profit Guard monitors the transaction margin.

### 2. The Omnichannel Growth Cycle
1. **Brand Voice Setup**: Maker defines their brand aesthetic and tone in the Marketing Hub.
2. **AI Content Generation**: Using the Social Media Creator or Blog Generator, the maker produces a week's worth of content.
3. **Scheduling**: Content is dragged into the Content Calendar.
4. **Conversion Analysis**: The Visual Analysis Node correlates marketing deployment with incoming orders.

---

## Integrations & Tech Capabilities
- **Square SDK Integration**: Secure, true server-side payment processing loop via Vercel serverless functions (`/api/checkout.ts`).
- **Firebase Backend**: Real-time Firestore dual-write synchronization and robust Google Auth state management.
- **Static Pre-Rendering (SSG)**: High-speed, SEO-optimized public funnels with strict client-side auth gating for application routes.
- **Data Portability**: Universal CSV importer for seamless migration from legacy systems (like Craftybase), and robust data export ledgers.
