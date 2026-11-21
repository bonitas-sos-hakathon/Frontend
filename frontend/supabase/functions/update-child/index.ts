
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
    const { child_id, display_name, pin } = await req.json();

    if (!child_id) {
      return response({ error: "child_id obligatoire." }, 400);
    }

    const updates: Record<string, unknown> = {};

    if (display_name !== undefined) {
      if (!display_name.trim()) {
        return response({ error: "Nom invalide." }, 400);
      }
      updates.display_name = display_name.trim();
    }

    if (pin !== undefined) {
      if (!/^\d{4,6}$/.test(pin)) {
        return response({ error: "PIN invalide." }, 400);
      }
      updates.pin_hash = await hashSecret(pin);
    }

    if (Object.keys(updates).length === 0) {
      return response({ error: "Aucune modification." }, 400);
    }

    const { data, error } = await supabase
      .from("children")
      .update(updates)
      .eq("id", child_id)
      .eq("parent_id", parent.id)
      .select("id, display_name, is_active")
      .single();

    if (error || !data) {
      return response({ error: "Enfant introuvable." }, 404);
    }

    return response({ child: data });

  } catch (error) {
    return handleError(error);
  }
});
