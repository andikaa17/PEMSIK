import admin from "firebase-admin";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🔄 Initializing Firebase Admin...");


const serviceAccount = {
  type: "service_account",
  project_id: "pemsik-4617-backend",
  private_key_id: "1c81bb4ed0cb919269687c8ff359acb00758f15b",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWzzsRJEsz8REQ\nUZ1M24Uk8CUlHuxpwIQwEDL7u7BD/ft1FE1HGvTyRexvkoUXaE9Q8oelGZ+5DjKE\nrjFTEuWirwZ3J7JqXibLDz3fbttPMgDGOfNgvd/4CM26R0M4A4xp5CgNwhL/4jkz\nsfvrKxb1wBq0xn1DnDUMtxMtXHWtoEPVJW0QtmIVzsMikJ9NOknxU6f3gd3jvtzg\nV9mABudF22ovyDS6AdETM7/DTPL2+ae+tBOGczEausrRyxH2XBN9/LkSXyYKkhhg\nd7M4EcE2VxXj89hXDfOixBV2m3XHZHkKEWdQiCVbbjh03VkUX5mo0w0qGnE01PKx\niV7MGS6VAgMBAAECggEAD9bjC54J/5AAipwCBddQB4u/qW+QzjF4bdTb9Yz+79yM\nDLONCTe3JSA70XRT5Qh3hMgFcYqkqPAfkIIJuA72KNtQFjwynz5HDQUYMmAJwtq0\njOlcBV+q4q6/gMNddQVp9qrwuyb64KxtPF8c7NfWDxP1xCu4s+ISVVgwjVE6ii1a\n/fFQHiXwh+HPFgWnhWHfcpz9OvHhoUu1vCgN6V1P3YB3qrtSYGAmoJgzxE9Z0t8q\nIi0jHRnx7sLXgnod/8dTxCKmYsyrSMN+yCrk5xYKCStRRWmK93pvceUrH+Nio83F\neFoqQk6pGa4uW1Lc6mWHLHdw9eUEdxs6WPg3QbODBwKBgQD48GTnRqIcQ8dJ5IN/\nU3RA+q6WG7z+HzhciurCfqGMBLqEWBHg6MD/Mq3u6dk2njTIMnU6BuHAOMn7u/10\n20VcMOoYXUCtwN79eA9UcabKXf3njJMytcpTzm1t0k0byTuy8ZoBfNCE50iNjbd8\nHd5VwAfElYFLZgN+XpAY1xAJgwKBgQDc5wOIR/80sUyiOivf2RE91TicybmqfgZN\nD7I32qIUaSIbeApkd6vvNkVutpaqWZ4EG9hvKmG8R/SOR8Bl1RDBBh4fREDs6kcI\nzvGtQhBRcnxixihJ0uFOtS7zBZEmrUWND9MJu2f7+dBSzkqJEFVEHx0NwsRNjw2O\ne65vQVukBwKBgGuC5xE7YCf03cz79A65bCvkGCKcODNIKH9PP7RgHETsheFCZ/ZK\nj4+nw5a7SCRej00m/Znh/v2ViSY/OmeNi5cVSQTcwWJJOgUeJQDDVNVxYobuH2R3\nPrqTHI+hk8u8TRwrW+foj+XWPW9lFSl1fOBr3u734q89j6S0Emen+jUhAoGATE0r\nRi6AM0YujzaCox5KO05j8JwpGn/PU1zhlTNamqw50L0k8dD4PXdEglplLlAoKYko\nuDUubyd3jJGyHjp7QAEJ9IjR2EOP57X7enoAQvHFjySdE+rYUiR5JA4/NdnR1Uiq\n/4iRAVMnpwKEclWG7jHFClTFE3kfGKEV/m3X5o8CgYEAxk3OPKQuYpmZJrC7iV3w\n27P76rmSCM0fNL7zkDsuwz8n4CJV28MKgnexyEz+iFw/44bpw0vx9O1D0+IknEkI\nrjVgZMYk/fa1FE0U3zfJvT9znoprMqhljNiRkhULcowzl9u62ZwbB/r1nuA4h5ae\nlcZ7kHIq78vvuSQw9cIBCwQ=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@pemsik-4617-backend.iam.gserviceaccount.com",
  client_id: "102886030686941608743",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40pemsik-4617-backend.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

try {
  // Cek apakah admin sudah diinisialisasi
  if (!admin.apps || admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized!");
  } else {
    console.log("ℹ️ Firebase Admin already initialized.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin:", error.message);
  process.exit(1);
}

const db = admin.firestore();

// Baca data
console.log("📖 Reading db.json...");
const data = JSON.parse(fs.readFileSync("db.json", "utf8"));
console.log(`✅ Found ${Object.keys(data).length} collections`);

async function importData() {
  const collections = ["dosen", "mahasiswa", "matakuliah", "kelas", "user"];

  for (const col of collections) {
    console.log(`\n📥 Importing ${col}...`);
    const items = data[col] || [];
    console.log(`   Found ${items.length} items`);

    let successCount = 0;
    for (const item of items) {
      try {
        const docRef = db.collection(col).doc();
        await docRef.set(item);
        successCount++;
        process.stdout.write(`\r   ✅ ${successCount}/${items.length} done`);
      } catch (error) {
        console.log(`\n   ❌ Error: ${error.message}`);
      }
    }
    console.log(`\n   ✅ ${col} complete!`);
  }
  console.log("\n🎉 ALL DATA IMPORTED SUCCESSFULLY!");
}

importData().catch(console.error);
