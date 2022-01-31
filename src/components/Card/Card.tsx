import { useReducer, useState } from 'react';
import { data } from '../../utils/data';
import CardItem from '../CardItem/CardItem';

import './Card.css';

const Card = () => {
    /** 
     * using useReducer this way basically ensures that any time you call
       setReRenderKey, the `reRenderKey` is set to a new object which will
       make the `key` different resulting in React unmounting the previous
       component and mounting a new one.
    */
    const [reRenderKey, setReRenderKey] = useReducer((key: number) => key + 1, 0);

    const [price, setPrice] = useState<Record<string, number>>({}); // State for managing the Accumulated Price of Top level Card Items

    // Total Price for the Card
    const total = Object.values(price).reduce((individualMainFeaturePrice, current) => individualMainFeaturePrice + current, 0);

    return (
        <div className="card">
            <div className="card__container">
                <h4>
                    <b>Subscription Preferences</b>
                </h4>
                <hr />
                <ul key={reRenderKey}>
                    {data.map((item) => (
                        <CardItem key={item.id} item={item} addSubTotal={setPrice} /> // Top-level Card Items
                    ))}
                </ul>
            </div>
            <div className="footer">
                <hr />
                <div className="footer__container">
                    <p>Total: ${total} / mo</p>
                    <button
                        type="button"
                        onClick={() => {
                            setReRenderKey();
                            setPrice({});
                        }}
                    >
                        Reset
                    </button>
                    <button type="button">Save</button>
                </div>
            </div>
        </div>
    );
};

export default Card;
