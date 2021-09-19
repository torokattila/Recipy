import React from "react";
import HomeContainer from "../containers/HomeContainer";
import Navbar from "../shared/Navbar";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../helpers/AuthContext";
import "./Home.css";

function Home() {
	const {
		setRecipeTitle,
		setRecipePreparation,
		openModal,
		handleOpenModal,
		handleCloseModal,
		handleSubmitRecipe,
		userRecipies,
		handleDeleteRecipe
	} = HomeContainer();
	const useStyles = makeStyles(theme => ({
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		paper: {
			backgroundColor: theme.palette.background.paper,
			border: "none",
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
			borderRadius: 20,
			minWidth: "30vw"
		}
	}));
	const modalClasses = useStyles();

	return (
		<div>
			<Navbar />

			{userRecipies.length === 0
				? <div className="no-recipies-title-container">
						<p>Looks like You have no recipies yet.</p>
						<p>
							Click the + sign on the bottom of the screen to create
							some!
						</p>
					</div>
				: <div className="recipies-list-container">
						{userRecipies.map(recipe => {
							return (
								<div
									className="recipe-card-container"
									key={recipe.recipe_id}
								>
									<button
										className="delete-recipe-button"
										onClick={() => {
											handleDeleteRecipe(recipe.recipe_id);
										}}
									>
										x
									</button>
									<div className="recipe-card-title-container">
										<h1>
											{recipe.title}
										</h1>
									</div>

									<div className="recipe-card-content-container">
										<p>
											{recipe.content}
										</p>
									</div>
								</div>
							);
						})}
					</div>}

			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={openModal}
				onClose={handleCloseModal}
				className={modalClasses.modal}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={openModal}>
					<div className={modalClasses.paper}>
						<h2 className="modal-title">Create your new recipe</h2>

						<div className="create-recipe-form">
							<div className="create-recipe-input-container">
								<input
									type="text"
									placeholder="Recipe title"
									className="recipe-title-input"
									onChange={event =>
										setRecipeTitle(event.target.value)}
								/>
							</div>

							<div className="create-recipe-input-container">
								<textarea
									placeholder="Preparation"
									className="recipe-preparation-textarea"
									onChange={event =>
										setRecipePreparation(
											event.target.value
										)}
								/>
							</div>

							<div className="create-recipe-button-container">
								<button
									className="create-recipe-button"
									onClick={handleSubmitRecipe}
								>
									Create
								</button>
							</div>
						</div>

						<Tooltip title="Close" placement="top" arrow>
							<button
								className="close-modal-button"
								onClick={handleCloseModal}
							>
								x
							</button>
						</Tooltip>
					</div>
				</Fade>
			</Modal>

			<div className="add-recipe-button-container">
				<Tooltip title="Add new recipe" arrow>
					<button
						className="add-recipe-button"
						onClick={handleOpenModal}
					>
						+
					</button>
				</Tooltip>
			</div>
		</div>
	);
}

export default Home;
