
const { Candidate } = require('../models/candidate.models');
const ApiError = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { checkVaoidEmail } = require('../utils/utils');



// @desc Register 
// @route POST /api/v1/register
// @access Public
const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, permanentaddress, residentialaddress } = req.body;

    if (!residentialaddress) {
        throw new ApiError(400, "Please enter your residential address")
    }

    if ([residentialaddress.street1, residentialaddress.street2].some(field => !field?.trim())) {
        throw new ApiError(400, "Please enter your residential address")
    }
    // check user is valid input
    if ([firstName, email, lastName].some(field => !field?.trim()) || !checkVaoidEmail(email)) {
        throw new ApiError(400, "Please provide valid inputs")
    }

    // // check user is exits
    // const candidateInstance = new Candidate();
    // const isUserExist = await candidateInstance.isUserExist(email);
    // if (isUserExist) {
    //     throw new ApiError(409, 'Another Candidate already associated with this email.')
    // }
    const documents = req.body.documents;


    if ((req.files && Array.isArray(req.files) && req.files.length > 0)) {
        let files = req.files;
        if (files.length < 2) {
            throw new ApiError(400, "At least 2 documents are required.")
        }
        // Check if documents length matches req.files length
        if (documents.length !== files.length) {
            throw new ApiError(400, 'The number of documents does not match the number of uploaded files');
        }

        // Validate file types against the expected types
        const fileinfo = files.map(file => ({
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
        }));
        const fileData = []
        for (let i = 0; i < documents.length; i++) {
            const expectedType = documents[i].filetype;
            const file = fileinfo[i];

            let actualType;
            if (file.mimetype === 'application/pdf') {
                actualType = 'pdf';
            } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                actualType = 'image';
            } else {
                actualType = 'unknown';
            }

            if (expectedType !== actualType) {
                throw new ApiError(400, `File type mismatch for ${file.originalname}. Expected ${expectedType}, got ${actualType}`);
            }

            fileData.push({
                filename: documents[i].filename,
                filetype: expectedType,
                fileurl: file.path
            })
        }
        // save data to bd

        const saveData = {
            firstName,
            lastName,
            email,
            residentialaddress: {
                street1: residentialaddress.street1,
                street2: residentialaddress.street2
            },
            documents: fileData
        }

        if (permanentaddress) {
            saveData.permanentaddress = {
                street1: permanentaddress.street1,
                street2: permanentaddress.street2
            }
        }
        const candidateInstance = new Candidate(saveData);

        const candidate = await candidateInstance.save()
        res.status(201).json(
            new ApiResponse(201, candidate, "candidate registered Successfully")
        )

    } else {
        throw new ApiError(400, `Documents are required`);
    }
});





module.exports = { register };