import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

import useSWR from 'swr'
import { InventoryItem } from './InventoryItem';
import './tags.css'
import './card.css'
import { ItemTextFilter } from './ItemTextFilter';
import React from 'react';
import { BASE_API_URL } from '../../lib/constants';

const DEFAULT_ITEMS_ON_PAGE = 6

async function fetchInventoryItems(filters) {
    const filterURLParams = Object.keys(filters).reduce((accum, val) => {
        if (filters[val])
            accum += `&${val}=${filters[val]}`
        return accum
    }, "")
    const url = `${BASE_API_URL}/item/all?${filterURLParams}`
    console.log('url :>> ', url);
    const itemsRes = await fetch(url)
    const itemsJSON = await itemsRes.json()
    console.log('itemsJSON :>> ', itemsJSON);
    return itemsJSON
}

export function getFilterParams(searchParams) {
    return {
        search_term: searchParams.get("itemFilter") ? searchParams.get("itemFilter") : "",
        tags: searchParams.get("tags") ? searchParams.get("tags") : "",
        page: searchParams.get("page") ? searchParams.get("page") : 1,
        items_on_page: searchParams.get("items_on_page") ? searchParams.get("items_on_page") : DEFAULT_ITEMS_ON_PAGE,
    }
}

export function InventoryItems() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState(getFilterParams(searchParams))

    useEffect(() => {
        setFilters(getFilterParams(searchParams))
    }, [searchParams])

    useEffect(() => {
        mutate()
    }, [filters])

    const { data, error, isLoading, mutate } = useSWR('/api/user', async () => {
        return await fetchInventoryItems(filters)
    });
    if (error) {
        console.error('error :>> ', { err: error });
        return (<>
            <div>failed to load: </div>
            {error.message ? <div> {error.message} </div> : ""}
            {error.stack ? <div>{error.stack}</div> : ""}
        </>)
    }
    if (isLoading) { return (<div>Items loading...</div>) }


    function onTextFilterChange(evt, filterText) {
        setSearchParams((params) => {
            if (filterText == "") {
                params.delete("itemFilter")
            } else {
                params.set("itemFilter", filterText)
            }
            return params
        });
    }

    return (<>
        <div className="row">
            <div className="col-2">
                <h3>List of items</h3>
            </div>

            <div className="col-6">
                <ItemTextFilter
                    filterText={filters.search_term}
                    onChange={onTextFilterChange} />
            </div>
        </div>
        {/* <!-- Filters and selections --> */}
        {/* <div className="row pe-4 mb-3">
                <div className="col-4">
                </div>
              </div> */}
        {/* <!-- TODO: add selection checkboxes to items, 'select all' checkbox and delete button for mass deletion of items --> */}
        {/* <!-- END Filters and selections --> */}

        {/* <!-- Items --> */}
        <div className="row">
            <div className="col d-flex flex-wrap">
                {/* <!-- ITEMS start --> */}
                {
                    data.items.map((itm) => {
                        return (<InventoryItem
                            item={itm}
                            key={`item_${itm.uuid}`} />)
                    })
                }
                {/* <!-- ITEMS END --> */}
            </div>
        </div>
        {/* <!-- END Items --> */}
    </>)
}//export function InventoryItems() {

