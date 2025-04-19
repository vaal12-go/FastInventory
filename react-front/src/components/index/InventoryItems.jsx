import useSWR from 'swr'
import { InventoryItem } from './InventoryItem';
import './tags.css'
import './card.css'

async function fetchInventoryItems() {
    console.log('Fetching :>> ');
    const url = "http://127.0.0.1:8080/item/all"
    const itemsRes = await fetch(url)
    const itemsJSON = await itemsRes.json()
    console.log('itemsRes :>> ', itemsJSON);
    return itemsJSON
}

export function InventoryItems() {
    // console.log('InventoryItems :>> ');
    const { data, error, isLoading } = useSWR('/api/user', fetchInventoryItems)

    if (error) {
        console.error('error :>> ', { err: error });
        return (
            <>
                <div>failed to load: </div>
                {error.message ?
                    <div> {error.message} </div> : ""
                }
                {
                    error.stack ? <div>{error.stack}</div> : ""
                }
            </>
        )
    }

    if (isLoading) {
        return (
            <div>Items loading...</div>
        )
    }

    console.log('data: :>> ', data);
    return (
        <>
            {
                data.items.map((itm) => {
                    // console.log("drawing item:", itm)
                    return (
                        <InventoryItem item={itm} />
                    )
                })
            }
        </>
    )
}//export function InventoryItems() {

