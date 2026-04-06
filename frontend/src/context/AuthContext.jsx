import { createContext, useReducer, useEffect, useCallback } from "react";
import api from "../utils/api";

// ─── State shape ────────────────────────────────────────────────────────────
const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  authChecked: false,
};

// ─── Reducer ────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    // ── sign-in ──────────────────────────────────────────────────────────
    case "SIGN_IN_START":
      return { ...state, loading: true, error: null };
    case "SIGN_IN_SUCCESS":
      return {
        ...state,
        currentUser: action.payload,
        loading: false,
        error: null,
        authChecked: true,
      };
    case "SIGN_IN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        authChecked: true,
      };

    // ── update ────────────────────────────────────────────────────────────
    case "UPDATE_USER_START":
      return { ...state, loading: true, error: null };
    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        currentUser: action.payload,
        loading: false,
        error: null,
      };
    case "UPDATE_USER_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // ── delete ────────────────────────────────────────────────────────────
    case "DELETE_USER_START":
      return { ...state, loading: true, error: null };
    case "DELETE_USER_SUCCESS":
      return { ...state, currentUser: null, loading: false, error: null };
    case "DELETE_USER_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // ── sign-out ──────────────────────────────────────────────────────────
    case "SIGN_OUT_START":
      return { ...state, loading: true, error: null };
    case "SIGN_OUT_SUCCESS":
      return { ...state, currentUser: null, loading: false, error: null };
    case "SIGN_OUT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // ── background auth verification (does NOT block UI) ─────────────────
    case "VERIFY_SUCCESS":
      return { ...state, currentUser: action.payload, authChecked: true };
    case "VERIFY_FAILURE":
      return { ...state, currentUser: null, authChecked: true };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Run once on mount: verify cookie in background ──────────────────────
  useEffect(() => {
  let cancelled = false;

  const verify = async () => {
    try {
      const res = await api.get("/api/auth/verify");
      if (!cancelled) dispatch({ type: "VERIFY_SUCCESS", payload: res.data });
    } catch (err) {
      // 401 = no session, normal on first load — don't log it
      // Only log unexpected errors like 500s or network failures
      if (err?.response?.status !== 401) {
        console.error("Auth verify failed:", err.message);
      }
      if (!cancelled) dispatch({ type: "VERIFY_FAILURE" });
    }
  };

  verify();
  return () => { cancelled = true; };
}, []);

  // ── Auth actions (stable references via useCallback) ────────────────────
  const signIn = useCallback(async (formData) => {
    dispatch({ type: "SIGN_IN_START" });
    try {
      const res = await api.post("/api/auth/signin", formData);
      dispatch({ type: "SIGN_IN_SUCCESS", payload: res.data });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: "SIGN_IN_FAILURE", payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  const signInWithGoogle = useCallback(async (id_token) => {
    dispatch({ type: "SIGN_IN_START" });
    try {
      const res = await api.post("/api/auth/google", { id_token });
      dispatch({ type: "SIGN_IN_SUCCESS", payload: res.data });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: "SIGN_IN_FAILURE", payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  const signOut = useCallback(async () => {
    dispatch({ type: "SIGN_OUT_START" });
    try {
      await api.post("/api/auth/signout");
      dispatch({ type: "SIGN_OUT_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SIGN_OUT_FAILURE",
        payload: err.response?.data?.message || err.message,
      });
    }
  }, []);

  const updateUser = useCallback(async (id, formData) => {
    dispatch({ type: "UPDATE_USER_START" });
    try {
      const res = await api.post(`/api/user/update/${id}`, formData);
      dispatch({ type: "UPDATE_USER_SUCCESS", payload: res.data });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: "UPDATE_USER_FAILURE", payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    dispatch({ type: "DELETE_USER_START" });
    try {
      await api.delete(`/api/user/delete/${id}`);
      dispatch({ type: "DELETE_USER_SUCCESS" });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: "DELETE_USER_FAILURE", payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  // Expose state + actions
  const value = {
    ...state,
    signIn,
    signInWithGoogle,
    signOut,
    updateUser,
    deleteUser,
    dispatch, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
