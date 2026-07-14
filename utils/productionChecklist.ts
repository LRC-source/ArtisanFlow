/**
 * Artisan Flow - Production Build Checklist & Environmental Audit Node
 * Verifies key parameters and environmental configurations prior to production handshakes.
 */

export interface EnvironmentalAuditResult {
  isReady: boolean;
  errors: string[];
  warnings: string[];
}

export const runProductionAudit = (): EnvironmentalAuditResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log("%c[Artisan Flow Production Audit] Initializing security checks...", "color: #6A2C91; font-weight: bold;");

  // 1. Verify Gemini API Key
  const geminiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!geminiKey) {
    errors.push("Missing GEMINI_API_KEY in environment variables. Cognitive nodes will be offline.");
  } else if (geminiKey === "your_api_key_here" || geminiKey.trim() === "") {
    errors.push("GEMINI_API_KEY is placeholder. Needs actual API credentials.");
  }

  // 2. Verify API Key mapping compatibility (legacy key support in config)
  const legacyKey = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
  if (!legacyKey && geminiKey) {
    warnings.push("VITE_API_KEY is not defined directly. Relying on GEMINI_API_KEY fallback mapping.");
  }

  // 3. Verify Node Environment
  const nodeEnv = process.env.NODE_ENV || (import.meta as any).env?.MODE;
  if (!nodeEnv) {
    warnings.push("NODE_ENV / Mode is not explicitly configured. Defaulting to development logic.");
  } else {
    console.log(`%c[Artisan Flow] Running in environment mode: ${nodeEnv}`, "color: #78BE20;");
  }

  // 4. Output Summary Reports
  if (errors.length > 0) {
    console.error("%c[Audit Failure] Production deployment contains critical bottlenecks:", "color: #EF4444; font-weight: bold;");
    errors.forEach(err => console.error(`- ${err}`));
  } else {
    console.log("%c[Audit Success] All operational and environmental nodes synchronized.", "color: #78BE20; font-weight: bold;");
  }

  if (warnings.length > 0) {
    console.warn("%c[Audit Warnings] Suggestions for optimization:", "color: #F59E0B;");
    warnings.forEach(warn => console.warn(`- ${warn}`));
  }

  return {
    isReady: errors.length === 0,
    errors,
    warnings
  };
};
