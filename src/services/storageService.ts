
import { supabase } from "@/lib/supabase";

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadAccommodationPhotos = async (
  files: File[],
  userId: string
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      // Create a unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${index}.${fileExtension}`;
      
      console.log('Uploading file:', fileName);
      
      const { data, error } = await supabase.storage
        .from('accommodation-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('accommodation-photos')
        .getPublicUrl(fileName);

      return {
        url: publicUrl,
        path: fileName
      };
    });

    const results = await Promise.all(uploadPromises);
    console.log('Upload completed:', results);
    return results;
  } catch (error) {
    console.error('Error uploading accommodation photos:', error);
    throw error;
  }
};

export const deleteAccommodationPhoto = async (path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('accommodation-photos')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    console.log('Photo deleted:', path);
  } catch (error) {
    console.error('Error deleting accommodation photo:', error);
    throw error;
  }
};
