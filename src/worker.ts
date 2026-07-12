interface Env {
  CLEVA_API_KEY: string;
  CLEVA_API_URL: string;
  CLEVA_SUPABASE_ANON_KEY: string;
  ASSETS: {
    fetch: typeof fetch;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (url.pathname === "/api/config-check" && request.method === "GET") {
      const apiKey =
        typeof env.CLEVA_API_KEY === "string"
          ? env.CLEVA_API_KEY.trim()
          : "";

      const apiUrl =
        typeof env.CLEVA_API_URL === "string"
          ? env.CLEVA_API_URL.trim()
          : "";

      const supabaseAnonKey =
        typeof env.CLEVA_SUPABASE_ANON_KEY === "string"
          ? env.CLEVA_SUPABASE_ANON_KEY.trim()
          : "";

      return Response.json({
        workerVersion: "runtime-config-diagnostic-v1",
        apiKeyPresent: apiKey.length > 0,
        apiUrlPresent: apiUrl.length > 0,
        supabaseAnonKeyPresent: supabaseAnonKey.length > 0,
        apiUrlValid:
          apiUrl.startsWith("https://") &&
          apiUrl.includes("/functions/v1/lead-import"),
        apiUrlLength: apiUrl.length,
      }, {
        headers: corsHeaders
      });
    }

    // 2. Routing for lead import API
    if (url.pathname === "/api/lead-import") {
      console.log("Worker-Route erreicht: POST /api/lead-import");

      // 405 Method Not Allowed if not POST
      if (request.method !== "POST") {
        return Response.json(
          { error: `Method ${request.method} Not Allowed` },
          {
            status: 405,
            headers: {
              ...corsHeaders,
              "Allow": "POST",
            },
          }
        );
      }

      try {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch (e) {
          return Response.json(
            { error: "Ungültiges JSON-Format im Payload." },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        if (typeof payload !== "object" || payload === null) {
          return Response.json(
            { error: "Ungültiges JSON-Format im Payload." },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        const payloadObj = payload as Record<string, unknown>;

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
          field => payloadObj[field] === undefined || payloadObj[field] === null || payloadObj[field] === ""
        );

        if (missingFields.length > 0) {
          console.warn(`Validation failed in Worker: missing fields [${missingFields.join(", ")}]`);
          return Response.json(
            {
              error: `Bitte fülle alle Pflichtfelder aus. Fehlende Felder: ${missingFields.join(", ")}`
            },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        // Ensure datenschutz_akzeptiert is true
        if (payloadObj.datenschutz_akzeptiert !== true) {
          return Response.json(
            {
              error: "Die Datenschutzerklärung muss zwingend akzeptiert werden."
            },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        console.log("Payload validiert");

        // Retrieve config from env
        const apiKey =
          typeof env.CLEVA_API_KEY === "string"
            ? env.CLEVA_API_KEY.trim()
            : "";

        const apiUrl =
          typeof env.CLEVA_API_URL === "string"
            ? env.CLEVA_API_URL.trim()
            : "";

        const supabaseAnonKey =
          typeof env.CLEVA_SUPABASE_ANON_KEY === "string"
            ? env.CLEVA_SUPABASE_ANON_KEY.trim()
            : "";

        const runtimeConfig = {
          apiKeyPresent: apiKey.length > 0,
          apiUrlPresent: apiUrl.length > 0,
          supabaseAnonKeyPresent: supabaseAnonKey.length > 0,
          apiUrlValid:
            apiUrl.startsWith("https://") &&
            apiUrl.includes("/functions/v1/lead-import"),
        };

        console.log("Cleva Runtime Configuration Check", runtimeConfig);

        if (
          !runtimeConfig.apiKeyPresent ||
          !runtimeConfig.apiUrlPresent ||
          !runtimeConfig.supabaseAnonKeyPresent ||
          !runtimeConfig.apiUrlValid
        ) {
          return Response.json(
            {
              error: "Server-Konfigurationsfehler.",
              runtimeConfig,
            },
            {
              status: 500,
              headers: corsHeaders,
            }
          );
        }

        const clevaPayload = { data: payloadObj };

        console.log("Cleva-Request gestartet");

        const crmResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseAnonKey,
            "x-api-key": apiKey
          },
          body: JSON.stringify(clevaPayload)
        });

        console.log("Cleva-Status erhalten:", crmResponse.status);

        const responseText = await crmResponse.text();

        if (!crmResponse.ok) {
          console.error("Cleva CRM Error status received:", crmResponse.status);
          console.error("Cleva CRM Error category:", crmResponse.status >= 500 ? "Server Error" : "Client Error");
          console.error("Cleva CRM Error response length:", responseText ? responseText.length : 0);

          return Response.json(
            {
              error: "Die Anmeldung konnte leider nicht übermittelt werden (CRM API Fehler)."
            },
            {
              status: 502,
              headers: corsHeaders,
            }
          );
        }

        // Safe parsing of response text/JSON from CRM
        let responseData: unknown = {};
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
          } catch (e) {
            console.warn("Could not parse response from Cleva as JSON inside Worker, response length:", responseText.length);
            responseData = { text: "Non-JSON Response" };
          }
        }

        console.log("Lead successfully forwarded to Cleva API from Worker!");
        return Response.json(
          {
            success: true,
            data: responseData
          },
          {
            status: 200,
            headers: corsHeaders,
          }
        );

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Internal Error during lead forwarding in Worker:", errorMessage);
        return Response.json(
          {
            error: "Die Anmeldung konnte leider nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns direkt."
          },
          {
            status: 500,
            headers: corsHeaders,
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
