import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';

import NavBar from '../general/NavBar';
import AddMovieModal from './AddMovieModal';
import EditMovieModal from './EditMovieModal';
import AdminDashboard from './AdminDashboard';
import EmailPromosModal from './EmailPromosModal';
import ScheduleMovieModal from './ScheduleMovieModal';
import PromoCodesModal from './PromoCodesModal';
import ManageUsersModal from './ManageUsersModal';

import './AdminPanel.css';

export default function AdminPanel() {

    const [manageMoviesViews, setManageMoviesViews] = useState({
        showAddMovieModal: false,
        showEditMovieModal: false,
    });

    const [manageScheduleMovieViews, setManageScheduleMovieViews] = useState({
        showScheduleMovieModal: false,
    })

    const [managePromoCodesViews, setManagePromoCodesViews] = useState({
        showEmailPromosModal: false,
    })

    const [manageEmailPromosViews, setManageEmailPromosViews] = useState({
        showEmailPromosModal: false,
    })

    const [manageManageUsersViews, setManageManageUsersViews] = useState({
        showEmailPromosModal: false,
    })

    const showAddMovieModalHandler = () => {
        setManageMoviesViews((prevContext) => ({
            ...prevContext,
            showAddMovieModal: true
        }));
    }

    const showEditMovieModalHandler = () => {
        setManageMoviesViews((prevContext) => ({
            ...prevContext,
            showEditMovieModal: true
        }));
    }

    const showScheduleMovieModalHandler = () => {
        setManageScheduleMovieViews((prevContext) => ({
            ...prevContext,
            showScheduleMovieModal: true
        }));
    }

    const showEmailPromosModalHandler = () => {
        setManageEmailPromosViews((prevContext) => ({
            ...prevContext,
            showEmailPromosModal: true
        }));
    }

    const showPromoCodesModalHandler = () => {
        setManagePromoCodesViews((prevContext) => ({
            ...prevContext,
            showPromoCodesModal: true
        }));
    }

    const showManageUsersModalHandler = () => {
        setManageManageUsersViews((prevContext) => ({
            ...prevContext,
            showManageUsersModal: true
        }));
    }

    return (
        <div className="adminpanel-body text-white">
            <NavBar />
            <Container className="mt-5 d-flex flex-column align-items-center">
                {/* Dashboard Statistics Placeholder */}
                <div className="my-4 mb-5 w-100">
                    <h4><i className="material-icons align-middle me-2">analytics</i>Analytics</h4>
                    <AdminDashboard />
                </div>

                {/* Manage Movies */}
                <Container className="w-50">
                    <div className="my-4 mb-5 w-100">
                        <h4><i className="material-icons align-middle me-2">movie</i>Manage Movies</h4>
                        <Button variant="primary" className="w-100 my-2" onClick={showAddMovieModalHandler}>Add Movies</Button>
                        <Button variant="primary" className="w-100 my-2" onClick={showEditMovieModalHandler}>Edit Movies</Button>
                        <Button variant="primary" className="w-100 my-2" onClick={showScheduleMovieModalHandler}>Schedule Movies</Button>
                    </div>

                    {/* Manage Promotions */}
                    <div className="mb-5 w-100">
                        <h4><i className="material-icons align-middle me-2">campaign</i>Manage Promotions</h4>
                        <Button variant="primary" className="w-100 my-2" onClick={showPromoCodesModalHandler}>Manage Promo Codes</Button>
                        <Button variant="primary" className="w-100 my-2" onClick={showEmailPromosModalHandler}>Send Promotional Email</Button>
                    </div>

                    {/* Manage Users */}
                    <div className="mb-5 w-100">
                        <h4><i className="material-icons align-middle me-2">people</i>Manage Users</h4>
                        <Button variant="primary" className="w-100 my-2" onClick={showManageUsersModalHandler}>Search/View Users</Button>
                    </div>
                </Container>
            </Container>

            <AddMovieModal manageMoviesViews={manageMoviesViews} setManageMoviesViews={setManageMoviesViews} />
            <EditMovieModal manageMoviesViews={manageMoviesViews} setManageMoviesViews={setManageMoviesViews} />
            <ScheduleMovieModal manageScheduleMovieViews={manageScheduleMovieViews} setManageScheduleMovieViews={setManageScheduleMovieViews} />
            <PromoCodesModal managePromoCodesViews={managePromoCodesViews} setManagePromoCodesViews={setManagePromoCodesViews} />
            <EmailPromosModal manageEmailPromosViews={manageEmailPromosViews} setManageEmailPromosViews={setManageEmailPromosViews} />
            <ManageUsersModal manageManageUsersViews={manageManageUsersViews} setManageManageUsersViews={setManageManageUsersViews} />

        </div>
    );
}
