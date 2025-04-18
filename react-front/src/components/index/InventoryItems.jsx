import useSWR from 'swr'

async function fetchInventoryItems() {
    console.log('Fetching :>> ');
    const url = "http://127.0.0.1:8080/item/all"
    const itemsRes = await fetch(url)
    const itemsJSON = await itemsRes.json()
    console.log('itemsRes :>> ', itemsJSON);
    return "HEllo"
}

export function InventoryItems() {

    const { data, error, isLoading } = useSWR('/api/user', fetchInventoryItems)

    return (
        <>
            Inventory items list
        </>
    )

}

