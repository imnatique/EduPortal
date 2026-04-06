import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await signInWithGoogle(credentialResponse.credential);
    if (result.success) navigate("/");
    else alert("Google Sign-in failed: " + result.error);
  };

  const handleGoogleError = () => {
    alert("Google Sign-in failed. Please try again.");
  };

  return (
    <div className="mt-2 flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        size="large"
        shape="rectangular"
      />
    </div>
  );
}