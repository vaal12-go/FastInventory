// import React from 'react';
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

import useSWR from 'swr'
import { InventoryItem } from './InventoryItem';
import './tags.css'
import './card.css'
import { ItemTextFilter } from './ItemTextFilter';

// import { BASE_API_URL } from '../../lib/constants';
import { Pagination } from './Pagination';
import { getFilterParams } from '../../lib/utils';

import useCookieConfig from "../../hooks/useCookieConfig";



async function fetchInventoryItems(filters, apiURL) {
    const filterURLParams = Object.keys(filters).reduce((accum, val) => {
        if (filters[val])
            accum += `&${val}=${filters[val]}`
        return accum
    }, "")
    const url = `${apiURL}item/all?${filterURLParams}`
    // console.log('fetchInventoryItems url :>> ', url);
    const itemsRes = await fetch(url)
    const itemsJSON = await itemsRes.json()
    console.log('itemsJSON :>> ', itemsJSON);
    return itemsJSON
}

export function InventoryItems() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState(getFilterParams(searchParams))
    const [totalPages, setTotalPages] = useState(0)
    const [apiURL] = useCookieConfig("api_url")

    // console.log('apiURL :>> ', apiURL);

    useEffect(() => {
        setFilters(getFilterParams(searchParams))
    }, [searchParams])

    useEffect(() => {
        // console.log('apiURL before mutate :>> ', apiURL);
        mutate()
    }, [filters, apiURL])

    const { data, error, isLoading, mutate } = useSWR('/api/user', async () => {
        if(apiURL == "") {
            // console.log('Empty apiURL in useSWR :>> ');
            return {}
        } else {
            // console.log('apiURL in useSWR:>> ', apiURL);
            return await fetchInventoryItems(filters, apiURL)
        }
        
    });
    if (error) {
        console.error('error :>> ', error);
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
                {
                    data.items.map((itm) => {
                        return (<InventoryItem
                            item={itm}
                            key={`item_${itm.uuid}`} />)
                    })
                }
            </div>
        </div>
        {/* <!-- END Items --> */}

        {/* <!-- Pagination --> */}
        <div className="row">
            <div className="col-9 fs-4" id="pagination-holder">
                {data ?
                    <Pagination total_pages={data.total_pages} />
                    : ""}
            </div>
        </div>
        {/* <!-- END Pagination --> */}
    </>)
}//export function InventoryItems() {

