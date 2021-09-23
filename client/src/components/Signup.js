import React, {useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import LoginSignupForm from "../shared/LoginSignupForm";

function Signup() {
	const { pageLanguage } = useContext(AuthContext);

	return (
		<LoginSignupForm pageName={pageLanguage === "EN" ? "Sign up" : "Regisztráció"} />
	);
}

export default Signup;
