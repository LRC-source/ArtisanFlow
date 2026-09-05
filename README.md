# ArtisanFlow – Enterprise Agentic Manufacturing Pipeline

![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)
![Tech Stack: React / Vite](https://img.shields.io/badge/Tech_Stack-React_%7C_Vite-blue?style=for-the-badge)
![Backend: Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge)
![Payments: Square SDK](https://img.shields.io/badge/Payments-Square_SDK-lightgrey?style=for-the-badge)
![AI: Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-blueviolet?style=for-the-badge)

## Executive Summary / Overview

ArtisanFlow is a comprehensive, automated command center engineered specifically for formulators, craft manufacturers, and digital agencies. Designed to eliminate the friction of ingredient scaling, batch consistency, and raw material tracking, ArtisanFlow replaces unwieldy spreadsheets with an intelligent, agentic operations pipeline. It provides technical founders and manufacturing directors with an end-to-end, AI-powered system for optimizing supply chains and operational output.

## Architecture & Tech Stack Breakdown

*   **Frontend Framework:** React 18 with Vite for ultra-fast Hot Module Replacement (HMR) and optimized builds.
*   **Styling:** Modern, modular CSS / Tailwind configurations for responsive enterprise layouts.
*   **Backend & Data Layer:** Firebase Firestore for real-time data persistence and Firebase Authentication for secure access control.
*   **AI / Agentic Logic:** Google Gemini GenAI integrated for operational predictions, data insights, and automated workflow optimizations.
*   **Financial Integration:** Square SDK for gated access, subscription handling, and B2B payment processing.

## Key Features & Capabilities

*   **Dynamic BOM Management:** Automatically calculate and scale Bill of Materials (BOM) formulas with precision.
*   **Intelligent Batch & Yield Tracking:** Real-time forecasting and lot tracking to prevent raw material stockouts.
*   **Agentic Operational Insights:** Embedded AI workflows that analyze production data and recommend efficiency optimizations.
*   **Automated Lead Generation Pipelines:** Integrated systems to capture B2B client requests and route them through the operational dashboard.
*   **Enterprise-Grade Security:** Strict environment separation and secure credential management preventing data leaks.

## Setup & Installation Guide

1.  **Clone the Repository:**
    `ash
    git clone https://github.com/LRC-source/artisan-flow.git
    cd artisan-flow
    `
2.  **Environment Configuration:**
    *   Duplicate .env.example to .env and .env.local.
    *   Inject your Firebase SDK keys, Google GenAI keys, and Square Sandbox/Production tokens.
3.  **Install Dependencies:**
    `ash
    npm install
    `
4.  **Run Development Server:**
    `ash
    npm run dev
    `
5.  **Build for Production:**
    `ash
    npm run build
    `

## Architect / Author Attribution

**Designed and engineered by LRC-source.**
Focusing on full-stack web application development, automated digital operations, and bespoke agentic enterprise architectures.
