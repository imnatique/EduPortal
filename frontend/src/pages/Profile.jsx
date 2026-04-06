import { useAuth } from "../hooks/useAuth";
import { useRef, useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error, updateUser, deleteUser, signOut } =
    useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
  });

  const [preview, setPreview] = useState(currentUser?.avatar || "");

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = async (file) => {
    if (!file || !currentUser) return;
    setFilePerc(5);
    try {
      const data = new FormData();
      data.append("profileImage", file);
      const res = await api.post(`/api/user/update/${currentUser._id}`, data);
      const newAvatar = res.data?.avatar || formData.avatar;
      setFormData((prev) => ({ ...prev, avatar: newAvatar }));
      setPreview(newAvatar);
      setFilePerc(100);
    } catch (err) {
      console.error(err);
      setFilePerc(0);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    if (file) formDataToSend.append("profileImage", file);

    const result = await updateUser(currentUser._id, formDataToSend);
    if (result.success) setUpdateSuccess(true);
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser(currentUser._id);
    if (result.success) navigate("/");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="lg:px-[10%] px-[5%] max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-medium text-center my-7 uppercase">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            const selected = e.target.files[0];
            if (selected) {
              setFile(selected);
              setPreview(URL.createObjectURL(selected));
              setFilePerc(1);
            }
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current && fileRef.current.click()}
          src={preview || formData.avatar}
          alt="profile"
          className="rounded-full w-32 h-32 object-cover cursor-pointer self-center mt-2 border-2 border-black hover:opacity-80"
        />

        {filePerc > 0 && filePerc < 100 && (
          <p className="text-black text-center">Uploading {filePerc}%</p>
        )}
        {filePerc === 100 && (
          <p className="text-green-700 text-center">Image uploaded!</p>
        )}

        <input
          type="text"
          placeholder="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="border border-black p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-black p-3 rounded-lg"
        />

        <button
          className="bg-black text-white font-semibold rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
          type="submit"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span
          className="text-red cursor-pointer hover:underline"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span
          className="text-red cursor-pointer hover:underline"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>

      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">User updated successfully!</p>
      )}
    </div>
  );
}
