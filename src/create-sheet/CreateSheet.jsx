import React from 'react';
import Form from './Form.jsx';

const CreateSheet = ({setTitle}) => {
    setTitle("New Worksheet");

    return (
        <div className="create-page">
                <nav className="video-nav flex-div">
                    <div className="nav-left flex-div">
                        <i className="fas fa-bars menu-icon hover-div"></i>
                        <div className="hover-div">New Worksheet</div>
                    </div>
                    <div className="nav-middle flex-div">
                        <div className="bar-content">
                            <div className="progress-container" id="main-bar"></div>
                        </div>
                    </div>
                    <div className="nav-right flex-div">
                        <div className="hover-div" id="nav-week">
                            MarginalRabbit45
                        </div>
                        <i className="fas fa-user hover-div"></i>
                    </div>
                </nav>
                {/* content */}
                <div className="container play-container" id="main-box">
                    <div id="form-entry" className="form-container">
                        <Form/>
                    </div>
                </div>
        </div>
    );
};

export default CreateSheet;
