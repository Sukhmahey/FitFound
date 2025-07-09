import { supabase } from '../services/supabaseClient';

const bucket = 'company';
export const genericFiles = { 
    profilePicture: "https://oqxdehxgtmolkgmxpten.supabase.co/storage/v1/object/public/company/profile-picture/1751146261117-generic-logo-profile-picture",
    logo: "https://oqxdehxgtmolkgmxpten.supabase.co/storage/v1/object/public/company/logo/1751146249753-generic-logo-logo"
};

// saving file in Supabase
export const addFile = (filePath, file) => {
    supabase.storage
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
    return supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)
        .data.publicUrl;
};

// updating the file
export const updateFileByUrl = (fileUrl, newFile) => {
    
    // updating the file
    const filePath = fileUrl.split('/object/public/')[1];
    const fileElements = filePath.split('/');

    console.log(fileElements[0]);
    console.log(fileElements[1]);
    console.log(fileElements[2]);

    return supabase.storage
    .from(fileElements[0]) // bucket
    .upload( `${fileElements[1]}/${fileElements[2]}`, newFile, { upsert: true });
    
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

        
        