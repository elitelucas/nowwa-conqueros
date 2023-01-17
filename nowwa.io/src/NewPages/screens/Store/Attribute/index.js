import React, { useState, useEffect } from 'react'
import { attributes } from '../../../constants';
import styles from './Attribute.module.sass';
import Checkbox from '../../../components/Checkbox';

const Attribute = ({ name, searchAttr, toggleAttr, className,
    filters,
    selectedFilters,
    setSelectedFilters,
}) => {
    const values = attributes[name]
    const [ open, setOpen ] = useState(false)
    // const img = require(`../../assets/img/gallery/attr/${ name }.svg`)
    const [ searchText, setSearchText ] = useState('')

    const attrSelected = ( attr ) => {
        const index = searchAttr.findIndex(item => item.trait_type === name && item.value === attr)
        return index !== -1
    }

    const filteredValues = values.filter( (item) => item.toUpperCase().indexOf( searchText.toUpperCase() ) !== -1 )

    const selectedCount = values.filter((value) => {
        return searchAttr.findIndex( item => item.trait_type === name && item.value === value ) !== -1
    }).length

    const handleChange = (filter) => {
        if (selectedFilters.includes(filter)) {
          setSelectedFilters(selectedFilters.filter((x) => x !== filter));
        } else {
          setSelectedFilters((selectedFilters) => [...selectedFilters, filter]);
        }
    };

    return (
        <div className='my-2'>
            <div className={styles.flex}
                onClick={ () => setOpen(prev => !prev) }>
                <div className='justify-center items-center'>
                    {/* <div className='attrImg mr-2'><img alt='pic' src={img.default}></img></div> */}
                    <div className='attrName'>{ name }</div>
                    
                    { selectedCount > 0 ? (
                        <div className={styles.attrBadge}>{ selectedCount }</div>
                    ) : null }
                </div>

                <div className='arrowIcon'>
                    <img alt='pic' 
                        src={ open ? "/images/minus.svg" : "/images/plus.svg" }
                    />
                </div>
            </div>

            <div className={`lg:max-h-80 lg:overflow-y-auto relative attrContent px-2 ${ open ? 'active' : '' }`}>
                
                <div
                    className={styles.search}
                >
                    <input
                        className={styles.input}
                        type="text"
                        placeholder='Search...' 
                        value={searchText} 
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <div className={styles.panel}>
                { filteredValues.map((item, index) => (
                     <Checkbox
                        className={styles.checkbox}
                        content={item}
                        onChange={() => toggleAttr(name, item)}
                        // value={selectedFilters.includes(item)}
                        // onChange={() => handleChange(item)}
                        key={index}
                    />
                    // <div 
                    //     className={`attrCheck p-2 ${ attrSelected(item) ? 'active' : '' }`} 
                    //     key={`filter_${index}`} 
                    //     onClick={ () => toggleAttr( name, item ) }
                    //     >
                    //     <div className="attrCheck__btn">
                    //         <button>
                    //         </button> 
                    //     </div>
                    //     <p className="attrCheck__label">{ item }</p>
                    // </div>
                )) }
                </div>
            </div>
        </div>
    )
}

export default Attribute;