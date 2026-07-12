const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Routing for lead import API
    if (url.pathname === "/api/lead-import") {
      // 405 Method Not Allowed if not POST
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: `Method ${request.method} Not Allowed` }),
          {
            status: 405,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Allow": "POST",
            },
          }
        );
      }

      try {
        let payload: any;
        try {
          payload = await request.json();
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "Ungültiges JSON-Format im Payload." }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Log receipt of lead without exposing personal details (PII)
        console.log("Lead received for proxying in Worker:", {
          formularname: payload?.formularname,
          quelle: payload?.quelle,
          beratungsart: payload?.beratungsart,
          anrede: payload?.anrede,
          wohnort_kanton: payload?.wohnort_kanton,
        });

        // Server-side validation of mandatory fields
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
          console.warn(`Validation failed in Worker: missing fields [${missingFields.join(", ")}]`);
          return new Response(
            JSON.stringify({
              error: `Bitte fülle alle Pflichtfelder aus. Fehlende Felder: ${missingFields.join(", ")}`
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Ensure datenschutz_akzeptiert is true
        if (payload.datenschutz_akzeptiert !== true) {
          return new Response(
            JSON.stringify({
              error: "Die Datenschutzerklärung muss zwingend akzeptiert werden."
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Retrieve API Key from env
        const apiKey = env.CLEVA_API_KEY;
        if (!apiKey) {
          console.error("CLEVA_API_KEY is not defined in Cloudflare environment variables!");
          return new Response(
            JSON.stringify({
              error: "Server-Konfigurationsfehler: API-Schlüssel fehlt."
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Send payload to Cleva Endpoint
        const clevaEndpoint = "https://tljnviuangepiueitric.supabase.co/functions/v1/lead-import";
        const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsam52aXVhbmdlcGl1ZWl0cmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1Mzc0MDQsImV4cCI6MjA3MjExMzQwNH0.Llo0_TLLlqoJfRA6DMWiRM5lx4m6-zISdh1hkloGidg";

        console.log("Worker forwarding lead to Cleva endpoint...");

        const crmResponse = await fetch(clevaEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseAnonKey,
            "x-api-key": apiKey
          },
          body: JSON.stringify({ data: payload })
        });

        if (!crmResponse.ok) {
          const errorMsg = `CRM-API-Fehler: ${crmResponse.status}`;
          try {
            const errBody = await crmResponse.text();
            console.error(`Cleva API Error response inside Worker: ${errBody}`);
          } catch (_) {}
          
          return new Response(
            JSON.stringify({
              error: "Die Anmeldung konnte leider nicht übermittelt werden (CRM API Fehler)."
            }),
            {
              status: 502, // Bad Gateway when downstream API rejects request
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Safe parsing of response text/JSON from CRM
        const responseText = await crmResponse.text();
        let responseData = {};
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
          } catch (e) {
            console.warn("Could not parse response from Cleva as JSON inside Worker:", responseText);
            responseData = { text: responseText };
          }
        }

        console.log("Lead successfully forwarded to Cleva API from Worker!");
        return new Response(
          JSON.stringify({
            success: true,
            data: responseData
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );

      } catch (error: any) {
        console.error("Internal Error during lead forwarding in Worker:", error.message || error);
        return new Response(
          JSON.stringify({
            error: "Die Anmeldung konnte leider nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns direkt."
          }),
          {
            status: 500, // Internal Server Error
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 3. Static asset serving with fallback to index.html for SPA routes
    try {
      // For Cloudflare Workers with Assets, the global/binding env.ASSETS manages files
      if (env.ASSETS) {
        let response = await env.ASSETS.fetch(request);
        
        // If asset is not found (404), check if we should fall back to index.html (SPA fallback)
        if (response.status === 404 && request.method === "GET") {
          const acceptHeader = request.headers.get("Accept") || "";
          // Only fall back to index.html if the request looks like a page request (e.g. no extension, or explicitly accepts HTML)
          if (!url.pathname.includes(".") || acceptHeader.includes("text/html")) {
            const fallbackRequest = new Request(new URL("/index.html", request.url), request);
            response = await env.ASSETS.fetch(fallbackRequest);
          }
        }
        return response;
      }
      
      return new Response("Not Found", { status: 404 });
    } catch (e: any) {
      return new Response("An error occurred serving assets: " + e.message, { status: 500 });
    }
  }
};
