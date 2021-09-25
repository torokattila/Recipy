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

	const { setAuthState, pageLanguage } = useContext(AuthContext);
	const history = useHistory();

	const handleChangeLanguage = languageType => {
		localStorage.setItem("pageLanguage", languageType);
		window.location.reload(false);
	};

	const togglePasswordIcon = () => {
		setHidePassword(!hidePassword);
		setIsPassword(!isPassword);
	};

	const handleLogin = () => {
		const data = {
			username: loginUsername,
			password: loginPassword,
			languageToBackend: pageLanguage
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

	const loginGoogle = response => {
		const data = {
			username: response.profileObj.givenName,
			googleId: response.profileObj.googleId,
			languageToBackend: pageLanguage
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
