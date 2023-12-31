import {  signOut } from "firebase/auth";
import {auth} from '../firebase';
import { useNavigate } from 'react-router-dom';
 
const Signout = () => {
    const navigate = useNavigate();
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }
    handleLogout();
}
 
export default Signout;