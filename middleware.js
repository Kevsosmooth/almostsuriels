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
  <title>Almost Suriels</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #faf5f0;
    }

    .gate {
      text-align: center;
      max-width: 400px;
      width: 90%;
      padding: 3rem 2rem;
    }

    .gate h1 {
      font-size: 2rem;
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .gate p {
      font-size: 0.9rem;
      color: #999;
      margin-bottom: 2.5rem;
      font-style: italic;
    }

    .gate form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .gate input[type="password"] {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      font-family: inherit;
      background: transparent;
      border: 1px solid #444;
      color: #faf5f0;
      text-align: center;
      letter-spacing: 0.1em;
      outline: none;
      transition: border-color 0.2s;
    }

    .gate input[type="password"]:focus-visible {
      border-color: #c41e3a;
    }

    .gate input[type="password"]::placeholder {
      color: #666;
      letter-spacing: 0.05em;
    }

    .gate button {
      padding: 0.75rem 2.5rem;
      font-size: 0.85rem;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      background: transparent;
      border: 1px solid #faf5f0;
      color: #faf5f0;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      min-height: 44px;
      min-width: 44px;
    }

    .gate button:hover {
      background: #faf5f0;
      color: #1a1a1a;
    }

    .gate button:focus-visible {
      outline: 2px solid #c41e3a;
      outline-offset: 2px;
    }

    .error {
      color: #c41e3a;
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <div class="gate">
    <h1>Almost Suriels</h1>
    <p>Opening soon</p>
    <form method="POST" action="/__check-password">
      <input type="text" name="password" placeholder="Enter password" required autofocus autocomplete="off">
      ${error ? '<span class="error">Incorrect password</span>' : ''}
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}
