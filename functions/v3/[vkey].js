export async function onRequestGet({ request }) {
  const { url, method, headers, body } = request
  const newUrl = new URL(url)
  return fetch(`https://i${Math.floor(Math.random() * 4)}.wp.com/${newUrl.hostname}${newUrl.pathname.replace('v3', 'vh-img-proxy')}${newUrl.search}`, {
    method,
    headers,
    body
  })
}
