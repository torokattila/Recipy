import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";

function HomeContainer() {
	const { pageLanguage } = useContext(AuthContext);
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

	const handleOpenRecipeModal = (
		recipeId,
		modalRecipeTitle,
		modalRecipeContent
	) => {
		setOpenModal(true);
		setIsCreateRecipeModal(false);
		setRecipeModalId(recipeId);
		setModalRecipeTitle(modalRecipeTitle);
		setModalRecipeContent(modalRecipeContent);
	};

	const handleGetRandomRecipe = () => {
		const randomElement =
			userRecipies[Math.floor(Math.random() * userRecipies.length)];

		setOpenModal(true);
		setIsCreateRecipeModal(false);
		setRecipeModalId(randomElement.recipe_id);
		setModalRecipeTitle(randomElement.title);
		setModalRecipeContent(randomElement.content);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleSubmitRecipe = () => {
		const data = {
			title: recipeTitle,
			preparation: recipePreparation,
			languageToBackend: pageLanguage
		};

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
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleDeleteRecipe = id => {
		Swal.fire({
			title:
				pageLanguage === "EN" ? "Are you sure?" : "Biztos vagy benne?",
			text:
				pageLanguage === "EN"
					? "Do you want to delete this recipe?"
					: "Biztos törölni szeretnéd ezt a receptet?",
			showCancelButton: true,
			cancelButtonText: pageLanguage === "EN" ? "Cancel" : "Mégse"
		})
			.then(confirmRespone => {
				if (confirmRespone.value) {
					axios
						.delete(
							`http://localhost:3001/api/deleterecipe/${id}`,
							{
								headers: {
									accessToken: localStorage.getItem(
										"accessToken"
									)
								},
								data: {
									languageToBackend: pageLanguage
								}
							}
						)
						.then(response => {
							if (response.data.error) {
								console.log(response.data.error);
								Swal.fire({
									title: "",
									text: response.data.error,
									type: "error"
								});
							} else {
								Swal.fire({
									title: "",
									text: response.data,
									type: "success"
								});
							}
						})
						.catch(error => {
							console.log(error);
						});
				}
			})
			.catch(error => {
				console.log(error);
				Swal.fire({
					title: "",
					text:
						pageLanguage === "EN"
							? "There was an error with the delete, try again please!"
							: "Hiba adódott a törléssel, kérjük próbálja újra!",
					type: "error"
				});
			});
	};

	const getUserRecipies = () => {
		if (!localStorage.getItem("accessToken")) {
			history.push("/login");
		} else {
			axios
				.get("http://localhost:3001/api/getrecipies", {
					headers: {
						accessToken: localStorage.getItem("accessToken")
					}
				})
				.then(response => {
					setUserRecipies(response.data.recipiesList);
				})
				.catch(error => {
					console.log(error);
				});
		}
	};

	useEffect(() => {
		getUserRecipies();
	});

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
		modalRecipeContent,
		handleGetRandomRecipe
	};
}

export default HomeContainer;
