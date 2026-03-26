import axios from "axios";

function generateUUID(): string {
  const cryptoObj = typeof window !== "undefined" ? window.crypto : undefined;

  // Best: native randomUUID
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  // Next: getRandomValues-based RFC 4122 v4
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);
    // RFC 4122 variant/version bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
    const bth = (b: number) => b.toString(16).padStart(2, "0");
    return (
      bth(bytes[0]) + bth(bytes[1]) + bth(bytes[2]) + bth(bytes[3]) + "-" +
      bth(bytes[4]) + bth(bytes[5]) + "-" +
      bth(bytes[6]) + bth(bytes[7]) + "-" +
      bth(bytes[8]) + bth(bytes[9]) + "-" +
      bth(bytes[10]) + bth(bytes[11]) + bth(bytes[12]) + bth(bytes[13]) + bth(bytes[14]) + bth(bytes[15])
    );
  }

  // Fallback: Math.random-based v4 (not cryptographically strong)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getSessionId(): string {
  const SESSION_KEY = "detalheprata:cart-session-id";
  
  if (typeof window === "undefined") {
    return "";
  }

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

// Em produção, use variáveis de ambiente: process.env.NEXT_PUBLIC_API_URL
export const api = axios.create({
  //baseURL: "http://localhost:8080/api",
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
});

export const s3 = axios.create({
  //baseURL: "http://localhost:8080/api",
  baseURL: process.env.AWS_S3 || "http://elasticbeanstalk-sa-east-1-988905386054.s3.amazonaws.com",
});

api.interceptors.request.use((config) => {
  // Garante que estamos pegando o token correto usado no Login
  const token = localStorage.getItem("authToken"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const sessionId = getSessionId();
  if (sessionId) {
    config.headers['X-Session-Id'] = sessionId;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});