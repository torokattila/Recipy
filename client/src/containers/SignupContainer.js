import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../helpers/AuthContext";

function SignupContainer() {
	const [signupUsername, setSignupUsername] = useState("");
	const [signupPassword, setSignupPassword] = useState("");
	const [passwordAgain, setPasswordAgain] = useState("");
	const [hidePassword, setHidePassword] = useState(true);
	const [isPassword, setIsPassword] = useState(true);

	const { setAuthState } = useContext(AuthContext);
	const history = useHistory();

	const handleSignup = () => {
		const data = {
			username: signupUsername,
			password: signupPassword,
			passwordAgain: passwordAgain
		};

		axios
			.post("http://localhost:3001/api/register", data)
			.then(response => {
                if (response.data.error) {
                    Swal.fire({
                        title: "",
                        text: response.data.error,
                        type: "error"
                    });
                } else {
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true
                    });

                    history.push("/");
                }
			})
			.catch(error => {
				console.log(error);
                Swal.fire({
                    title: "",
                    text: "There was an error with the registration, please try again!",
                    type: "error"
                });
			});
	};

	const togglePasswordIcon = () => {
		setHidePassword(!hidePassword);
		setIsPassword(!isPassword);
	};

	return {
		signupUsername,
		setSignupUsername,
		signupPassword,
		setSignupPassword,
		passwordAgain,
		setPasswordAgain,
		hidePassword,
		isPassword,
		setIsPassword,
		setHidePassword,
		handleSignup,
		togglePasswordIcon
	};
}

export default SignupContainer;
