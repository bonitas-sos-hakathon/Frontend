
import {
  supabase,
  response,
  corsHeaders,
  getParent,
  hashSecret,
  handleError,
} from "../_shared/index.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const parent = await getParent(req);
    const { display_name, pin } = await req.json();

    if (!display_name || !/^\d{4,6}$/.test(pin ?? "")) {
      return response({
        error: "Nom et PIN de 4 à 6 chiffres obligatoires."
      }, 400);
    }

    const pin_hash = await hashSecret(pin);

    const { data, error } = await supabase
      .from("children")
      .insert({
        parent_id: parent.id,
        display_name,
        pin_hash,
        is_active: true,
      })
      .select("id, display_name, is_active, created_at")
      .single();

    if (error) throw error;

    return response({ child: data }, 201);

  } catch (error) {
    return handleError(error);
  }
});
