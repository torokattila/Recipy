import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../helpers/AuthContext";

function LoginContainer() {
	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [hidePassword, setHidePassword] = useState(true);
	const [isPassword, setIsPassword] = useState(true);

	const { setAuthState } = useContext(AuthContext);
	const history = useHistory();

	const handleChangeLanguage = languageType => {
		const data = { language: languageType };
		axios
			.post("http://localhost:3001/api/changelanguage", data)
			.then(response => {
				window.location.reload(false);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const togglePasswordIcon = () => {
		setHidePassword(!hidePassword);
		setIsPassword(!isPassword);
	};

	const handleLogin = () => {
		const data = { username: loginUsername, password: loginPassword };

		axios
			.post("http://localhost:3001/api/login", data)
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
						google_id: response.data.google_id,
						status: true
					});

					history.push("/");
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	const loginGoogle = response => {
		const data = {
			username: response.profileObj.givenName,
			googleId: response.profileObj.googleId
		};

		axios
			.post("http://localhost:3001/api/login", data)
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
						google_id: response.data.google_id,
						status: true
					});

					history.push("/");
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	return {
		loginUsername,
		setLoginUsername,
		loginPassword,
		setLoginPassword,
		isPassword,
		setIsPassword,
		handleLogin,
		loginGoogle,
		hidePassword,
		setHidePassword,
		togglePasswordIcon,
		handleChangeLanguage
	};
}

export default LoginContainer;
