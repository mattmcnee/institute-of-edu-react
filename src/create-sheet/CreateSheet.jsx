import React from 'react';
import Form from './Form.jsx';
import Nav from '/src/Nav';

const CreateSheet = ({setTitle}) => {
    setTitle("New Worksheet");

    return (
        <div className="create-page">
            <Nav title={"Create Worksheet"}/>
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
