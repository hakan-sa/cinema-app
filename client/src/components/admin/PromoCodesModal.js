import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './PromoCodesModal.css';


export default function PromoCodesModal({ managePromoCodesViews, setManagePromoCodesViews }) {
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPromoCodes, setCurrentPromoCodes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchPromoCodes = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivate.get('/admins/promotion');
                setCurrentPromoCodes(response.data);
            } catch (error) {
                console.log("Error fetching promo codes:", error);
            } finally {
                setLoading(false);
            }
        };

        if (managePromoCodesViews.showPromoCodesModal) {
            fetchPromoCodes();
        }
    }, [managePromoCodesViews.showPromoCodesModal]);

    const closeHandler = () => {
        setManagePromoCodesViews((prevContext) => ({
            ...prevContext,
            showPromoCodesModal: false
        }));
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        const requestBody = {
            promoCode: promoCode,
            discount: discount,
            startDate: startDate,
            endDate: endDate
        };
        try {
            await axiosPrivate.post('/admins/promotion', requestBody);
            alert(`Promo Code ${promoCode} succesfully added!`);
            const response = await axiosPrivate.get('/admins/promotion');
            setCurrentPromoCodes(response.data);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Duplicate promotion with the same code exists. Please enter a different code.");
            } else {
                alert("Error adding promo code. Please try again later.");
                console.log("Client: Error adding promo code: ", error);
            }
        }
    };

    const deletePromoCodeHandler = async (promoCodeId) => {
        if (window.confirm("Are you sure you want to delete the promo code?")) {
            try {
                console.log(promoCodeId);
                await axiosPrivate.delete(`/admins/promotion/${promoCodeId}`);
                const response = await axiosPrivate.get('/admins/promotion');
                setCurrentPromoCodes(response.data);
            } catch (error) {
                console.log("Error deleting promo code:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Modal data-bs-theme="dark" className="text-white emailpromos-modal" show={managePromoCodesViews.showPromoCodesModal} onHide={closeHandler} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Manage Promo Codes</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <h4>Add Promo Code</h4>
                        <Form>
                            <FloatingLabel className="mb-3" label="Promo Code">
                                <Form.Control
                                    type="text"
                                    name="code"
                                    value={promoCode}
                                    onChange={(event) => {
                                        // Filter out non-alphanumeric characters and enforce upper case
                                        const filteredValue = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                                        // Update state only if the length is 10 or less
                                        if (filteredValue.length <= 10) {
                                            setPromoCode(filteredValue);
                                        }
                                    }}
                                    maxLength="10" // Helps prevent typing more than 10 characters
                                    autoCapitalize="characters" // Useful mainly on mobile devices
                                    required
                                />
                            </FloatingLabel>
                            <FloatingLabel className="mb-3" label="Discount (Flat)">
                                <Form.Control
                                    type="number"
                                    name="discount"
                                    value={discount}
                                    onChange={(event) => setDiscount(event.target.value)}
                                    required
                                />
                            </FloatingLabel>
                            <FloatingLabel className="mb-3" label="Start Date">
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                    required
                                />
                            </FloatingLabel>
                            <FloatingLabel className="mb-3" label="End Date">
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={endDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                    required
                                />
                            </FloatingLabel>
                        </Form>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={submitHandler}>Add Promo Code</Button>
            </Modal.Footer>
            <Modal.Body className="p-3">
                <h4 className='mb-3'>Current Promo Codes:</h4>
                {currentPromoCodes && currentPromoCodes.length > 0 ? (
                    <div className="promo-cards">
                        {currentPromoCodes.map((promoCode) => (
                            <div className="promo-card" key={promoCode.id}>
                                <div className="promo-discount">
                                    ${promoCode.discount}
                                </div>
                                <div className="promo-info">
                                    <h5><b>{promoCode.promo_code}</b></h5>
                                    <p>Valid until: {promoCode.end_date}</p>
                                    <button className="promo-btn-close" onClick={() => deletePromoCodeHandler(promoCode.id)}>x</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-secondary">No promo codes added.</div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeHandler}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
