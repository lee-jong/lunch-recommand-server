import upload from "./upload";
import addNameException from "./addNameException";
import addAddrException from "./addAddrException";
export default { ...upload, ...addNameException, ...addAddrException };
