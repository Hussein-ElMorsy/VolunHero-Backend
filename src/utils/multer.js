import multer from 'multer'
export const fileValidation = {
    image: ['image/jpeg','image/jpg', 'image/png', 'image/gif',"image/svg+xml"],
    file: ['application/pdf', 'application/msword'],
    video: ['video/mp4']
}
export function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb('In-valid file format', false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}