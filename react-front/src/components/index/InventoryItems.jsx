import {useEffect, useState} from 'react'
import { useSearchParams } from 'react-router-dom';

import useSWR from 'swr'
import { InventoryItem } from './InventoryItem';
import './tags.css'
import './card.css'
import { ItemTextFilter } from './ItemTextFilter';
import React from 'react';

const ITEMS_ON_PAGE = 6

async function fetchInventoryItems(filters) {
    // console.log('filters in fetchInventoryItems :>> ', filters);
    // console.log('filters.keys :>> ', Object.keys(filters));
    const filterURLParams = Object.keys(filters).reduce((accum, val)=>{
        // console.log('object props:>> ', val);
        if(filters[val])
            accum += `&${val}=${filters[val]}`
        return accum
    }, "")
    // console.log('filterURLParams :>> ', filterURLParams);
    const url = `http://127.0.0.1:8080/item/all?${filterURLParams}`
    console.log('url :>> ', url);
    const itemsRes = await fetch(url)
    const itemsJSON = await itemsRes.json()
    console.log('itemsJSON :>> ', itemsJSON);
    return itemsJSON
}

export function InventoryItems() {
    const [searchParams, setSearchParams] = useSearchParams()
    // function getFilterParams() {
    //     return {
    //         search_term : searchParams.get("itemFilter")? searchParams.get("itemFilter") : "",
    //         tags : searchParams.get("tags")? searchParams.get("tags") : "",
    //     }
    // }
    

    function getFilterParams() {
        // console.log('getFilterParams searchParams.get("itemFilter") :>> ', searchParams.get("itemFilter"));
        return {
            search_term : searchParams.get("itemFilter")? searchParams.get("itemFilter") : "",
            tags : searchParams.get("tags")? searchParams.get("tags") : "",
            page: searchParams.get("page") ? searchParams.get("page") : 1,
        }
    }

    const [filters, setFilters] = useState(getFilterParams())

    useEffect(()=>{
        // console.log('searchParamsChanged in useEffect :>> ');
        // console.log('searchParams.get("itemFilter") :>> ', searchParams.get("itemFilter"));
        setFilters(getFilterParams())
    }, [searchParams])

    useEffect(()=>{
        mutate()
    }, [filters])

    const { data, error, isLoading, mutate } = useSWR('/api/user', async ()=>{
        return await fetchInventoryItems(filters)
    });
    if (error) {
        console.error('error :>> ', { err: error });
        return (<>
            <div>failed to load: </div>
            {error.message ? <div> {error.message} </div> : "" }
            { error.stack ? <div>{error.stack}</div> : "" }
        </>)
    }
    if (isLoading) { return (<div>Items loading...</div>) }
    // console.log('data: :>> ', data);
    

    function onTextFilterChange(evt, filterText) {
        // console.log('filterText :>> ', filterText);
        // setFilters(
        //     { 
        //         ...filters,
        //         search_term : filterText,
        //     }
        // )
        setSearchParams((params) => {
            if(filterText == "") {
                params.delete("itemFilter")
            } else {
                // console.log('Setting search param :>> ', filterText);
                params.set("itemFilter", filterText)
            }
            return params
        });
        // console.log('Search params are set: :>> ', filterText);
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
        {/* <!-- <div className="col-1"><span className="align-middle">[x] all</span></div> --> */}
        {/* <!-- END Filters and selections --> */}

        {/* <!-- Items --> */}
        <div className="row">
            <div className="col">
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

