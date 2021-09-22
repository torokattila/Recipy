import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";

function HomeContainer() {
	const [openModal, setOpenModal] = useState(false);
	const [isCreateRecipeModal, setIsCreateRecipeModal] = useState(false);
	const [recipeModalId, setRecipeModalId] = useState(null);
	const [modalRecipeTitle, setModalRecipeTitle] = useState("");
	const [modalRecipeContent, setModalRecipeContent] = useState("");
	const [recipeTitle, setRecipeTitle] = useState("");
	const [recipePreparation, setRecipePreparation] = useState("");
	const [userRecipies, setUserRecipies] = useState([]);
	
	const history = useHistory();

	const handleOpenModal = () => {
		setIsCreateRecipeModal(true);
		setOpenModal(true);
	};

	const handleOpenRecipeModal = (recipeId, modalRecipeTitle, modalRecipeContent) => {
		setOpenModal(true);
		setIsCreateRecipeModal(false);
		setRecipeModalId(recipeId);
		setModalRecipeTitle(modalRecipeTitle);
		setModalRecipeContent(modalRecipeContent);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleSubmitRecipe = () => {
		const data = { title: recipeTitle, preparation: recipePreparation };

		axios
			.post("http://localhost:3001/api/createrecipe", data, {
				headers: {
					accessToken: localStorage.getItem("accessToken")
				}
			})
			.then(response => {
				if (response.data.error) {
					Swal.fire({
						title: "",
						text: response.data.error,
						type: "error"
					});
				} else {
					handleCloseModal();
					window.location.reload(false);
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleDeleteRecipe = id => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you want to delete this recipe?",
			showCancelButton: true,
		}).then(confirmRespone => {
			if (confirmRespone.value) {
				axios.delete(`http://localhost:3001/api/deleterecipe/${id}`, {
					headers: {
						accessToken: localStorage.getItem("accessToken")
					}
				}).then(response => {
					if (response.data.error) {
						console.log(response.data.error);
						Swal.fire({
							title: "",
							text: response.data.error,
							type: "error"
						});
					} else {
						console.log(response);
						Swal.fire({
							title: "",
							text: response.data,
							type: "success"
						}).then(alertResponse => {
							if (alertResponse.value) {
								window.location.reload(false);
							}
						})
					}
				}).catch(error => {
					console.log(error);
				});
			}
		}).catch(error => {
			console.log(error);
			Swal.fire({
				title: "",
				text: "There was an error with the delete, try again please!",
				type: "error"
			});
		});
	}

	const getUserRecipies = () => {
		if (!localStorage.getItem("accessToken")) {
			history.push("/login");
		} else {
			axios.get("http://localhost:3001/api/getrecipies", {
				headers: {
					accessToken: localStorage.getItem("accessToken")
				}
			}).then(response => {
				setUserRecipies(response.data.recipiesList);
			}).catch(error => {
				console.log(error);
			});
		}
	}

	useEffect(() => {
		getUserRecipies();

		return () => {
			getUserRecipies();
		}
	}, []);

	return {
		recipeModalId,
		setRecipeTitle,
		setRecipePreparation,
		openModal,
		isCreateRecipeModal,
		handleOpenModal,
		handleOpenRecipeModal,
		handleCloseModal,
		handleSubmitRecipe,
		userRecipies,
		handleDeleteRecipe,
		modalRecipeTitle,
		modalRecipeContent
	};
}

export default HomeContainer;
