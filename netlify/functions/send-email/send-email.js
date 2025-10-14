// send-email.js
const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  // Парсинг тіла
  let formData;
  try {
    formData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Invalid JSON body', error: err.message }),
    };
  }

  // Простенька валідація
  if (!formData || !formData.service || !formData.name || !formData.email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Missing required fields: service, name, email' }),
    };
  }

  // Перевірка env
  const { GMAIL_USER, GMAIL_PASS } = process.env;
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.error('Missing email credentials in environment');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Email credentials not configured' }),
    };
  }

  // Таймзона (можна задати через EMAIL_TIMEZONE)
  const tz = 'America/Los_Angeles';

  // Якщо клієнт передав timestamp у UTC (наприклад: formData.timestampUTC) — використаємо його,
  // інакше беремо поточний час сервера.
  const baseDate = formData.timestampUTC ? new Date(formData.timestampUTC) : new Date();

  const submissionDate = baseDate.toLocaleString('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Підготовка транспорту
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS, // зазвичай app password
    },
  });

  // Підготовка вмісту листа
  const mailHtml = `
    <h2>New Service Request</h2>
    <p><strong>Service Type:</strong> ${escapeHtml(formData.service)}</p>
    <p><strong>Name:</strong> ${escapeHtml(formData.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(formData.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(formData.phone || '—')}</p>
    <p><strong>Location / Address:</strong> ${escapeHtml(formData.location || '—')}</p>
    <p><strong>Appliance:</strong> ${escapeHtml(formData.appliance || '—')}</p>
    <p><strong>Brand:</strong> ${escapeHtml(formData.brand || '—')}</p>
    <p><strong>Power Type:</strong> ${escapeHtml(formData.power || '—')}</p>
    <p><strong>Additional Details:</strong> ${escapeHtml(formData.details || 'None')}</p>
    <hr />
    <p><strong>Submission Date:</strong> ${submissionDate}</p>
  `;

  const mailText = `
New Service Request
Service Type: ${formData.service}
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || '—'}
Location: ${formData.location || '—'}
Appliance: ${formData.appliance || '—'}
Brand: ${formData.brand || '—'}
Power Type: ${formData.power || '—'}
Additional Details: ${formData.details || 'None'}

Submission Date: ${submissionDate} (${tz})
Timestamp used (UTC): ${baseDate.toISOString()}
  `;

  const mailOptions = {
    from: GMAIL_USER,
    to: 'Airtexnola@gmail.com', // змінити при потребі
    subject: `New Service Request: ${formData.service} for ${formData.appliance || '—'}`,
    text: mailText,
    html: mailHtml,
    replyTo: formData.email, // щоб можна було відповісти клієнту напряму
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Email sent successfully', messageId: info.messageId }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error sending email',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    };
  }
};

// Невелика утиліта для уникнення XSS при вставці в HTML
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
