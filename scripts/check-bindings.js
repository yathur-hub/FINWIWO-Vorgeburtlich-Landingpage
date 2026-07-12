import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('--- Start Deployment Binding Check ---');

// 1. Parse wrangler.toml to check CLEVA_API_URL
const wranglerPath = path.resolve(process.cwd(), 'wrangler.toml');
if (!fs.existsSync(wranglerPath)) {
  console.error('❌ wrangler.toml nicht gefunden!');
  process.exit(1);
}

const content = fs.readFileSync(wranglerPath, 'utf8');

// Check CLEVA_API_URL in [vars]
const varsMatch = content.match(/\[vars\][^]*?CLEVA_API_URL\s*=\s*"([^"]+)"/);
if (!varsMatch) {
  console.error('❌ CLEVA_API_URL ist nicht in wrangler.toml unter [vars] definiert!');
  process.exit(1);
}

const clevaApiUrl = varsMatch[1];
console.log(`✅ CLEVA_API_URL gefunden in wrangler.toml: ${clevaApiUrl}`);

// 2. Check Secrets via wrangler secret list (if wrangler is logged in)
console.log('Prüfe Cloudflare Worker Secrets...');
try {
  // We run wrangler commands with --json if possible, or just parse output.
  // We can try to list secrets. Note that this requires CF authentication.
  // If wrangler is not authenticated (exit code !== 0), we check if we are running in CI/CD or local env.
  // If we can fetch secrets, we verify CLEVA_API_KEY and CLEVA_SUPABASE_ANON_KEY are present.
  const stdout = execSync('npx wrangler secret list', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  
  let secrets = [];
  try {
    secrets = JSON.parse(stdout);
  } catch {
    // Fallback if not JSON
    secrets = [];
  }

  const secretNames = Array.isArray(secrets) ? secrets.map(s => s.name) : [];
  
  if (secretNames.length > 0) {
    const requiredSecrets = ['CLEVA_API_KEY', 'CLEVA_SUPABASE_ANON_KEY'];
    const missing = requiredSecrets.filter(s => !secretNames.includes(s));
    
    if (missing.length > 0) {
      console.error(`❌ Fehlende Secrets in Cloudflare: ${missing.join(', ')}`);
      console.error('Bitte füge sie hinzu mit:');
      missing.forEach(m => console.error(`  npx wrangler secret put ${m}`));
      process.exit(1);
    }
    console.log('✅ Alle erforderlichen Secrets (CLEVA_API_KEY, CLEVA_SUPABASE_ANON_KEY) sind in Cloudflare aktiv!');
  } else {
    console.log('⚠️ Keine Secrets von Cloudflare zurückgegeben oder unstrukturiertes Ergebnis. Fahre fort...');
  }
} catch (err) {
  console.log('⚠️ npx wrangler secret list konnte nicht ausgeführt werden (evtl. nicht eingeloggt oder kein Internet).');
  console.log('Stelle sicher, dass CLEVA_API_KEY und CLEVA_SUPABASE_ANON_KEY manuell auf Cloudflare hinterlegt wurden.');
}

console.log('--- Deployment Binding Check erfolgreich abgeschlossen ---');
process.exit(0);
