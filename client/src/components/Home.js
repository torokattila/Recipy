import React, { useContext } from "react";
import HomeContainer from "../containers/HomeContainer";
import Navbar from "../shared/Navbar";
import Tooltip from "@material-ui/core/Tooltip";
import RecipeCard from "./RecipeCard";
import { AuthContext } from "../helpers/AuthContext";

import "./Home.css";

import PopupModal from "./PopupModal";

function Home() {
	const {
		isCreateRecipeModal,
		setRecipeTitle,
		setRecipePreparation,
		openModal,
		handleOpenModal,
		handleOpenRecipeModal,
		handleCloseModal,
		handleSubmitRecipe,
		userRecipies,
		handleDeleteRecipe,
		modalRecipeTitle,
		modalRecipeContent
	} = HomeContainer();
	const { authState } = useContext(AuthContext);

	return (
		<div>
			<Navbar />

			<div className="welcome-message-container">
				<h3 className="welcome-message">Welcome {authState.username}!</h3>
			</div>

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
								<div key={recipe.recipe_id}>
									<RecipeCard
										recipeId={recipe.recipe_id}
										recipeTitle={recipe.title}
										recipeContent={recipe.content}
										handleDeleteRecipe={handleDeleteRecipe}
										handleOpenRecipeModal={
											handleOpenRecipeModal
										}
									/>
								</div>
							);
						})}
					</div>}

			{isCreateRecipeModal
				? <PopupModal
						type="create-form"
						openModal={openModal}
						handleCloseModal={handleCloseModal}
						setRecipeTitle={setRecipeTitle}
						setRecipePreparation={setRecipePreparation}
						handleSubmitRecipe={handleSubmitRecipe}
					/>
				: <PopupModal
						type="recipe-modal"
						recipeTitle={modalRecipeTitle}
						recipeContent={modalRecipeContent}
						openModal={openModal}
						handleCloseModal={handleCloseModal}
						setRecipeTitle={setRecipeTitle}
						setRecipePreparation={setRecipePreparation}
						handleSubmitRecipe={handleSubmitRecipe}
					/>}

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
