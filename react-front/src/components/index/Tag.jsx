export function Tag({tag, selected, onSelectClick, onUnselectClick}) {
    // console.log('selected:', selected, '   tag :>> ', tag);
    function onSelectClickHandler() {
        return (evt)=>{
            // console.log('evt :>> ', evt);
            evt.preventDefault();
            if(onSelectClick) onSelectClick(evt, tag);
        }
    }

    function onUnselectClickHandler() {
        return (evt)=> {
            // console.log('onUnselectClickHandler evt :>> ', evt);
            evt.preventDefault();
            if(onUnselectClick) onUnselectClick(evt, tag);
        }
    }
 
    return (
            (selected==true) ? 
                <div className="rounded-1 tag-selected" 
                    key={"selected_tag_"+tag.uuid}>
                        {tag.tag}
                        <a href="#" onClick={onUnselectClickHandler()}>
                            <img className="tag-selected-unselect-img" 
                                    src="https://47d9ff2a-28cb-4d41-9232-c82085911742.mdnplay.dev/shared-assets/images/examples/warning.svg" alt="" />
                        </a>
                </div> 
                    :
                <div className="rounded-1 tag-unselected" 
                        key={"unselected_tag_"+tag.uuid}>
                        <a className="tag-unselected-link" href="#" onClick={onSelectClickHandler()}>{tag.tag}</a>
                </div>
    )    
}