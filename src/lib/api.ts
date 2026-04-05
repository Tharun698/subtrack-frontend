// 🔁 IMPORTANT: Replace this with YOUR Render backend URL
const BASE_URL = "https://subtrack-frontend-2h95.onrender.com"; 

// ---------- TYPES ----------
export type AuthResponse = {
  token: string;
  user: {
    name: string;
    email: string;
  };
};

export type Subscription = {
  _id: string;
  appName: string;
  cost: number;
  category: string;
  renewalDate: string;
};

// ---------- ERROR CLASS ----------
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// ---------- COMMON REQUEST FUNCTION ----------
async function request(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(data.message || "Something went wrong", res.status);
    }

    return data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw new ApiError(error.message || "Network error", 500);
  }
}

// ---------- AUTH ----------
export async function signupUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ---------- SUBSCRIPTIONS ----------
export async function fetchSubscriptions(
  token: string
): Promise<Subscription[]> {
  return request("/api/subscriptions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createSubscription(
  token: string,
  data: Partial<Subscription>
): Promise<Subscription> {
  return request("/api/subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteSubscription(
  token: string,
  id: string
) {
  return request(`/api/subscriptions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}