export function Tag({tag, selected}) {
    // console.log('selected:', selected, '   tag :>> ', tag);
    return (
            (selected==true) ? 
                <div className="rounded-1 tag-selected" 
                    key={"selected_tag_"+tag.uuid}>{tag.tag}</div> 
                    :
                <div className="rounded-1 tag-unselected" key={"unselected_tag_"+tag.uuid}>{tag.tag}</div>
    )    
}