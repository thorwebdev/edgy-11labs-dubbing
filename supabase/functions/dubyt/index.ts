// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { ElevenLabsClient } from "npm:elevenlabs";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const client = new ElevenLabsClient({
    apiKey: Deno.env.get("ELEVENLABS_API_KEY")!,
  });
  // const res = await client.dubbing.dubAVideoOrAnAudioFile({
  //   source_url: "https://x.com/thorwebdev/status/1820477612109582372",
  //   target_lang: "de",
  //   source_lang: "en",
  //   num_speakers: 1,
  //   watermark: true,
  // });

  // console.log(JSON.stringify(res, null, 2));

  const file = await client.dubbing.getDubbedFile("vj23FF73HryXztzxwB9u", "de");

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of file) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "video/mp4",
    },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dubyt' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
