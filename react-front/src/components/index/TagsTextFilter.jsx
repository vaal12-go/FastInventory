

export function TagsTextFilter({onChange}) {
    function onChangeHandler() {
      return (evt)=>{
        // console.log('evt :>> ', evt);
        // console.log('evt.target.value :>> ', evt.target.value);
        if(onChange) {
          onChange(evt, evt.target.value)
        }
      }
    }

    return(
        <div className="row mb-1">
              <div className="col">
                <div id="tags-search-div">
                  <input type="text" 
                    className="form-control" 
                    id="tag_search_input"
                    placeholder="Search tags"
                    onChange={onChangeHandler()} />
                </div>
              </div>
            </div>
    )
}
