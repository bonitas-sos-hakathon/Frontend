
import {
  supabase,
  response,
  corsHeaders,
  verifySecret,
} from "../_shared/index.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cin, pin, child_id } = await req.json();

    if (!cin || !pin || !child_id) {
      return response({ error: "Informations manquantes." }, 400);
    }

    const { data: parent } = await supabase
      .from("parents")
      .select("id")
      .eq("cin", cin)
      .maybeSingle();

    if (!parent) {
      return response({ error: "Identifiants incorrects." }, 401);
    }

    const { data: child } = await supabase
      .from("children")
      .select("id, parent_id, display_name, pin_hash")
      .eq("id", child_id)
      .eq("parent_id", parent.id)
      .eq("is_active", true)
      .single();

    if (!child || !(await verifySecret(pin, child.pin_hash))) {
      return response({ error: "Identifiants incorrects." }, 401);
    }

    const rawToken = crypto.randomUUID() + crypto.randomUUID();

    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(rawToken)
    );

    const tokenHash = Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error } = await supabase
      .from("child_sessions")
      .insert({
        child_id: child.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (error) throw error;

    return response({
      message: "Connexion réussie.",
      child: {
        id: child.id,
        display_name: child.display_name,
      },
      token: rawToken,
      expires_at: expiresAt,
    });

  } catch {
    return response({ error: "Erreur de connexion." }, 500);
  }
});
