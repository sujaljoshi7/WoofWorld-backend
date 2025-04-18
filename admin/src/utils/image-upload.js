// const uploadToImgBB = async (imageFile) => {
//   const formData = new FormData();
//   formData.append("image", imageFile);

//   const imgbbApiKey = "54d95fbd813692cc07c224648c068916"; // replace with your actual key

//   try {
//     const res = await fetch(
//       `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );
//     const data = await res.json();
//     return data.data?.url || null;
//   } catch (error) {
//     console.error("ImgBB upload failed:", error);
//     return null;
//   }
// };

// export default uploadToImgBB;
const uploadToImgBB = async (imageFile) => {
  const apiKey = "54d95fbd813692cc07c224648c068916"; // Replace with your actual ImgBB key

  try {
    // Prepare FormData with image file directly
    const form = new FormData();
    form.append("image", imageFile);

    // Send the POST request with the form data
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: form,
    });

    // Get the response data
    const data = await res.json();

    // Check if the upload was successful
    if (data.success) {
      return data.data.url; // Return the image URL from ImgBB
    } else {
      console.error("ImgBB upload failed:", data);
      return null;
    }
  } catch (err) {
    console.error("Image upload error:", err);
    return null;
  }
};

export default uploadToImgBB;
