const uploadToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const imgbbApiKey = "54d95fbd813692cc07c224648c068916"; // replace with your actual key

  try {
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.data?.url || null;
  } catch (error) {
    console.error("ImgBB upload failed:", error);
    return null;
  }
};

export default uploadToImgBB;
