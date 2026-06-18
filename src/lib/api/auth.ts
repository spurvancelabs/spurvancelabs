// lib/api/auth.ts

// ======================
// SIGNUP
// ======================
export const signupUser = async (form: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data; // important for React Query error handling
  }

  return data;
};

// ======================
// LOGIN (future use)
// ======================
export const loginUser = async (form: {
  email: string;
  password: string;
}) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

// ======================
// GOOGLE AUTH
// ======================
export const googleLogin = () => {
  window.location.href = '/api/auth/google';
};

// ======================
// GET CURRENT USER (optional later)
// ======================
export const getCurrentUser = async () => {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

// ======================
// LOGOUT (future use)
// ======================
export const logoutUser = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};


export const forgotPassword = async ({
  email,
}: {
  email: string;
}) => {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};


export const verifyOTP = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      otp,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      ...data,
      status: res.status,
    };
  }

  return data;
};