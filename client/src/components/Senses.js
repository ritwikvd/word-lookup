import React from 'react';
import Sense from "./Sense";

const Senses = ({ senses }) => {

    return (
        <div className="senses-container">
            <ol>
                {senses.map(sense => <li key={sense._id}><Sense {...{sense}}/></li>)}
            </ol>
        </div>
    )
};

export default Senses;
