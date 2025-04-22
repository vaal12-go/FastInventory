

export function ItemTextFilter({filterText, onChange} = {filterText:""}) {

    function createOnChangeHandler() {
        return (evt)=>{
            if(onChange) {
                onChange(evt, evt.target.value)
            }
        }
    }

    return (
        <>
            <input 
                type="text" 
                className="form-control" 
                placeholder="Filter items"
                value={filterText}
                onChange={createOnChangeHandler()}
                 />
        </>
    )
}