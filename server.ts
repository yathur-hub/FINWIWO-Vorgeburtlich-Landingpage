import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/lead-import", async (req: express.Request, res: express.Response) => {
    try {
      const payload = req.body;

      // Log receipt of lead without exposing personal details (PII)
      console.log("Lead received for proxying:", {
        formularname: payload?.formularname,
        quelle: payload?.quelle,
        beratungsart: payload?.beratungsart,
        anrede: payload?.anrede,
        wohnort_kanton: payload?.wohnort_kanton,
      });

      // 1. Server-side validation of mandatory fields
      const requiredFields = [
        "beratungsart",
        "voraussichtlicher_geburtstermin",
        "anrede",
        "vorname",
        "nachname",
        "telefonnummer",
        "email",
        "wohnort_kanton",
        "datenschutz_akzeptiert"
      ];

      const missingFields = requiredFields.filter(
        field => payload[field] === undefined || payload[field] === null || payload[field] === ""
      );

      if (missingFields.length > 0) {
        console.warn(`Validation failed: missing fields [${missingFields.join(", ")}]`);
        return res.status(400).json({
          error: `Bitte fülle alle Pflichtfelder aus. Fehlende Felder: ${missingFields.join(", ")}`
        });
      }

      // Ensure datenschutz_akzeptiert is true
      if (payload.datenschutz_akzeptiert !== true) {
        return res.status(400).json({
          error: "Die Datenschutzerklärung muss zwingend akzeptiert werden."
        });
      }

      // 2. Retrieve API Key
      const apiKey = process.env.CLEVA_API_KEY;
      if (!apiKey) {
        console.error("CLEVA_API_KEY is not defined in environment variables!");
        return res.status(500).json({
          error: "Server-Konfigurationsfehler: API-Schlüssel fehlt."
        });
      }

      // 3. Send payload to Cleva Endpoint
      const clevaEndpoint = "https://tljnviuangepiueitric.supabase.co/functions/v1/lead-import";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsam52aXVhbmdlcGl1ZWl0cmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1Mzc0MDQsImV4cCI6MjA3MjExMzQwNH0.Llo0_TLLlqoJfRA6DMWiRM5lx4m6-zISdh1hkloGidg";
      
      console.log(`Forwarding lead to Cleva endpoint...`);

      const response = await fetch(clevaEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseAnonKey,
          "x-api-key": apiKey
        },
        body: JSON.stringify({ data: payload })
      });

      if (!response.ok) {
        const errorMsg = `API-Fehler: ${response.status}`;
        try {
          const errBody = await response.text();
          console.error(`Cleva API Error response: ${errBody}`);
        } catch (_) {}
        throw new Error(errorMsg);
      }

      // Safe JSON or text parsing from Cleva
      const responseText = await response.text();
      let responseData = {};
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.warn("Could not parse response from Cleva as JSON:", responseText);
          responseData = { text: responseText };
        }
      }

      console.log("Lead successfully forwarded to Cleva API!");
      return res.status(200).json({
        success: true,
        data: responseData
      });

    } catch (error: any) {
      console.error("Error during lead forwarding:", error.message || error);
      return res.status(500).json({
        error: "Die Anmeldung konnte leider nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns direkt."
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
