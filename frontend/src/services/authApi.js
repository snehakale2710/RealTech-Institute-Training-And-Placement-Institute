// If VITE_API_URL is not set, the app runs in MOCK mode (no backend needed)
// so you can test the screens. Set it in frontend/.env, e.g.:
//   VITE_API_URL=http://localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_URL;
export const IS_MOCK = !BASE_URL;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function post(path, body) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

// Step 1: ask the server to email a reset link
export async function requestPasswordReset(email) {
  if (IS_MOCK) {
    await wait(800);
    return { ok: true };
  }
  return post("/auth/forgot-password", { email });
}

// Step 2: check that the link's token is still valid
export async function verifyResetToken(token) {
  if (IS_MOCK) {
    await wait(500);
    return token !== "expired"; // open /reset-password/expired to test the error screen
  }
  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password/${encodeURIComponent(token)}`);
    return res.ok;
  } catch {
    return false;
  }
}

// Step 3: save the new password
export async function resetPassword(token, password) {
  if (IS_MOCK) {
    await wait(800);
    return { ok: true };
  }
  return post("/auth/reset-password", { token, password });
}