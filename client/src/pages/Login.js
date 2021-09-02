import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";
import { EyeOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined } from "@ant-design/icons";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [hidePassword, setHidePassword] = useState(true);
	const [isPassword, setIsPassword] = useState(true);

	const handleSubmit = () => {
		console.log(username, password);
	};

	const togglePasswordIcon = () => {
		setHidePassword(!hidePassword);
		setIsPassword(!isPassword);
	};

	return (
		<div className="login-page-container">
			<div className="login-page-title-container">
				<h1 className="login-page-main-title">Recipy</h1>
				<h3 className="login-page-subtitle">
					What should I cook today?
				</h3>
			</div>

			<div className="login-page-login-card-container">
				<div className="login-page-card-header-container">
					<div>
						<h1>Login</h1>
					</div>
				</div>

				<form
					action="/loginuser"
					method="post"
					onSubmit={() => handleSubmit()}
				>
					<div className="login-form-container">
						<div>
							<input
								className="credentials-input-field"
								type="text"
								name="login_username"
								id="login-username"
								placeholder="Username"
								autoComplete="off"
								onChange={event =>
									setUsername(event.target.value)}
							/>
						</div>

						<div>
							<input
								className="credentials-input-field"
								type={isPassword ? "password" : "text"}
								name="login_password"
								id="login-password"
								placeholder="Password"
								autoComplete="off"
								onChange={event =>
									setPassword(event.target.value)}
							/>
							<span onClick={() => togglePasswordIcon()}>
							{hidePassword
								? <EyeOutlined className="show-password-icon" />
								: <EyeInvisibleOutlined className="show-password-icon" />}
							</span>
							
						</div>

						<div className="login-button-container">
							<button
								className="login-button"
								type="button"
								onClick={() => handleSubmit()}
							>
								Login
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
