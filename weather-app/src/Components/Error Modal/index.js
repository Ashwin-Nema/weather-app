import { Modal } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
export const ErrorModal = ({ modal, centered, hidemodal, message }) => {
    const centeredmodal = centered === undefined ? true : false
    return (
        <Modal
            show={modal}
            centered={centeredmodal}
            onHide={hidemodal}
        >
            <Alert severity="error">
                <strong>{message}</strong>
            </Alert>
        </Modal>
    )
}