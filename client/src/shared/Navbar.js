import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExitToAppRounded from "@material-ui/icons/ExitToAppRounded";
import Tooltip from "@material-ui/core/Tooltip";
import NavbarContainer from "../containers/NavbarContainer";
import "./Navbar.css";

function Navbar() {
	const [authState, setAuthState] = useState({
		username: "",
		id: 0,
		status: false
	});
	const history = useHistory();
	const { handleLogout } = NavbarContainer();

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			history.push("/login");
			window.location.reload(false);
		} else {
			axios
				.get("http://localhost:3001/api/auth", {
					headers: {
						accessToken: localStorage.getItem("accessToken")
					}
				})
				.then(response => {
					if (response.data.error) {
						setAuthState({ ...authState, status: false });
					} else {
						setAuthState({
							username: response.data.username,
							id: response.data.user.id,
							status: true
						});
					}
				})
				.catch(error => {
					console.log(error);
				});
		}
	}, []);

	return (
		<div className="navbar-container">
			<div className="icons-container">
				<img
					src="/cook_book.png"
					alt="page_logo"
					className="page-logo"
					onClick={() => {
						history.push("/");
					}}
				/>
				<ul>
					<Tooltip title="Home Page">
						<li>
							<HomeIcon
								className="home-icon"
								onClick={() => {
									history.push("/");
								}}
							/>
						</li>
					</Tooltip>

					<Tooltip title="Profile">
						<li>
							<AccountCircle
								className="profile-icon"
								onClick={() => history.push("/profile")}
							/>
						</li>
					</Tooltip>

					<Tooltip title="Logout">
						<li>
							<ExitToAppRounded
								className="logout-icon"
								onClick={handleLogout}
							/>
						</li>
					</Tooltip>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;
