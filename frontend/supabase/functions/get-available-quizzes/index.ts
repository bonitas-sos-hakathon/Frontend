import {
  supabase,
  response,
  corsHeaders,
  getChild,
  handleError,
} from "../_shared/index.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    await getChild(req);

    const { data: themes, error: themesError } = await supabase
      .from("themes")
      .select("id, name, description, image_url")
      .eq("is_active", true)
      .order("created_at");

    if (themesError) throw themesError;

    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select("id, theme_id, title, description")
      .eq("is_active", true)
      .order("created_at");

    if (quizzesError) throw quizzesError;

    const result = (themes ?? []).map((theme) => ({
      ...theme,
      quizzes: (quizzes ?? []).filter((quiz) => quiz.theme_id === theme.id),
    }));

    return response({ themes: result });
  } catch (error) {
    return handleError(error);
  }
});
