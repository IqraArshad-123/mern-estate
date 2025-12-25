import path from "path";
import { supabase } from "../utils/supabaseClient.js";
import { errorHandler } from "../utils/error.js";

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!supabase) {
      return next(errorHandler(500, "Supabase is not configured"));
    }

    if (!req.file) {
      return next(errorHandler(400, "No file provided"));
    }

    const bucket = process.env.SUPABASE_BUCKET || "avatar";
    const extension = path.extname(req.file.originalname) || ".jpg";
    const fileName = `${req.user.id}-${Date.now()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return next(errorHandler(400, uploadError.message));
    }

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