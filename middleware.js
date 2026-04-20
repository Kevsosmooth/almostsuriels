export default async function middleware(request) {
  if (process.env.VERCEL_ENV !== 'production') {
    return;
  }

  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return;
  }

  const url = new URL(request.url);

  if (url.pathname === '/__check-password' && request.method === 'POST') {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const attempt = params.get('password');

    if (attempt === password) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': `site_access=${btoa(password)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
        },
      });
    }

    return new Response(passwordPage(true), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/site_access=([^;]+)/);
  if (match) {
    try {
      if (atob(match[1]) === password) {
        return;
      }
    } catch {}
  }

  return new Response(passwordPage(false), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function passwordPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arielle & Kevin | Coming Soon</title>
  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FFF8F0;
      font-family: 'DM Sans', sans-serif;
      color: #2C2C2C;
    }

    .gate {
      text-align: center;
      max-width: 460px;
      width: 90%;
      padding: 3.5rem 2.5rem;
      background: #FFFFFF;
      border: 1px solid rgba(44, 44, 44, 0.08);
      box-shadow: 0 4px 24px rgba(44, 44, 44, 0.06);
    }

    .gate__names {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      font-weight: 400;
      font-style: italic;
      color: #9B1B30;
      line-height: 1.2;
      margin-bottom: 0.25rem;
    }

    .gate__amp {
      font-size: 1.8rem;
      color: #E8D5D0;
      display: inline-block;
      margin: 0 0.15em;
    }

    .gate__date {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #6B6B6B;
      margin-bottom: 0.75rem;
    }

    .gate__divider {
      width: 48px;
      height: 1px;
      background: #E8D5D0;
      margin: 0 auto 1.75rem;
    }

    .gate__subtitle {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 300;
      color: #9A9A9A;
      margin-bottom: 2rem;
    }

    .gate form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .gate input[type="text"] {
      width: 100%;
      padding: 0.9rem 1.25rem;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      background: #FFF8F0;
      border: 1px solid rgba(44, 44, 44, 0.08);
      color: #2C2C2C;
      text-align: center;
      letter-spacing: 0.05em;
      outline: none;
      transition: border-color 0.2s;
    }

    .gate input[type="text"]:focus-visible {
      border-color: #9B1B30;
    }

    .gate input[type="text"]::placeholder {
      color: #9A9A9A;
      font-weight: 300;
    }

    .gate button {
      width: 100%;
      padding: 0.9rem 2.5rem;
      font-size: 0.8rem;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      background: #9B1B30;
      border: none;
      color: #FFF8F0;
      cursor: pointer;
      transition: background 0.2s;
      min-height: 44px;
      min-width: 44px;
    }

    .gate button:hover {
      background: #7A1526;
    }

    .gate button:focus-visible {
      outline: 2px solid #9B1B30;
      outline-offset: 2px;
    }

    .error {
      color: #B91C1C;
      font-size: 0.85rem;
      font-weight: 400;
    }
  </style>
</head>
<body>
  <div class="gate">
    <div class="gate__names">Arielle <span class="gate__amp">&</span> Kevin</div>
    <div class="gate__date">October 4, 2026</div>
    <div class="gate__divider"></div>
    <p class="gate__subtitle">Our wedding site is coming soon. Enter the password to preview.</p>
    <form method="POST" action="/__check-password">
      <input type="text" name="password" placeholder="Enter password" required autofocus autocomplete="off">
      ${error ? '<span class="error">Incorrect password</span>' : ''}
      <button type="submit">Enter Site</button>
    </form>
  </div>
</body>
</html>`;
}
