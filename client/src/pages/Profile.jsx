import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    password: "",
  });
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        username: currentUser.username || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
      }));
    }
  }, [currentUser]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUploadError(null);
    setUpdateSuccess(false);

    const data = new FormData();
    data.append("file", file);

    try {
      setFileUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Could not upload image");
      }
      setFormData((prev) => ({ ...prev, avatar: result.url }));
    } catch (err) {
      setFileUploadError(err.message);
    } finally {
      setFileUploading(false);
    }
  };

  const handleChange = (e) => {
    setUpdateSuccess(false);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    const userId = currentUser?._id || currentUser?.id;
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    if (!payload.avatar) delete payload.avatar;
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Update failed");
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const avatarSrc =
    formData.avatar ||
    currentUser?.avatar ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const handleDeleteUser = async () => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
        
      }
    };

    const handleSignOut = async () => {
      try {
        dispatch(signOutUserStart());
        const res = await fetch('/api/auth/signout');
        const data = await res.json();
        if (data.success == false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(data.message));
      }

    }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleFileChange}/>
        <img onClick={()=>fileRef.current.click()} src={avatarSrc} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <input value={formData.username} onChange={handleChange} type="text" placeholder='Username' id="username" className="border p-3 rounded-lg"/>
         <input value={formData.email} onChange={handleChange} type="email" placeholder='Email' id="email" className="border p-3 rounded-lg"/>
          <input value={formData.password} onChange={handleChange} type="password" placeholder='Password' id="password" className="border p-3 rounded-lg"/>
          <button disabled={loading || fileUploading} className="bg-slate-700 text-white  rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{fileUploading ? 'Uploading...' : loading ? 'Updating...' : 'Update'}</button>
      </form>
      {fileUploadError && <p className="text-red-700 mt-2">{fileUploadError}</p>}
      {error && <p className="text-red-700 mt-2">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-2">Profile updated</p>}
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
       
    </div>
  )
}
