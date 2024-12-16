// uploads b64 images to cf images and returns the url
// expects: dataurl (like "data:image/png;base64,xxx") or raw base64 string
export async function uploadToCloudflare(b64) {
    const imgData = b64.replace(/^data:image\/\w+;base64,/, '');
    const formData = new FormData();
    const blob = Buffer.from(imgData, 'base64');
    formData.append('file', new Blob([blob]), 'image.jpg');
  
    const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_IMAGES_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CF_IMAGES_API_KEY}`
      },
      body: formData
    });
    const json = await resp.json();
    return json?.result?.variants?.[0] || '';
  }
  