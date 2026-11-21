import {
  supabase,
  response,
  corsHeaders,
  getParent,
  handleError,
} from "../_shared/index.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const parent = await getParent(req);

    const { data: children, error: childrenError } = await supabase
      .from("children")
      .select("id, parent_id, display_name, is_active, created_at")
      .eq("parent_id", parent.id)
      .order("created_at", { ascending: true });

    if (childrenError) throw childrenError;

    const childIds = (children ?? []).map((child) => child.id);
    let attempts: unknown[] = [];

    if (childIds.length) {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          id, child_id, quiz_id, status, score, started_at,
          completed_at, updated_at,
          quizzes (
            id, title,
            themes (id, name)
          )
        `)
        .in("child_id", childIds)
        .order("started_at", { ascending: false });

      if (error) throw error;
      attempts = data ?? [];
    }

    return response({
      parent: {
        id: parent.id,
        cin: parent.cin,
        full_name: parent.full_name,
      },
      children: children ?? [],
      attempts,
    });
  } catch (error) {
    return handleError(error);
  }
});
