export default function middleware(request) {
  if (process.env.VERCEL_ENV !== 'production') {
    return;
  }

  const auth = request.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (pass === process.env.SITE_PASSWORD) {
        return;
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Wedding Site"',
    },
  });
}
