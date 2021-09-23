import React, {useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import LoginSignupForm from "../shared/LoginSignupForm";

function Login() {
	const { pageLanguage } = useContext(AuthContext);
	
	return (
		<LoginSignupForm pageName={pageLanguage === "EN" ? "Login" : "Bejelentkezés"} />
	);
}

export default Login;
