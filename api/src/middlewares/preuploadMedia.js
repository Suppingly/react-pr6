import { uploadHeader } from "./uploadMedia.js";
export const checkThenUpload = (req, res, next) => {
    if (req.body.image!=undefined){
        uploadHeader.single('image')
    }
}