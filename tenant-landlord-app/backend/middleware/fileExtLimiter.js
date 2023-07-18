// import { Path } from "react-router-dom"

// const fileExtLimiter = (allowExtArray) => {
//     return (req, res, next) => {
//         const files = req.files

//         const fileExtensions = []
//         Object.keys(files).forEach(key => {
//             fileExtensions.push(path.extname(files[key].name))
//         })

//         //Are file extension allowed?
//         const allowed = fileExtensions.every(ext => allowExtArray.includes(ext))

//         if(!allowed){
//             const message = `Upload failed. Only ${allowedExtArray.toString()} allowed.`.replaceAll(",", ", ");
//             return res.status(422).json({status: "error", message})
//         }

//         next()
//     }
// }

// export default fileExtLimiter