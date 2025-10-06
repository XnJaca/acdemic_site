import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validación básica
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar correo
    const data = await resend.emails.send({
      from: 'ACDEMIC <onboarding@resend.dev>', // Cambiarás esto cuando tengas tu dominio verificado
      to: 'xnjaca@gmail.com', // Tu correo donde recibirás los mensajes
      subject: subject || `Nuevo mensaje de ${name}`,
      html: `
        <h2>Nuevo mensaje desde ACDEMIC</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error enviando correo:', error);
    return new Response(
      JSON.stringify({ error: 'Error al enviar el correo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
