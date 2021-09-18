import { useContext, useState } from 'react';
import { AuthContext } from "../helpers/AuthContext";


function HomeContainer() {
    const { setAuthState } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

    return {
        openModal,
        handleOpenModal,
        handleCloseModal
    }
    
}

export default HomeContainer;
