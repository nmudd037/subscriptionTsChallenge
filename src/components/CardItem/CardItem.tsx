import './CardItem.css';

import { useEffect, useState } from 'react';

// Type Declarations for CardItem Props
type TItem = {
    id: number;
    name: string;
    value?: number;
    items?: TItem[];
};

type TCardItemProps = {
    item: { id: number; name: string; value?: number; items?: TItem[] };
    addSubTotal: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    level?: number;
};

const CardItem = ({ item, addSubTotal, level = 0 }: TCardItemProps) => {
    // State for managing the Accumulated Sub Total Price of nested Card Items
    const [subTotal, setSubTotal] = useState<Record<string, number>>({});

    // State for managing the display of nested Card Items only when Parent Card Item is Checked
    const [displayChildren, setDisplayChildren] = useState<Record<string, boolean>>({});

    // Function to calculate the Sub Total Price of nested Card Items
    const total = (nestedCardsSubTotal: Record<string, number>) =>
        Object.values(nestedCardsSubTotal).reduce((nestedCardTotal, current) => nestedCardTotal + current, 0);

    // Function to clear the nested Card Items when a Card Item is unchecked
    const clearChildren = (id: number, cardLevel: number) => {
        Object.keys(subTotal).forEach((nestedCardKey) => {
            if (nestedCardKey.charAt(cardLevel) === `${id}`.charAt(cardLevel)) {
                return setSubTotal({
                    ...subTotal,
                    [nestedCardKey]: 0,
                });
            }

            return null;
        });
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Toggle the display of nested Card Items
        setDisplayChildren({
            ...displayChildren,
            [item.id]: !displayChildren[item.id],
        });

        // When the Card Item is checked the price is stored in the state otherwise the price is cleared from the state
        if (e.target.checked) {
            return setSubTotal({
                ...subTotal,
                [item.id]: +e.target.value,
            });
        }

        return clearChildren(item.id, level);
    };

    useEffect(() => {
        // For each instance of nested Card Item, the Sub Total Price is lifted to the Parent Card Item on each render
        addSubTotal((sub) => ({
            ...sub,
            [item.id]: total(subTotal),
        }));
    }, [addSubTotal, item.id, subTotal]);

    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    // Change Event Handler for the input checkbox of Card Item
                    onChange={handleCheckbox}
                    // Storing the price on each value attribute of Card Item checkbox
                    value={item.value || 0}
                    id={`${item.id}`}
                />
                {item.name} {item.value ? `($${item.value})` : total(subTotal) ? `($${total(subTotal)})` : `(-)`}
            </label>{' '}
            <ul>
                {
                    // Recursion of Card Item Component if it is checked and has nested Card Items
                    displayChildren[item.id] &&
                        item.items?.map((nestedItem) => (
                            <CardItem key={nestedItem.id} item={nestedItem} addSubTotal={setSubTotal} level={level + 1} />
                        ))
                }
            </ul>
        </li>
    );
};

export default CardItem;
