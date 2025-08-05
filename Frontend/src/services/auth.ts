const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ✅ Signup User and store token + info
export const signupUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ token: string}> => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Signup failed");
  }

  // ✅ Store token and user info in localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("name", data.name);
  localStorage.setItem("email", email);
  return {
    token: data.token
    
  }; // Return data for further use if needed
};

// ✅ Login User and store token + info
export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  // ✅ Store token and user info in localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("name", data.name);
  localStorage.setItem("email", email);
  return {
    token: data.token
  }; // Return data for further use if needed
};
