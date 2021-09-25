import React, { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import Tooltip from "@material-ui/core/Tooltip";
import "./RecipeCard.css";

function RecipeCard({
	recipeId,
	recipeTitle,
	recipeContent,
	handleDeleteRecipe,
	handleOpenRecipeModal
}) {
	const { pageLanguage } = useContext(AuthContext);
	return (
		<div className="recipe-card-container">
			<Tooltip title={pageLanguage === "EN" ? "Delete" : "Törlés"} arrow>
				<button
					className="delete-recipe-button"
					onClick={() => {
						handleDeleteRecipe(recipeId);
					}}
				>
					x
				</button>
			</Tooltip>

			<div
				onClick={() => {
					handleOpenRecipeModal(recipeId, recipeTitle, recipeContent);
				}}
			>
				<div className="recipe-card-title-container">
					<h1>
						{recipeTitle}
					</h1>
				</div>

				<div className="recipe-card-content-container">
					<p className="recipe-card-content">
						{recipeContent}
					</p>
				</div>
			</div>
		</div>
	);
}

export default RecipeCard;
