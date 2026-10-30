
export async function onRequestPost({ request, env }) {
  try {
    const { name, email, message } = await request.json();

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      message.trim().length < 5 ||
      name.length > 100 ||
      email.length > 254 ||
      message.length > 5000
    ) {
      return Response.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <hello@yourdomain.com>",
          to: ["YOUR_EMAIL@example.com"],
          reply_to: email.trim(),
          subject: `Portfolio message from ${name.trim()}`,
          text: message.trim(),
        }),
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Email delivery failed" },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
