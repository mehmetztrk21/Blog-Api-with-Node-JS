
export const serverError=async(next:any)=>{
    console.log("sercer")
    const err: any = new Error("Internal server error.");
    err.statusCode = 500;
    return next(err);
}