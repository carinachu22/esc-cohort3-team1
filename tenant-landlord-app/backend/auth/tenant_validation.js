import { verify } from "jsonwebtoken";

export const checkTenantToken = (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
        token = token.slice(7);
        verify(token, "paolom8", (error, decoded) => {
        if (error) {
            return res.json({
            success: 0,
            message: "Invalid token",
            });
        } else {
            next();
        }
        });
    } else {
        return res.json({
        success: 0,
        message: "Access denied: You are unauthorized!",
        });
    }
};
