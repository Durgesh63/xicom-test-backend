const multer = require('multer')

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and image files are allowed'), false);
    }
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E1)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname.slice(-7))
    }
})

const Upload = multer({ storage: storage, fileFilter: fileFilter })

module.exports = Upload