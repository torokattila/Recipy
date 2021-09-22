import { useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function ProfileContainer() {
	const [newUsername, setNewUsername] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const { authState } = useContext(AuthContext);
	const history = useHistory();

	const handleEditCredentials = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you want to edit your profile data?",
			showCancelButton: true,
			confirmButtonText: "Yes"
		}).then(response => {
			if (response.value) {
				if (
					newUsername.trim() === "" &&
					oldPassword.trim() === "" &&
					newPassword.trim() === ""
				) {
					Swal.fire({
						title: "",
						text:
							"If you want to edit your profile data, fill the username and/or the two password fields down below!",
						type: "error"
					});
				} else {
					axios
						.put(
							"http://localhost:3001/api/editprofile",
							{
                                googleId: authState.google_id,
								oldUsername: authState.username,
								newUsername: newUsername.trim(),
								oldPassword: oldPassword.trim(),
								newPassword: newPassword.trim()
							},
							{
								headers: {
									accessToken: localStorage.getItem(
										"accessToken"
									)
								}
							}
						)
						.then(response => {
							if (response.data.error) {
								Swal.fire({
									title: "",
									text: response.data.error,
									type: "error"
								});
							} else {
								Swal.fire({
									title: "",
									text: response.data.successMessage,
									type: "success"
								}).then(response => {
									if (response.value) {
										history.push("/");
										window.location.reload(false);
									}
								});
							}
						})
						.catch(error => {
							console.log(error);
							Swal.fire({
								title: "",
								text: "There was an error with the update, please try again!",
								type: "error"
							});
						});
				}
			}
		});
	};

	return {
		handleEditCredentials,
		setNewUsername,
		setOldPassword,
		setNewPassword
	};
}

export default ProfileContainer;
