// import path from "path";
// import { supabase } from "../utils/supabaseClient.js";
// import { errorHandler } from "../utils/error.js";

// export const uploadAvatar = async (req, res, next) => {
//   try {
//     if (!supabase) {
//       return next(errorHandler(500, "Supabase is not configured"));
//     }

//     if (!req.file) {
//       return next(errorHandler(400, "No file provided"));
//     }

//     const bucket = process.env.SUPABASE_BUCKET || "avatar";
//     const extension = path.extname(req.file.originalname) || ".jpg";
//     const fileName = `${req.user.id}-${Date.now()}${extension}`;

//     const { error: uploadError } = await supabase.storage
//       .from(bucket)
//       .upload(fileName, req.file.buffer, {
//         contentType: req.file.mimetype,
//         upsert: true,
//       });

//     if (uploadError) {
//       return next(errorHandler(400, uploadError.message));
//     }

//     const { data: publicUrlData } = supabase.storage
//       .from(bucket)
//       .getPublicUrl(fileName);

//     return res.status(200).json({
//       url: publicUrlData?.publicUrl || "",
//     });
//   } catch (err) {
//     return next(err);
//   }
// };

// import path from "path";
// import { supabase } from "../utils/supabaseClient.js";
// import { errorHandler } from "../utils/error.js";

// /* ================= PROFILE AVATAR UPLOAD (EXISTING) ================= */
// export const uploadAvatar = async (req, res, next) => {
//   try {
//     if (!supabase) {
//       return next(errorHandler(500, "Supabase is not configured"));
//     }

//     if (!req.file) {
//       return next(errorHandler(400, "No file provided"));
//     }

//     const bucket = process.env.SUPABASE_BUCKET || "avatar";
//     const extension = path.extname(req.file.originalname) || ".jpg";
//     const fileName = `${req.user.id}-${Date.now()}${extension}`;

//     const { error: uploadError } = await supabase.storage
//       .from(bucket)
//       .upload(fileName, req.file.buffer, {
//         contentType: req.file.mimetype,
//         upsert: true,
//       });

//     if (uploadError) {
//       return next(errorHandler(400, uploadError.message));
//     }

//     const { data: publicUrlData } = supabase.storage
//       .from(bucket)
//       .getPublicUrl(fileName);

//     return res.status(200).json({
//       url: publicUrlData?.publicUrl || "",
//     });
//   } catch (err) {
//     return next(err);
//   }
// };

// /* ================= LISTING IMAGES UPLOAD (NEW) ================= */
// export const uploadListingImages = async (req, res, next) => {
//   try {
//     if (!supabase) {
//       return next(errorHandler(500, "Supabase is not configured"));
//     }

//     if (!req.files || req.files.length === 0) {
//       return next(errorHandler(400, "No files provided"));
//     }

//     if (req.files.length > 6) {
//       return next(errorHandler(400, "Maximum 6 images allowed"));
//     }

//     const bucket = process.env.SUPABASE_BUCKET || "avatar";
//     const uploadedUrls = [];

//     for (const file of req.files) {
//       const extension = path.extname(file.originalname) || ".jpg";
//       const fileName = `listings/${req.user.id}-${Date.now()}${extension}`;

//       const { error: uploadError } = await supabase.storage
//         .from(bucket)
//         .upload(fileName, file.buffer, {
//           contentType: file.mimetype,
//           upsert: false,
//         });

//       if (uploadError) {
//         return next(errorHandler(400, uploadError.message));
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from(bucket)
//         .getPublicUrl(fileName);

//       uploadedUrls.push(publicUrlData?.publicUrl || "");
//     }

//     return res.status(200).json({
//       success: true,
//       urls: uploadedUrls,
//     });
//   } catch (err) {
//     return next(err);
//   }
// };
import path from "path";
import { supabase } from "../utils/supabaseClient.js";
import { errorHandler } from "../utils/error.js";

/* ================= PROFILE AVATAR UPLOAD ================= */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!supabase) return next(errorHandler(500, "Supabase not configured"));
    if (!req.file) return next(errorHandler(400, "No file provided"));

    const bucket = "avatar"; // keep existing bucket
    const extension = path.extname(req.file.originalname) || ".jpg";
    const fileName = `${req.user.id}-${Date.now()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) return next(errorHandler(400, uploadError.message));

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return res.status(200).json({
      url: publicUrlData?.publicUrl || "",
    });
  } catch (err) {
    return next(err);
  }
};

/* ================= LISTING IMAGES UPLOAD ================= */
export const uploadListingImages = async (req, res, next) => {
  try {
    if (!supabase) return next(errorHandler(500, "Supabase not configured"));
    if (!req.files || req.files.length === 0)
      return next(errorHandler(400, "No files provided"));
    if (req.files.length > 6)
      return next(errorHandler(400, "Maximum 6 images allowed"));

    const bucket = "avatar"; // same bucket
    const uploadedUrls = [];

    for (const file of req.files) {
      const extension = path.extname(file.originalname) || ".jpg";
      const fileName = `listings/${req.user.id}-${Date.now()}${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) return next(errorHandler(400, uploadError.message));

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrlData?.publicUrl || "");
    }

    return res.status(200).json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (err) {
    return next(err);
  }
};
