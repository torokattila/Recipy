import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

function NavbarContainer() {
	const { setAuthState } = useContext(AuthContext);
	const history = useHistory();

	const handleLogout = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you want to log out?",
			showCancelButton: true
		}).then(response => {
			if (response.value) {
				localStorage.removeItem("accessToken");
				setAuthState({
					username: "",
					id: 0,
					status: false
				});

				history.push("/login");
				window.location.reload(false);
			}
		});
	};

	return {
		handleLogout
	};
}

export default NavbarContainer;
