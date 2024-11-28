import 'dotenv/config'

const tenant = process.env.TENANT || 'syracuse';

const tenantBaseURLs: { [key: string]: string } = {
  'libertyuni': 'https://libertyflames.com/',
  'syracuse': 'https://cuse.com/'
};

let baseURL: string;

try {
  if (!tenantBaseURLs[tenant]) {
    throw new Error("Enter a valid tenant value.");
  }
  baseURL = tenantBaseURLs[tenant];
} catch (error) {
  console.error(error.message);
  baseURL = '';
}

export default {
  baseURL,
};