import { supabase } from '../services/supabaseClient';

const bucket = 'company';
export const genericFiles = { 
    profilePicture: "https://oqxdehxgtmolkgmxpten.supabase.co/storage/v1/object/public/company/profile-picture/1751146261117-generic-logo-profile-picture",
    logo: "https://oqxdehxgtmolkgmxpten.supabase.co/storage/v1/object/public/company/logo/1751146249753-generic-logo-logo"
};

// saving file in Supabase
export const addFile = (filePath, file) => {
    if (!supabase) {
        console.warn("Supabase is not configured. File upload skipped.");
        return Promise.resolve({ error: new Error("Supabase not configured") });
    }
    return supabase.storage
    .from(bucket)
    .upload(filePath, file)
    .then(result => {
        return result;
    })
    .catch(error => {
        return error;
    });
};

// getting the file ulr
export const getUlrFile = (filePath) => {
    if (!supabase) {
        console.warn("Supabase is not configured. Returning empty URL.");
        return "";
    }
    return supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)
        .data.publicUrl;
};

// updating the file
export const updateFileByUrl = (fileUrl, newFile) => {
    if (!supabase) {
        console.warn("Supabase is not configured. File update skipped.");
        return Promise.resolve({ error: new Error("Supabase not configured") });
    }
    
    // updating the file
  const fullPath = fileUrl.split('/object/public/')[1];
const [bucketName, ...pathParts] = fullPath.split('/');
const filePath = pathParts.join('/');

return supabase.storage
  .from(bucketName)
  .upload(filePath, newFile, { upsert: true });
    
};

// set file name
export const setFileName = (name) => {
    return name.toLowerCase()
          .normalize("NFD") // separate letters and accents
          .replace(/[\u0300-\u036f]/g, '') // delete accents
          .replace(/[^a-z0-9\s-]/g, '') // delete special chars
          .trim() // delete starting and ending spaces
          .replace(/\s+/g, '-'); // replace spaces between words
};

        
        