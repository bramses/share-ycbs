import { uploadToCloudflare } from './uploadToCloudflare';

// recursively find any fields that look like b64 images and replace them
export async function replaceImages(obj) {
  if (Array.isArray(obj)) {
    const arr = [];
    for (const item of obj) {
      arr.push(await replaceImages(item));
    }
    return arr;
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].startsWith('data:image')) {
        newObj[key] = await uploadToCloudflare(obj[key]);
      } else {
        newObj[key] = await replaceImages(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}
