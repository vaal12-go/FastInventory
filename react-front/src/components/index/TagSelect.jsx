import useSWR from 'swr'
import { useSearchParams } from 'react-router-dom';

import { TagsSelected } from "./TagsSelected";
import { TagsTextFilter } from "./TagsTextFilter";
import { UnselectedTags } from "./UnselectedTags";

import "./tags.css"
import { useEffect, useState } from 'react';
import { BASE_API_URL } from '../../lib/constants';
import useCookieConfig from "../../hooks/useCookieConfig";


async function fetchTags(apiURL) {
    const url = `${apiURL}tag`
    console.log('fetchTags url :>> ', url);
    const tagsRes = await fetch(url)
    const tagsJSON = await tagsRes.json()
    console.log('tagsJSON :>> ', tagsJSON);
    return tagsJSON
}


export function TagSelect() {
    const [apiURL] = useCookieConfig("api_url")
    const { data, error, isLoading } = useSWR('/tag', async ()=>{
        return await fetchTags(apiURL)}
    )
    const [searchParams, setSearchParams] = useSearchParams()
    const [tagsSelected, setTagsSelected] = useState([])
    const [tagsUnSelected, setTagsUnSelected] = useState([])
    const [tagFilterText, setTagFilterText] = useState("")
    


    function setSelectedTagsURLParam(newTagsSelected) {
        const newURLTags = newTagsSelected.reduce((url_str, new_tag) => {
            if (url_str.length == 0)
                url_str += new_tag.uuid
            else
                url_str += `,${new_tag.uuid}`
            return url_str
        }, "")
        // console.log('newURLTags :>> ', newURLTags);
        setSearchParams((params) => {
            if(newURLTags.length==0)
                params.delete("tags")
            else 
                params.set("tags", newURLTags)
            return params
        })
        const splitTags = populateSelectedTagsArray();
        setTagsSelected(splitTags.selected);
        setTagsUnSelected(splitTags.unselected)
    }//function setSelectedTagsURLParam(newTagsSelected) {

    function onTagSelected(evt, tag) {
        const newTagsSelected = [...tagsSelected];
        newTagsSelected.push(tag);
        setSelectedTagsURLParam(newTagsSelected);
    }

    function onTagUnselected(evt, tag) {
        const newTagsSelected = tagsSelected.filter((old_tag) => old_tag.uuid != tag.uuid)
        setSelectedTagsURLParam(newTagsSelected);
    }

    function populateSelectedTagsArray() {
        const selectedTagArr = []
        let unselectedTagArr = []
        if (data) {
            unselectedTagArr = [...data.tags]
            const tagsSelectedStr = searchParams.get("tags")
            if (tagsSelectedStr != "" && !(tagsSelectedStr === null)) {
                const tagsStrArr = tagsSelectedStr.split(",")
                tagsStrArr.map((tag) => {
                    const fullTagObjArr = unselectedTagArr.filter((fullTag) => fullTag.uuid == tag)
                    if (fullTagObjArr) {
                        selectedTagArr.push(fullTagObjArr[0])
                        unselectedTagArr = unselectedTagArr.filter((unselectedTag) => unselectedTag.uuid != tag)
                    }
                })
            }//if(tagsSelectedStr!="") {
        }; //if(data) {
        return {
            selected: selectedTagArr,
            unselected: unselectedTagArr
        }
    } //function populateSelectedTagsArray() {

    useEffect(() => {
        const splitTags = populateSelectedTagsArray();
        setTagsSelected(splitTags.selected);
        setTagsUnSelected(splitTags.unselected)
    }, [data])

    function onTagFilterChange(evt, filterText) {
        setTagFilterText(filterText)
    }


    if (error) {
        console.error('error :>> ', { err: error });
        return (
            <>
                <div>failed to load: </div>
                {error.message ? <div> {error.message} </div> : ""}
                {error.stack ? <div>{error.stack}</div> : ""}
            </>
        )
    }

    if (isLoading) {
        return (
            <div>Tags loading...</div>
        )
    }

    // console.log('tagsData :>> ', data);

    return (
        <>
            <TagsSelected
                tags={tagsSelected}
                onTagUnselected={onTagUnselected}/>
            <TagsTextFilter 
                onChange={onTagFilterChange}/>
            <UnselectedTags
                tags={tagsUnSelected}
                onTagSelected={onTagSelected}
                filterText={tagFilterText} />
        </>
    )
}